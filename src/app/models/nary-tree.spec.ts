import { describe, it, expect, beforeEach } from 'vitest';
import { NaryTree } from './nary-tree';
import { NaryTreeNode } from './nary-tree-node';

describe('NaryTree & NaryTreeNode', () => {
  let tree: NaryTree<string>;

  beforeEach(() => {
    tree = new NaryTree<string>('Inicio');
  });

  it('crea nodo raíz e inicializa propiedades', () => {
    expect(tree.root).not.toBeNull();
    expect(tree.root?.value).toBe('Inicio');
    expect(tree.root?.isLeaf()).toBe(true);
    expect(tree.size()).toBe(1);
    expect(tree.height()).toBe(1);
  });

  it('agrega hijos correctamente usando addChild', () => {
    const root = tree.root!;
    const child1 = root.addChild('Menu 1');
    const child2 = root.addChild('Menu 2');

    expect(root.children.length).toBe(2);
    expect(root.isLeaf()).toBe(false);
    expect(child1.isLeaf()).toBe(true);
    expect(child2.isLeaf()).toBe(true);
    expect(tree.size()).toBe(3);
    expect(tree.height()).toBe(2);

    // Agregar submenús a child1
    child1.addChild('Submenu 1.1');
    child1.addChild('Submenu 1.2');

    expect(child1.isLeaf()).toBe(false);
    expect(tree.size()).toBe(5);
    expect(tree.height()).toBe(3);
  });

  it('recorre en profundidad con DFS', () => {
    const root = tree.root!;
    const c1 = root.addChild('A');
    const c2 = root.addChild('B');
    c1.addChild('A1');
    c1.addChild('A2');
    c2.addChild('B1');

    const visited: string[] = [];
    tree.dfs(node => visited.push(node.value));

    expect(visited).toEqual(['Inicio', 'A', 'A1', 'A2', 'B', 'B1']);
  });

  it('recorre en anchura con BFS por niveles', () => {
    const root = tree.root!;
    const c1 = root.addChild('A');
    const c2 = root.addChild('B');
    c1.addChild('A1');
    c1.addChild('A2');
    c2.addChild('B1');

    const visited: string[] = [];
    tree.bfs(node => visited.push(node.value));

    expect(visited).toEqual(['Inicio', 'A', 'B', 'A1', 'A2', 'B1']);
  });

  it('encuentra nodos con find', () => {
    const root = tree.root!;
    const c1 = root.addChild('Reportes');
    c1.addChild('Ventas');

    const found = tree.find(n => n.value === 'Ventas');
    expect(found).not.toBeNull();
    expect(found?.value).toBe('Ventas');

    const notFound = tree.find(n => n.value === 'Inexistente');
    expect(notFound).toBeNull();
  });
});
