import { Component, signal } from '@angular/core';
import { Cancion } from '../models/cancion';
import { LinkedList, Node } from '../models/linked-list';

@Component({
  selector: 'app-reproductor-musica',
  imports: [],
  templateUrl: './reproductor-musica.html',
  styleUrl: './reproductor-musica.css',
})
export class ReproductorMusica {
  // Estructura de Lista Enlazada Simple (Clase 03)
  lista = new LinkedList<Cancion>();

  // Puntero al nodo actual en reproducción
  nodoActual: Node<Cancion> | null = null;

  // Estados reactivos con Signals (Clase 02)
  cancionActual = signal<Cancion | null>(null);
  posicionActual = signal<number>(1);
  haTerminado = signal<boolean>(false);
  totalCanciones = signal<number>(0);
  canciones = signal<Cancion[]>([]);

  constructor() {
    this.cargarCancionesIniciales();
  }

  cargarCancionesIniciales(): void {
    // Canciones solicitadas agregadas mediante append() a la LinkedList
    this.lista.append({
      titulo: 'La Romana',
      artista: 'Bad Bunny y El Alfa',
      duracion: '3:53',
    });
    this.lista.append({
      titulo: 'POR QUÉ SERÁ',
      artista: 'Grupo Frontera y Maluma',
      duracion: '3:45',
    });
    this.lista.append({
      titulo: 'El granjero',
      artista: 'Arcángel',
      duracion: '4:10',
    });
    this.lista.append({
      titulo: 'SUPERSAYAYIN',
      artista: 'Topboy TGR',
      duracion: '2:58',
    });
    this.lista.append({
      titulo: 'Te Hubieras Ido Antes',
      artista: 'Julión Álvarez y su Norteño Banda',
      duracion: '4:15',
    });

    // Iniciar en el primer nodo (head)
    this.nodoActual = this.lista.head;
    this.actualizarEstado();
  }

  actualizarEstado(): void {
    if (this.nodoActual) {
      this.cancionActual.set(this.nodoActual.value);
      this.haTerminado.set(false);
    } else {
      this.cancionActual.set(null);
      this.haTerminado.set(true);
    }
    this.totalCanciones.set(this.lista.size());
    this.canciones.set(this.lista.toArray());
  }

  // Avanza secuencialmente al siguiente nodo en la lista
  siguienteCancion(): void {
    if (this.nodoActual && this.nodoActual.next) {
      this.nodoActual = this.nodoActual.next;
      this.posicionActual.set(this.posicionActual() + 1);
      this.actualizarEstado();
    } else {
      // Llegó al final (puntero apunta a null)
      this.nodoActual = null;
      this.haTerminado.set(true);
      this.cancionActual.set(null);
    }
  }

  // Reinicia la reproducción al inicio (head)
  reiniciarPlaylist(): void {
    this.nodoActual = this.lista.head;
    this.posicionActual.set(1);
    this.actualizarEstado();
  }

  // Permite agregar una nueva canción usando append
  agregarCancion(
    tituloInput: HTMLInputElement,
    artistaInput: HTMLInputElement,
    duracionInput: HTMLInputElement
  ): void {
    const titulo = tituloInput.value.trim();
    const artista = artistaInput.value.trim();
    const duracion = duracionInput.value.trim() || '3:00';

    if (titulo && artista) {
      this.lista.append({ titulo, artista, duracion });
      tituloInput.value = '';
      artistaInput.value = '';
      duracionInput.value = '';

      // Si la lista había terminado, opcionalmente volver a enlazar
      if (!this.nodoActual && !this.cancionActual()) {
        this.nodoActual = this.lista.tail;
        this.posicionActual.set(this.lista.size());
      }
      this.actualizarEstado();
    }
  }
}
