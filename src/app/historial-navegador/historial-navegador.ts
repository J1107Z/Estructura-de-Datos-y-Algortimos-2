import { Component, signal } from '@angular/core';
import { PaginaWeb } from '../models/pagina-web';
import { DoublyLinkedList, DoublyNode } from '../models/doubly-linked-list';

@Component({
  selector: 'app-historial-navegador',
  imports: [],
  templateUrl: './historial-navegador.html',
  styleUrl: './historial-navegador.css',
})
export class HistorialNavegador {
  // Estructura de Lista Doblemente Enlazada
  historial = new DoublyLinkedList<PaginaWeb>();

  // Puntero al nodo de la página web actual
  nodoActual: DoublyNode<PaginaWeb> | null = null;

  // Estados reactivos con Signals (Clase 02)
  paginaActual = signal<PaginaWeb | null>(null);
  urlActual = signal<string>('');
  punteroPrev = signal<string>('null (Inicio)');
  punteroNext = signal<string>('null (Fin)');
  puedeRetroceder = signal<boolean>(false);
  puedeAvanzar = signal<boolean>(false);
  totalPaginas = signal<number>(0);
  paginas = signal<PaginaWeb[]>([]);

  constructor() {
    this.cargarHistorialInicial();
  }

  cargarHistorialInicial(): void {
    // Páginas simuladas agregadas mediante append() a la DoublyLinkedList
    this.historial.append({
      titulo: 'Google',
      url: 'https://www.google.com',
    });
    this.historial.append({
      titulo: 'YouTube',
      url: 'https://www.youtube.com',
    });
    this.historial.append({
      titulo: 'Spotify Web',
      url: 'https://open.spotify.com',
    });
    this.historial.append({
      titulo: 'UAO Virtual',
      url: 'https://virtual.uao.edu.co',
    });
    this.historial.append({
      titulo: 'GitHub',
      url: 'https://github.com',
    });

    // Situamos al usuario en la última página visitada (tail)
    this.nodoActual = this.historial.tail;
    this.actualizarEstado();
  }

  actualizarEstado(): void {
    if (this.nodoActual) {
      this.paginaActual.set(this.nodoActual.value);
      this.urlActual.set(this.nodoActual.value.url);
      this.puedeRetroceder.set(this.nodoActual.prev !== null);
      this.puedeAvanzar.set(this.nodoActual.next !== null);
      this.punteroPrev.set(
        this.nodoActual.prev ? this.nodoActual.prev.value.titulo : 'null (Inicio)'
      );
      this.punteroNext.set(
        this.nodoActual.next ? this.nodoActual.next.value.titulo : 'null (Fin)'
      );
    } else {
      this.paginaActual.set(null);
      this.urlActual.set('');
      this.puedeRetroceder.set(false);
      this.puedeAvanzar.set(false);
      this.punteroPrev.set('null');
      this.punteroNext.set('null');
    }
    this.totalPaginas.set(this.historial.size());
    this.paginas.set(this.historial.toArray());
  }

  // Navegación hacia atrás usando el puntero prev
  retroceder(): void {
    if (this.nodoActual && this.nodoActual.prev) {
      this.nodoActual = this.nodoActual.prev;
      this.actualizarEstado();
    }
  }

  // Navegación hacia adelante usando el puntero next
  avanzar(): void {
    if (this.nodoActual && this.nodoActual.next) {
      this.nodoActual = this.nodoActual.next;
      this.actualizarEstado();
    }
  }

  // Permite visitar una nueva página y agregarla al historial (append)
  visitarPagina(tituloInput: HTMLInputElement, urlInput: HTMLInputElement): void {
    const titulo = tituloInput.value.trim();
    let url = urlInput.value.trim();

    if (titulo && url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      this.historial.append({ titulo, url });
      this.nodoActual = this.historial.tail;
      this.actualizarEstado();

      tituloInput.value = '';
      urlInput.value = '';
    }
  }
}
