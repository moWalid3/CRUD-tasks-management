import { Component, inject, output, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../core/services/tasks.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { Status, Task } from '../../../core/models/task.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { FilterService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    CommonModule,
    ConfirmPopupModule,
    CalendarModule,
    FormsModule,
    TranslateModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss',
})
export class AllTasksComponent {
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private toasterService = inject(ToastrService);
  private filterService = inject(FilterService);

  taskNeedUpdate = output<Task>();
  tasks = this.tasksService.tasks;
  users = toSignal(this.authService.getUsers());
  statuses = signal<Status[]>(['In-Progress', 'Completed']);
  rangeDates = signal<Date[] | null>(null);

  getSeverity(status: Status) {
    switch (status) {
      case 'In-Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      default:
        return 'warning';
    }
  }

  onUpdate(task: Task) {
    this.taskNeedUpdate.emit(task);
  }

  onConfirmToDelete(event: Event, taskId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Task?',
      icon: 'fa-solid fa-circle-info',
      acceptButtonStyleClass: 'btn btn-danger',
      rejectButtonStyleClass: 'btn btn-secondary',
      accept: () => {
        this.tasksService.deleteTask(taskId).subscribe({
          next: _ => this.toasterService.success("Task deleted successfully ✅.")
        });
      }
    });
  }

  onFilterGlobal(event: Event, table: Table) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  ngOnInit() {
    // Register the custom date range filter
    this.filterService.register('dateInRange', (deadline: string, bothDatesArr: Date[]): boolean => {
      if (!bothDatesArr || bothDatesArr.some(date => date === null)) {
        return true; // No filter applied
      }

      const dateValue = new Date(deadline).getTime();
      const [start, end] = bothDatesArr;
      return dateValue >= start.getTime() &&  dateValue <= end.getTime();
    });
  }

  // Function to trigger the filter
  onDateRangeChange(event: any, dt: Table) {
    if (this.rangeDates() && this.rangeDates()?.length === 2) {
      dt.filter(this.rangeDates(), 'deadline', 'dateInRange');
    } else {
      dt.filter(null, 'deadline', 'dateInRange'); // Clear filter when no range is selected
    }
  }
}
