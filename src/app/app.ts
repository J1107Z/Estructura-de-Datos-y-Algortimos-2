import { Component, signal } from '@angular/core';
import { ReproductorMusica } from './reproductor-musica/reproductor-musica';
import { HistorialNavegador } from './historial-navegador/historial-navegador';

@Component({
  selector: 'app-root',
  imports: [ReproductorMusica, HistorialNavegador],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  estudiante = 'Julian Andres Zapata Posada';
  codigo = '2240291';
  materia = 'Estructuras de Datos II';

  // Control de vista activa usando signals
  vistaActiva = signal<'musica' | 'navegador'>('musica');

  cambiarVista(vista: 'musica' | 'navegador'): void {
    this.vistaActiva.set(vista);
  }
}
