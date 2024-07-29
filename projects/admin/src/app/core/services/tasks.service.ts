import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private httpClient = inject(HttpClient);

  createTask(task: Task) {
    return this.httpClient.post('tasks', task);
  }
}
