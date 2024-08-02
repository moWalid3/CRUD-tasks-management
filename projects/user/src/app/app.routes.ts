import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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

  {
    path: '',
    component: LayoutComponent,
    canMatch: [authGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./pages/tasks/task-details/task-details.component').then(
            (m) => m.TaskDetailsComponent
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
    title: 'Notfound',
  },
];
