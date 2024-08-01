import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.userId() !== null) 
      this.router.navigate(['/']);
  }
}
