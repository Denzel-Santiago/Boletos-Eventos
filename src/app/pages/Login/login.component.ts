import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email.toLowerCase() === 'admin@example.com') {
      this.router.navigate(['/event']); // Redirige a la página del admin
    } else {
      alert('Usuario no válido');
    }
  }

  goToMenu() {
    this.router.navigate(['/']); // Redirige al menú principal
  }

  loginWithGoogle() {
    console.log("Iniciar sesión con Google");
    this.goToMenu();
  }

  loginWithGitHub() {
    console.log("Iniciar sesión con GitHub");
    this.goToMenu();
  }
}
