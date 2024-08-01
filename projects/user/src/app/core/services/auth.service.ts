import { inject, Injectable, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private allUsers = signal<User[]>([]);
  users = this.allUsers.asReadonly();
  userId = signal<string | null>(null);

  constructor() {
    this.getUsers();
  }

  private getUsers () {
    const subscription = this.httpClient.get<User[]>('auth').subscribe({
      next: users => {
        this.allUsers.set(users.filter(user => user.role === 'user'));
      }
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  createUser (user: User) {
    return this.httpClient.post('auth', user).pipe(
      tap({
        next: _ => {
          this.allUsers.update(oldUsers => [...oldUsers, user])
          localStorage.setItem('uID', user.id!);
          this.userId.set(user.id!);
        }
      })
    );
  }
}
