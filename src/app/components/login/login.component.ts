import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal<string>('user@mail.com');
  password = signal<string>('123');
  mensajeError = signal<string>('');

  // Procesa el inicio de sesión
  iniciarSesion(): void {
    this.mensajeError.set('');

    const correo = this.email().trim();
    const clave = this.password().trim();

    if (!correo || !clave) {
      this.mensajeError.set('Por favor complete ambos campos.');
      return;
    }

    const exito = this.auth.entrar(correo, clave);
    if (exito) {
      this.router.navigate(['/dashboard']);
    } else {
      this.mensajeError.set('Credenciales incorrectas. Verifique el correo y la contraseña.');
    }
  }
}
