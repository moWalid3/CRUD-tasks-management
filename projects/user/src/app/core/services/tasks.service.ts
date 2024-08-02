import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private httpClient = inject(HttpClient);
  private currentUserId = inject(AuthService).userId;

  getUserTasks() {
    return this.httpClient.get<Task[]>('tasks').pipe(
      map(tasks => tasks.filter(task => task.user.id === this.currentUserId()))
    )
  }

  getTaskById(id: string) {
    return this.httpClient.get<Task>('tasks/' + id);
  }

  completeTask(task: Task) {
    return this.httpClient.put(`tasks/${task.id}`, {...task, status: 'Completed'});
  }
}
