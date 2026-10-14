import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function useAuth() {
  const authService = inject(AuthService);

  return {
    usuario: authService.usuario,
    cargando: authService.cargando,
    error: authService.error,
    entrar: (email: string, pass: string) => authService.entrar(email, pass),
    registrar: (email: string, pass: string) => authService.registrar(email, pass),
    salir: () => authService.salir(),
    estaLogueado: () => authService.estaLogueado()
  };
}
