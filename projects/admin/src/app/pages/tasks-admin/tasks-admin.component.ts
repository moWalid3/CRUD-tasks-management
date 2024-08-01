import { Component, signal } from '@angular/core';
import { AddTaskComponent } from './add-task/add-task.component';
import { AllTasksComponent } from './all-tasks/all-tasks.component';
import { Task } from '../../core/models/task.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks-admin',
  standalone: true,
  imports: [AddTaskComponent, AllTasksComponent, TranslateModule],
  templateUrl: './tasks-admin.component.html',
  styleUrl: './tasks-admin.component.scss',
})
export class TasksAdminComponent {
  visible = signal<boolean>(false);
  taskNeedUpdate = signal<Task | null>(null);

  onNeedUpdateTask(task: Task) {
    this.taskNeedUpdate.set(task);
    this.visible.set(true);
  }

  onCloseForm() {
    this.visible.set(false);
    this.taskNeedUpdate.set(null);
  }
}
