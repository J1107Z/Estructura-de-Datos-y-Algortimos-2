import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Componente para la ruta 404 (Wildcard)
@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="contenedor-404">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <a routerLink="/login" class="enlace-inicio">Ir al inicio</a>
    </div>
  `,
  styles: [`
    .contenedor-404 {
      text-align: center;
      padding: 60px 20px;
      font-family: "Times New Roman", Times, serif;
      color: #000000;
    }
    h1 {
      font-size: 42px;
      margin: 0 0 10px 0;
    }
    p {
      font-size: 17px;
      margin: 0 0 20px 0;
    }
    .enlace-inicio {
      font-size: 16px;
      color: #000000;
      text-decoration: underline;
    }
  `],
})
export class NoEncontradoComponent {}
