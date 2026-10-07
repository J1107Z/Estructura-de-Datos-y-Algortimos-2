import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  // Navega al Reto 06 (Árbol Binario)
  irArbolBinario(): void {
    this.router.navigate(['/arbol-binario']);
  }

  // Navega al Reto 07 (Sidebar con Árbol N-ario)
  irArbolNario(): void {
    this.router.navigate(['/arbol-nario']);
  }

  // Cierra sesión
  cerrarSesion(): void {
    this.auth.salir();
  }
}
