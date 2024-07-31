import { DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private allTasks = signal<Task[]>([]);
  tasks = this.allTasks.asReadonly();

  constructor() {
    this.getAllTasks(); 
  }

  createTask(task: Task) {
    return this.httpClient.post('tasks', task).pipe(
      tap({
        next: _ => this.allTasks.update(oldTasks => [...oldTasks, task])
      })
    );
  }

  private getAllTasks() {
    const subscription = this.httpClient.get<Task[]>('tasks').subscribe({
      next: tasks => this.allTasks.set(tasks)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteTask(taskId: string) {
    return this.httpClient.delete<Task[]>('tasks/' + taskId).pipe(
      tap({
        next: _ => this.allTasks.update(oldTasks => oldTasks.filter(task => task.id !== taskId))
      })
    );
  }

  updateTask(task: Task) {
    return this.httpClient.put(`tasks/${task.id}`, task).pipe(
      tap({
        next: _ => this.allTasks.update(oldTasks => oldTasks.map(t => t.id === task.id ? task : t))
      })
    )
  }
}
