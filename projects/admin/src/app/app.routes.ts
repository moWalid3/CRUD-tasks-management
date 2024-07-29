import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TasksAdminComponent } from './pages/tasks-admin/tasks-admin.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksAdminComponent },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/manage-users/manage-users.component').then(
            (m) => m.ManageUsersComponent
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
  },
];
