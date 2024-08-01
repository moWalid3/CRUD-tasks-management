import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private authService = inject(AuthService);

  ngOnInit(): void {
    if(localStorage.getItem('uID') !== null) {
      this.authService.userId.set(localStorage.getItem('uID'));
    }
  }
}
