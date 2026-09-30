import { Component } from '@angular/core';
import { TreeView } from './tree-view/tree-view';

@Component({
  selector: 'app-root',
  imports: [TreeView],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  titulo = 'Árbol Binario de Búsqueda (Binary Search Tree)';
}
