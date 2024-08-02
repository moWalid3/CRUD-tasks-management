import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { NgClass } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [TableModule, NgClass, ConfirmPopupModule, TranslateModule, InputTextModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private toasterService = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  users = signal<User[]>([]);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    const subscription = this.authService.getUsersWithTotalTasks().subscribe({
      next: users => this.users.set(users)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onFilterGlobal(event: Event, table: Table) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  onConfirmToDelete(event: Event, userId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this User?',
      icon: 'fa-solid fa-circle-info',
      acceptButtonStyleClass: 'btn btn-danger',
      rejectButtonStyleClass: 'btn btn-secondary',
      accept: () => {
        this.authService.deleteUser(userId).subscribe({
          next: _ => {
            this.toasterService.success("User deleted successfully ✅.");
            this.getUsers();
          }
        });
      }
    });
  }

  onChangeStatus(user: User) {
    if(user.status === 'active')
      user.status = 'in-active';
    else 
      user.status = 'active';
    
    this.authService.updateUser(user).subscribe({
      next: _ => this.toasterService.success("User status updated successfully.")
    });
  }
}
