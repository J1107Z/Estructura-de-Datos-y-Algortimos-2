import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song';

@Component({
  selector: 'app-buscador',
  imports: [FormsModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.scss',
})
export class Buscador {
  musicService = inject(MusicService);

  prefijosEjemplo = ['f', 'm', 'k', 'p', 't'];
  prefijo = signal<string>('f');

  textoExacto = '';
  existeCancion = signal<boolean | null>(null);
  ultimaBusqueda = signal<string>('');

  nuevoTitulo = '';
  nuevoArtista = '';
  nuevasReproducciones: number | null = 500;

  mensaje = signal<string>('');
  esError = signal<boolean>(false);

  get sugerencias(): Song[] {
    return this.musicService.sugerirPorPrefijo(this.prefijo());
  }

  buscarPrefijo(valor: string): void {
    this.prefijo.set(valor);
  }

  verificarCancion(): void {
    const titulo = this.textoExacto.trim();
    if (!titulo) {
      this.mensaje.set('Escribe el nombre de una canción para buscar.');
      this.esError.set(true);
      return;
    }

    const existe = this.musicService.buscarCancion(titulo);
    this.ultimaBusqueda.set(titulo);
    this.existeCancion.set(existe);
    this.mensaje.set('');
  }

  insertarCancion(): void {
    const plays = this.nuevasReproducciones ?? 0;
    const agregada = this.musicService.agregarCancion(
      this.nuevoTitulo,
      this.nuevoArtista,
      plays
    );

    if (agregada) {
      this.mensaje.set(`Canción "${this.nuevoTitulo}" agregada correctamente.`);
      this.esError.set(false);
      this.nuevoTitulo = '';
      this.nuevoArtista = '';
      this.nuevasReproducciones = 500;
    } else {
      this.mensaje.set('Ingresa un título válido que no esté repetido.');
      this.esError.set(true);
    }
  }
}
