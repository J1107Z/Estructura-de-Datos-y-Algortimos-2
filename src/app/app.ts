import { Component } from '@angular/core';
import { Buscador } from './components/buscador/buscador';
import { Ranking } from './components/ranking/ranking';
import { Recomendaciones } from './components/recomendaciones/recomendaciones';

@Component({
  selector: 'app-root',
  imports: [Buscador, Ranking, Recomendaciones],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
