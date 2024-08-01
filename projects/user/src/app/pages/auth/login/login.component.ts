import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlComponent } from "../../../components/control/control.component";
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ControlComponent, InputTextModule, ProgressSpinnerModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  users = this.authService.users;
  loading = signal(false);

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
  })

  onSubmit() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      const user = this.users().find(user => user.email === this.loginForm.value.email! && user.password === this.loginForm.value.password!);
      
      if(user) 
        this.handleSuccessLogin(user);
      else 
        this.toaster.error("Invalid email or password.")
      
    }, 1000);
  }

  handleSuccessLogin(user: User) {
    this.toaster.success("Login completed successfully.");
    this.authService.userId.set(user.id!);
    localStorage.setItem('uID', user.id!);
    this.router.navigate(['/']);
  }
}
