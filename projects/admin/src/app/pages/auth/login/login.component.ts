import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit{
  private authService = inject(AuthService);
  private admin = toSignal(this.authService.getAdmin());
  private toaster = inject(ToastrService);
  private router = inject(Router);

  loading = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    role: new FormControl('admin')
  })

  ngOnInit(): void {
    if(this.authService.authId())
      this.router.navigate(['/']);
  }

  onSubmit() {
    this.loading.set(true);
    setTimeout(() => {

      if(this.isAdmin()) 
        this.handleSuccessLogin();
      else 
        this.toaster.error("Email or Password wrong ⚠️");
      
      this.loading.set(false);

    }, 500);
  }

  private handleSuccessLogin() {
    this.toaster.success("Success Login ✅");
    this.router.navigate(['/']);
    localStorage.setItem('authId', this.admin()?.id!);
    this.authService.authId.set(this.admin()?.id);
  }

  private isAdmin() {
    if(this.admin()?.email === this.loginForm.value.email && this.admin()?.password === this.loginForm.value.password) {
      return true;
    }

    return false;
  }
}
