import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './services/auth.service';
import { BinaryTree } from './models/binary-tree';
import { NaryTree } from './models/nary-tree';
import { App } from './app';

describe('Challenge 08 - Pruebas Generales', () => {
  it('debe instanciar App correctamente', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
      authService = new AuthService();
      authService.usuario.set(null);
    });

    it('inicia sesión con credenciales correctas user@mail.com y 123', () => {
      const resultado = authService.entrar('user@mail.com', '123');
      expect(resultado).toBe(true);
      expect(authService.estaLogueado()).toBe(true);
      expect(authService.usuario()).toBe('user@mail.com');
    });

    it('rechaza credenciales incorrectas', () => {
      const resultado = authService.entrar('admin@mail.com', 'password');
      expect(resultado).toBe(false);
      expect(authService.estaLogueado()).toBe(false);
      expect(authService.usuario()).toBeNull();
    });

    it('cierra sesión y limpia el usuario activo', () => {
      authService.entrar('user@mail.com', '123');
      expect(authService.estaLogueado()).toBe(true);

      authService.salir();
      expect(authService.estaLogueado()).toBe(false);
      expect(authService.usuario()).toBeNull();
    });
  });

  describe('BinaryTree (Reto 06)', () => {
    it('inserta valores BST y genera recorridos in-order, pre-order y post-order', () => {
      const tree = new BinaryTree();
      tree.insertSeries([50, 30, 70, 20, 40]);

      expect(tree.size()).toBe(5);
      expect(tree.search(30)).toBe(true);
      expect(tree.search(99)).toBe(false);
      expect(tree.inOrder()).toEqual([20, 30, 40, 50, 70]);
      expect(tree.preOrder()).toEqual([50, 30, 20, 40, 70]);
      expect(tree.postOrder()).toEqual([20, 40, 30, 70, 50]);
    });
  });

  describe('NaryTree (Reto 07)', () => {
    it('construye jerarquía y recorre mediante DFS', () => {
      const tree = new NaryTree<string>('Raíz');
      const root = tree.root!;
      const hijo1 = root.addChild('Hijo 1');
      root.addChild('Hijo 2');
      hijo1.addChild('Subhijo 1.1');

      expect(tree.size()).toBe(4);
      expect(tree.height()).toBe(3);

      const visitados: string[] = [];
      tree.dfs(node => visitados.push(node.value));
      expect(visitados).toEqual(['Raíz', 'Hijo 1', 'Subhijo 1.1', 'Hijo 2']);
    });
  });
});
