import { Component } from '@angular/core';
import { BookStack } from './book-stack/book-stack';

@Component({
  selector: 'app-root',
  imports: [BookStack],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  titulo = 'Challenge 04 - Pila de Libros (Stacks)';
}
