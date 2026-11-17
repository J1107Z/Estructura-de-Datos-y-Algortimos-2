import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GiphyService } from '../../services/giphy.service';

@Component({
  selector: 'app-busqueda',
  imports: [FormsModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  protected giphyService = inject(GiphyService);

  termino = signal<string>('smile');
  metodoSeleccionado = signal<'fetch' | 'axios'>('fetch');
  private temporizador?: ReturnType<typeof setTimeout>;

  sugerencias: string[] = ['smile', 'cats', 'code', 'dance', 'excited', 'coffee'];

  alEscribir(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.termino.set(valor);

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.temporizador = setTimeout(() => {
      const query = valor.trim();
      if (query.length > 0) {
        this.giphyService.buscar(query, this.metodoSeleccionado());
      } else {
        this.giphyService.gifs.set([]);
        this.giphyService.ultimoTermino.set('');
      }
    }, 400);
  }

  seleccionarMetodo(metodo: 'fetch' | 'axios'): void {
    this.metodoSeleccionado.set(metodo);
    const query = this.termino().trim();
    if (query) {
      this.giphyService.buscar(query, metodo);
    }
  }

  buscarSugerencia(sugerencia: string): void {
    this.termino.set(sugerencia);
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
    this.giphyService.buscar(sugerencia, this.metodoSeleccionado());
  }
}
