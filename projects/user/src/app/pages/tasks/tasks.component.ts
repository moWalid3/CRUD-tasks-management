import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TasksService } from '../../core/services/tasks.service';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '../../core/models/task.model';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DataViewModule, ButtonModule, TagModule, DatePipe, RouterLink, ProgressSpinnerModule, NgClass, TranslateModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private toaster = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.getUserTasks();
  }

  getUserTasks() {
    const subscription = this.tasksService.getUserTasks().pipe(
      map(tasks => tasks.sort((a, b) => {
        if (a.status === 'Completed' && b.status === 'In-Progress') {
          return 1; 
        } else if (a.status === 'In-Progress' && b.status === 'Completed') {
          return -1; 
        } else {
          return 0;
        }
      }))
    ).subscribe({
      next: tasks => this.tasks.set(tasks)
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onComplete(task: Task) {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);

      this.tasksService.completeTask(task).subscribe({
        next: _ =>{
          this.toaster.success("Task completed successfully.");
          this.getUserTasks();
        } 
      })

    }, 1000);
  }

}
