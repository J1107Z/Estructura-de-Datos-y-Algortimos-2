import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryTree } from './binary-tree';
import { TreeNode } from './tree-node';

describe('BinaryTree & TreeNode', () => {
  let tree: BinaryTree;

  beforeEach(() => {
    tree = new BinaryTree();
  });

  it('inicia vacío correctamente', () => {
    expect(tree.isEmpty()).toBe(true);
    expect(tree.size()).toBe(0);
    expect(tree.root).toBeNull();
  });

  it('TreeNode verifica correctamente si es hoja', () => {
    const node = new TreeNode(50);
    expect(node.isLeaf()).toBe(true);

    node.left = new TreeNode(25);
    expect(node.isLeaf()).toBe(false);
  });

  it('inserta valores respetando la propiedad BST y rechaza duplicados', () => {
    expect(tree.insert(50)).toBe(true);
    expect(tree.insert(30)).toBe(true);
    expect(tree.insert(70)).toBe(true);

    // No debe permitir duplicados
    expect(tree.insert(30)).toBe(false);
    expect(tree.insert(50)).toBe(false);

    expect(tree.size()).toBe(3);
    expect(tree.root?.value).toBe(50);
    expect(tree.root?.left?.value).toBe(30);
    expect(tree.root?.right?.value).toBe(70);
  });

  it('inserta una serie de números', () => {
    const serie = [50, 30, 70, 20, 40, 60, 80];
    const { inserted, duplicates } = tree.insertSeries(serie);

    expect(inserted).toEqual([50, 30, 70, 20, 40, 60, 80]);
    expect(duplicates).toEqual([]);
    expect(tree.size()).toBe(7);
  });

  it('verifica si un valor se encuentra en el árbol con search', () => {
    tree.insertSeries([50, 30, 70, 20, 40, 60, 80]);

    expect(tree.search(50)).toBe(true);
    expect(tree.search(20)).toBe(true);
    expect(tree.search(80)).toBe(true);
    expect(tree.search(40)).toBe(true);

    // Valores no existentes
    expect(tree.search(100)).toBe(false);
    expect(tree.search(10)).toBe(false);
    expect(tree.search(35)).toBe(false);
  });

  it('genera correctamente los recorridos in-order, pre-order y post-order', () => {
    // Estructura:
    //         50
    //       /    \
    //     30      70
    //    /  \    /  \
    //   20  40  60  80
    tree.insertSeries([50, 30, 70, 20, 40, 60, 80]);

    // In-Order (L-N-R): debe estar ordenado ascendentemente
    expect(tree.inOrder()).toEqual([20, 30, 40, 50, 60, 70, 80]);

    // Pre-Order (N-L-R): 50 -> 30 -> 20 -> 40 -> 70 -> 60 -> 80
    expect(tree.preOrder()).toEqual([50, 30, 20, 40, 70, 60, 80]);

    // Post-Order (L-R-N): 20 -> 40 -> 30 -> 60 -> 80 -> 70 -> 50
    expect(tree.postOrder()).toEqual([20, 40, 30, 60, 80, 70, 50]);
  });

  it('convierte la estructura a formato compatible con d3.hierarchy', () => {
    tree.insertSeries([50, 30, 70]);
    const hierarchy = tree.toD3Hierarchy();

    expect(hierarchy).not.toBeNull();
    expect(hierarchy?.value).toBe(50);
    expect(hierarchy?.children?.length).toBe(2);
    expect(hierarchy?.children?.[0].value).toBe(30);
    expect(hierarchy?.children?.[1].value).toBe(70);
  });
});
