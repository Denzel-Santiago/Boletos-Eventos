import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email.toLowerCase() === 'admin@example.com') {
      this.router.navigate(['/']); // Redirige a la página de admin
    } else {
      alert('Usuario no válido');
    }
  }
}
