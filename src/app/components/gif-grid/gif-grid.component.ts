import { Component, inject } from '@angular/core';
import { GiphyService } from '../../services/giphy.service';
import { GifCardComponent } from '../gif-card/gif-card.component';

@Component({
  selector: 'app-gif-grid',
  imports: [GifCardComponent],
  templateUrl: './gif-grid.component.html',
  styleUrl: './gif-grid.component.css'
})
export class GifGridComponent {
  protected giphyService = inject(GiphyService);
}
