import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  irTareas(): void {
    this.router.navigate(['/tasks']);
  }

  irArbolBinario(): void {
    this.router.navigate(['/arbol-binario']);
  }

  irArbolNario(): void {
    this.router.navigate(['/arbol-nario']);
  }

  cerrarSesion(): void {
    this.auth.salir();
  }
}
