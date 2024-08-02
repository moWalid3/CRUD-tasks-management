import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/auth.model';
import { map, tap } from 'rxjs';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private tasksService = inject(TasksService);
  authId = signal<string | undefined>(undefined);

  getAdmin() {
    return this.httpClient.get<User[]>('auth').pipe(
      map(users => users.filter(user => user.role === 'admin')[0])
    );
  }

  getUsers() {
    return this.httpClient.get<User[]>('auth').pipe(
      map(users => users.filter(user => user.role === 'user'))
    );
  }

  getUsersWithTotalTasks() {
    const tasks = this.tasksService.tasks;
    return this.getUsers().pipe(
      map(users =>  users.map(user => {
        user.total_tasks = 0;
        tasks().forEach(task => {
          if(task.user.id === user.id) {
            (user.total_tasks as number) += 1;
          }
        })
  
        return user;
      }))
    )
  }

  deleteUser(id: string) {
    const tasks = this.tasksService.tasks;
    return this.httpClient.delete(`auth/${id}`).pipe(
      tap({
        next: _ => {
          tasks().forEach(task => {
            if(task.user.id === id)
              this.tasksService.deleteTask(task.id!);
          })
        }
      })
    )
  }

  updateUser(user: User) {
    const tasks = this.tasksService.tasks;
    return this.httpClient.put(`auth/${user.id}`, user).pipe(
      tap({
        next: _ => {
          tasks().forEach(task => {
            if(task.user.id === user.id) {
              task.user.status = user.status;
              this.tasksService.updateTask(task);
            }
          })
        }
      })
    )
  }

}
