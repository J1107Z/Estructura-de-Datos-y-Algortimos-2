import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

// Servicio de autenticación global usando Signals
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router?: Router;

  // Señal que almacena el nombre/correo del usuario autenticado
  usuario = signal<string | null>(this.obtenerUsuarioInicial());

  constructor() {
    try {
      this.router = inject(Router, { optional: true }) ?? undefined;
    } catch {
      this.router = undefined;
    }
  }

  // Lee el usuario almacenado en la sesión para persistir recargas
  private obtenerUsuarioInicial(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('usuario_activo');
    }
    return null;
  }

  // Valida credenciales e inicia sesión
  entrar(email: string, pass: string): boolean {
    const correoLimpio = email.trim().toLowerCase();
    const claveLimpia = pass.trim();

    if (correoLimpio === 'user@mail.com' && claveLimpia === '123') {
      this.usuario.set(correoLimpio);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('usuario_activo', correoLimpio);
      }
      return true;
    }

    return false;
  }

  // Cierra sesión y redirige al login
  salir(): void {
    this.usuario.set(null);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('usuario_activo');
    }
    this.router?.navigate(['/login']);
  }

  // Comprueba si existe una sesión activa
  estaLogueado(): boolean {
    return this.usuario() !== null;
  }
}
