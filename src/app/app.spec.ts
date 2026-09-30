import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { App } from './app';
import { MenuTreeService } from './services/menu-tree.service';

describe('App & MenuTreeService', () => {
  it('debe instanciarse correctamente el componente App', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  it('debe construir el árbol N-ario con la raíz y sus hijos principales en español', () => {
    const service = new MenuTreeService();
    const tree = service.getTree();

    expect(tree.root).not.toBeNull();
    expect(tree.root?.children.length).toBe(5);

    const titulosPrincipales = tree.root?.children.map(c => c.value.title);
    expect(titulosPrincipales).toEqual([
      'Resumen General',
      'Mensajería Interna',
      'Configuración de Cuenta',
      'Soporte y Asistencia',
      'Cerrar Sesión',
    ]);
  });

  it('debe contener los submenús de Configuración y Soporte', () => {
    const service = new MenuTreeService();
    const tree = service.getTree();

    const configNode = tree.root?.children.find(c => c.value.title === 'Configuración de Cuenta');
    expect(configNode).toBeDefined();
    expect(configNode?.children.length).toBe(5);

    const soporteNode = tree.root?.children.find(c => c.value.title === 'Soporte y Asistencia');
    expect(soporteNode).toBeDefined();
    expect(soporteNode?.children.length).toBe(3);
  });
});
