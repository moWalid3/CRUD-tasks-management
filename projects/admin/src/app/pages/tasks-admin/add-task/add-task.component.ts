import { Component, inject, input, model, OnChanges, output, signal, viewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileRemoveEvent, FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { NgIf } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/auth.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    NgIf,
    InputTextareaModule,
    CalendarModule,
    AddTaskComponent,
    ReactiveFormsModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnChanges{
  private tasksService = inject(TasksService);
  private authService = inject(AuthService);
  private toaster = inject(ToastrService);
  private fileUpload = viewChild<FileUpload>('fileUpload');
  taskNeedUpdate = input<Task | null>(null);
  visible = model.required<boolean>();
  closeDialog = output<void>();
  users = toSignal(this.authService.getUsers());
  updateFormChanges = signal(true);

  taskForm = new FormGroup({
    title: new FormControl<string | null>( null, [Validators.required]),
    user: new FormControl<User | null>(null, [Validators.required]),
    deadline: new FormControl<Date | null>(null, [Validators.required]),
    image: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
  })
  
  ngOnChanges(): void {
    if(this.taskNeedUpdate()) {
      this.setDataToForm();

      this.isTheUpdateFormChanges();
    }
  }

  onSubmit() {
    const task = this.generateTask();

    this.tasksService.createTask(task).subscribe({
      next: _ => this.toaster.success("Task added successfully 💯.")
    });

    this.onClose();
  }

  onUpload(event: FileUploadHandlerEvent) {
    this.taskForm.controls.image.patchValue(event.files[0].name);
  }
  
  onRemoveImage(event : FileRemoveEvent) {
    this.taskForm.controls.image.patchValue(null);
  }

  onClose() {
    this.closeDialog.emit();
    this.taskForm.reset();
    this.fileUpload()?.clear();
  }

  onUpdateTask() {
    const task = this.generateTask();

    this.tasksService.updateTask(task).subscribe({
      next: _ => this.toaster.success("Task updated successfully ✅.")
    })

    this.onClose();
  }

  private generateTask(): Task {
    return {
      id: this.taskNeedUpdate() === null ? new Date().getTime().toString() : this.taskNeedUpdate()?.id,
      title: this.taskForm.value.title!,
      user: this.taskForm.value.user!,
      deadline: this.taskForm.value.deadline!,
      image: this.taskForm.value.image!,
      description: this.taskForm.value.description!,
      status: 'In-Progress',
    }
  }

  private isTheUpdateFormChanges() {
    this.taskForm.valueChanges.subscribe({
      next: values => {
        if(
          this.taskNeedUpdate()?.title === values.title
          && this.taskNeedUpdate()?.description === values.description
          && this.taskNeedUpdate()?.image === values.image
          && this.taskNeedUpdate()?.user.id === values.user?.id
          && new Date(this.taskNeedUpdate()?.deadline!).toISOString() === values.deadline?.toISOString()
        ) {
          this.updateFormChanges.set(true);
        } else {
          this.updateFormChanges.set(false)
        }
      }
    })
  }

  setDataToForm() {
    this.taskForm.patchValue({
      title: this.taskNeedUpdate()?.title,
      description: this.taskNeedUpdate()?.description,
      image: this.taskNeedUpdate()?.image,
      deadline: new Date(this.taskNeedUpdate()!.deadline),
      user: this.taskNeedUpdate()?.user!
    })
  }
}
