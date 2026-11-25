import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song';

@Component({
  selector: 'app-ranking',
  imports: [FormsModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
})
export class Ranking {
  musicService = inject(MusicService);

  topK = signal<number>(5);
  mensaje = signal<string>('');

  get rankingVisible(): Song[] {
    return this.musicService.obtenerTop(this.topK());
  }

  get maxReproducciones(): number {
    const primero = this.musicService.maxHeap.peek();
    return primero && primero.plays > 0 ? primero.plays : 1;
  }

  cambiarTop(k: number): void {
    this.topK.set(k);
  }

  calcularPorcentaje(plays: number): number {
    return Math.round((plays / this.maxReproducciones) * 100);
  }

  verMasPopular(): void {
    const top = this.musicService.maxHeap.peek();
    if (top) {
      this.mensaje.set(`Canción #1 en la raíz (peek): "${top.title}" con ${top.plays} reproducciones.`);
    } else {
      this.mensaje.set('El Max Heap está vacío.');
    }
  }

  extraerTop(): void {
    const sacada = this.musicService.extraerMasPopular();
    if (sacada) {
      this.mensaje.set(`Se extrajo "${sacada.title}" (${sacada.plays} rep.) con pop().`);
    } else {
      this.mensaje.set('No hay canciones para extraer.');
    }
  }

  restablecerHeap(): void {
    this.musicService.reconstruirHeap();
    this.mensaje.set('Max Heap reconstruido con heapify().');
  }
}
