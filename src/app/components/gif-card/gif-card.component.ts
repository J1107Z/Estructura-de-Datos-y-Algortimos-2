import { Component, Input } from '@angular/core';
import { Gif } from '../../models/gif.model';

@Component({
  selector: 'app-gif-card',
  templateUrl: './gif-card.component.html',
  styleUrl: './gif-card.component.css'
})
export class GifCardComponent {
  @Input({ required: true }) gif!: Gif;
}
