import { Component } from '@angular/core';
import { SearchEngine } from './components/search-engine/search-engine';

@Component({
  selector: 'app-root',
  imports: [SearchEngine],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
