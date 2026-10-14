import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { useAuth } from '../../hooks/use-auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  readonly authHook = useAuth();

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
      await this.authHook.entrar(correo, clave);
      this.router.navigate(['/tasks']);
    } catch (err: any) {
      this.mensajeError.set(
        this.authHook.error() || 'Error al iniciar sesión. Verifica tus datos.'
      );
    } finally {
      this.cargando.set(false);
    }
  }
}
