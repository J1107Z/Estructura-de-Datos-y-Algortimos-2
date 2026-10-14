import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router?: Router;

  readonly usuario = signal<string | null>(this.obtenerUsuarioInicial());
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    try {
      this.router = inject(Router, { optional: true }) ?? undefined;
    } catch {
      this.router = undefined;
    }

    try {
      onAuthStateChanged(auth, (user: User | null) => {
        if (user && user.email) {
          this.usuario.set(user.email);
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('usuario_activo', user.email);
          }
        } else {
          const stored = this.obtenerUsuarioInicial();
          if (!stored) {
            this.usuario.set(null);
          }
        }
      });
    } catch {
      // Entorno de pruebas o sin inicializar
    }
  }

  private obtenerUsuarioInicial(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('usuario_activo');
    }
    return null;
  }

  async entrar(email: string, pass: string): Promise<boolean> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const credencial = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const correo = credencial.user.email ?? email.trim();
      this.usuario.set(correo);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('usuario_activo', correo);
      }
      this.cargando.set(false);
      return true;
    } catch (err: any) {
      this.cargando.set(false);
      this.error.set(this.traducirError(err.code || err.message));
      throw err;
    }
  }

  async registrar(email: string, pass: string): Promise<boolean> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const correo = credencial.user.email ?? email.trim();
      this.usuario.set(correo);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('usuario_activo', correo);
      }
      this.cargando.set(false);
      return true;
    } catch (err: any) {
      console.error('Error al registrar en Firebase:', err);
      this.cargando.set(false);
      this.error.set(this.traducirError(err.code || err.message));
      throw err;
    }
  }

  async salir(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      // Ignorar error al cerrar sesion
    }
    this.usuario.set(null);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('usuario_activo');
    }
    this.router?.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return this.usuario() !== null;
  }

  private traducirError(codigo: string): string {
    const cod = (codigo || '').toLowerCase();
    if (cod.includes('email-already-in-use')) {
      return 'Este correo electrónico ya está registrado.';
    }
    if (cod.includes('weak-password')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (cod.includes('invalid-email')) {
      return 'El formato de correo no es válido.';
    }
    if (cod.includes('user-not-found') || cod.includes('wrong-password') || cod.includes('invalid-credential')) {
      return 'Credenciales inválidas. Verifica tu correo y contraseña.';
    }
    if (cod.includes('operation-not-allowed')) {
      return 'El proveedor de autenticación no está habilitado en Firebase.';
    }
    if (cod.includes('too-many-requests')) {
      return 'Demasiados intentos fallidos. Por favor espera un momento.';
    }
    return codigo || 'Ocurrió un error. Intenta nuevamente.';
  }
}
