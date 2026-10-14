import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = signal<string>('');
  password = signal<string>('');
  mensajeError = signal<string>('');
  cargando = signal<boolean>(false);

  async handleLogin(): Promise<void> {
    this.mensajeError.set('');
    const correo = this.email().trim();
    const clave = this.password().trim();

    if (!correo || !clave) {
      this.mensajeError.set('Por favor completa todos los campos.');
      return;
    }

    this.cargando.set(true);
    try {
      await this.authService.entrar(correo, clave);
      await this.router.navigate(['/explorador']);
    } catch (err: any) {
      this.mensajeError.set(
        this.authService.error() || 'Credenciales incorrectas o usuario no registrado.'
      );
    } finally {
      this.cargando.set(false);
    }
  }
}
