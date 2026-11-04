import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphView } from './components/graph-view/graph-view';

@Component({
  selector: 'app-root',
  imports: [CommonModule, GraphView],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
