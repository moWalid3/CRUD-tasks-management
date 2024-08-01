import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, FloatLabelModule, ProgressSpinnerModule,
    InputTextModule, RouterLink

  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToastrService);
  private users = this.authService.users;
  loading = signal(false);

  registerForm = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl(null, [Validators.required]),
  }, {validators: this.handleConfirmPassword})

  private handleConfirmPassword(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if(password?.value === confirmPassword?.value) {
      return null;
    } else {
      confirmPassword?.setErrors({matchPassword: 'Password and confirm password is not matching!'});
      return {matchPassword: 'Password and confirm password is not matching!'};
    }
  }

  onSubmit() {
    this.loading.set(true);
    setTimeout(() =>{

    this.loading.set(false)
    
    if(this.users().some(user => user.email === this.registerForm.value.email!)) {
      this.toaster.error("Email already exists. Please try another email address.")
    } else {
      this.createANewUser();
    }
    
    } , 1000);
  }

  createANewUser () {
    const user: User = {
      id: new Date().getTime().toString(),
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      username: this.registerForm.value.username!,
      status: 'active',
      role: 'user'
    }

    this.authService.createUser(user).subscribe({
      next: _ => {
        this.toaster.success("Account created successfully!")
        this.router.navigate(['/']);
      }
    })
  }
}
