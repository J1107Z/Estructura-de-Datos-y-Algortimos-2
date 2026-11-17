import { Component, OnInit, inject } from '@angular/core';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { GifGridComponent } from './components/gif-grid/gif-grid.component';
import { GiphyService } from './services/giphy.service';

@Component({
  selector: 'app-root',
  imports: [BusquedaComponent, GifGridComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected giphyService = inject(GiphyService);

  ngOnInit(): void {
    // Carga inicial con término de ejemplo
    this.giphyService.buscar('smile', 'fetch');
  }
}
