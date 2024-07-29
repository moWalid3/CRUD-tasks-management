import { Component, signal } from '@angular/core';
import { AddTaskComponent } from "./add-task/add-task.component";

@Component({
  selector: 'app-tasks-admin',
  standalone: true,
  imports: [AddTaskComponent],
  templateUrl: './tasks-admin.component.html',
  styleUrl: './tasks-admin.component.scss'
})
export class TasksAdminComponent {
  visible = signal<boolean>(false);
}
