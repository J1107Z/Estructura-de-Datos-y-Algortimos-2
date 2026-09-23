import { Component } from '@angular/core';
import { AtmQueue } from './atm-queue/atm-queue';

@Component({
  selector: 'app-root',
  imports: [AtmQueue],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  titulo = 'Challenge 05 - Cajero Automático';
}
