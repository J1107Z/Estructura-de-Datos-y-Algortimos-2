import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  clave = '';
  msg = signal('');
  modo = signal<'entrar' | 'crear'>('entrar');

  cambiarModo(nuevoModo: 'entrar' | 'crear') {
    this.modo.set(nuevoModo);
    this.msg.set('');
  }

  async enviar() {
    if (this.modo() === 'entrar') {
      await this.entrar();
    } else {
      await this.registrar();
    }
  }

  async entrar() {
    this.msg.set('');
    const { error } = await this.auth.entrar(this.email, this.clave);
    if (error) this.msg.set(error.message);
    else this.router.navigate(['/tareas']);
  }

  async registrar() {
    this.msg.set('');
    const { data, error } = await this.auth.registrar(this.email, this.clave);
    if (error) {
      this.msg.set(error.message);
    } else if (data.session) {
      this.router.navigate(['/tareas']);
    } else {
      this.msg.set('Cuenta creada. Revisa tu correo o inicia sesión.');
      this.modo.set('entrar');
    }
  }
}
