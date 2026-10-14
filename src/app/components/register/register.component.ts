import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');
  mensajeError = signal<string>('');
  cargando = signal<boolean>(false);

  async handleRegister(): Promise<void> {
    this.mensajeError.set('');
    const correo = this.email().trim();
    const clave = this.password().trim();
    const confirm = this.confirmPassword().trim();

    if (!correo || !clave) {
      this.mensajeError.set('Por favor completa todos los campos.');
      return;
    }

    if (clave.length < 6) {
      this.mensajeError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (confirm && clave !== confirm) {
      this.mensajeError.set('Las contraseñas no coinciden.');
      return;
    }

    this.cargando.set(true);
    try {
      await this.authService.registrar(correo, clave);
      await this.router.navigate(['/explorador']);
    } catch (err: any) {
      this.mensajeError.set(
        this.authService.error() || 'Error al registrar la cuenta.'
      );
    } finally {
      this.cargando.set(false);
    }
  }
}
