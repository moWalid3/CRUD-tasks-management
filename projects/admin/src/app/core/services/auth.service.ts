import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/auth.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
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
}
