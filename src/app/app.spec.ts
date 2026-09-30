import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('debe instanciarse correctamente', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  it('debe tener el título correcto', () => {
    const app = new App();
    expect(app.titulo).toContain('Árbol Binario de Búsqueda');
  });
});
