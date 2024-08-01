import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
    ],
  },
  
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'Login',
      },
    ],
  },

  {path: '**', loadComponent: () => import('./shared/notfound/notfound.component').then(m => m.NotfoundComponent), title: 'Notfound'}
];
