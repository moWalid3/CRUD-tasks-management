import { Component } from '@angular/core';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
