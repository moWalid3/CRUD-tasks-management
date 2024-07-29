import { Component, inject, model, output, viewChild } from '@angular/core';
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
    ReactiveFormsModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  private tasksService = inject(TasksService);
  private authService = inject(AuthService);
  private toaster = inject(ToastrService);
  private fileUpload = viewChild<FileUpload>('fileUpload');
  visible = model.required<boolean>();
  closeDialog = output<void>();
  users = toSignal(this.authService.getUsers());

  taskForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    userId: new FormControl(null, [Validators.required]),
    deadline: new FormControl<Date | null>(null, [Validators.required]),
    image: new FormControl<File | null>(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  })

  onSubmit() {
    const task: Task = {
      title: this.taskForm.value.title!,
      userId: this.taskForm.value.userId!,
      deadline: this.taskForm.value.deadline!,
      image: this.taskForm.value.image?.name!,
      description: this.taskForm.value.description!,
    };

    this.tasksService.createTask(task).subscribe({
      next: _ => this.toaster.success("Task added successfully 💯.")
    });
    this.onClose();
  }

  onUpload(event: FileUploadHandlerEvent) {
    this.taskForm.controls.image.patchValue(event.files[0]);
  }
  
  onRemoveImage(event : FileRemoveEvent) {
    this.taskForm.controls.image.patchValue(null);
  }

  onClose() {
    this.closeDialog.emit();
    this.taskForm.reset();
    this.fileUpload()?.clear();
  }
}
