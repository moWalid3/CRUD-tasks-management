import { Component, inject, input, signal, DestroyRef } from '@angular/core';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../core/models/task.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [DatePipe, ProgressSpinnerModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  loading = signal(false);
  id = input.required<string>();
  task = signal<Task | null>(null);

  ngAfterViewInit(): void {
    const subscription = this.tasksService.getTaskById(this.id()).subscribe({
      next: task => this.task.set(task),
      error: _ => this.router.navigate(['/notfound'])
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onComplete() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);

      this.tasksService.completeTask(this.task()!).subscribe({
        next: _ => {
          this.toaster.success("Task completed successfully.")
          this.router.navigate(['/']);
        }
      })
      
    }, 1000);
  }
}
