import { describe, it, expect, beforeEach } from 'vitest';
import { NaryTree } from './nary-tree';
import { NaryTreeNode } from './nary-tree-node';
import { FileItem } from './file-item.model';

describe('NaryTree & NaryTreeNode - Sistema de Archivos', () => {
  let tree: NaryTree<FileItem>;
  const rootItem: FileItem = {
    id: 'root',
    nombre: 'Raíz',
    tipo: 'carpeta',
    creadoPor: 'sistema@test.com',
    fechaCreacion: '2026-10-14T00:00:00.000Z',
    parentId: null
  };

  beforeEach(() => {
    tree = new NaryTree<FileItem>(rootItem);
  });

  it('inicializa la raíz correctamente', () => {
    expect(tree.root).not.toBeNull();
    expect(tree.root?.value.nombre).toBe('Raíz');
    expect(tree.root?.value.tipo).toBe('carpeta');
    expect(tree.root?.isLeaf()).toBe(true);
    expect(tree.size()).toBe(1);
    expect(tree.height()).toBe(1);
  });

  it('permite agregar carpetas y archivos a una carpeta', () => {
    const root = tree.root!;

    const carpetaDocs: FileItem = {
      id: 'c1',
      nombre: 'Documentos',
      tipo: 'carpeta',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14T01:00:00.000Z',
      parentId: 'root'
    };
    const nodoDocs = root.addChild(carpetaDocs);

    const archivoFoto: FileItem = {
      id: 'a1',
      nombre: 'foto.png',
      tipo: 'archivo',
      extension: '.png',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14T01:05:00.000Z',
      parentId: 'root'
    };
    const nodoFoto = root.addChild(archivoFoto);

    expect(root.children.length).toBe(2);
    expect(root.isLeaf()).toBe(false);
    expect(nodoDocs.value.tipo).toBe('carpeta');
    expect(nodoFoto.value.tipo).toBe('archivo');
    expect(tree.size()).toBe(3);
    expect(tree.height()).toBe(2);
  });

  it('impide que un archivo tenga elementos hijos', () => {
    const root = tree.root!;
    const archivoTexto: FileItem = {
      id: 'a2',
      nombre: 'notas.txt',
      tipo: 'archivo',
      extension: '.txt',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14T02:00:00.000Z',
      parentId: 'root'
    };
    const nodoArchivo = root.addChild(archivoTexto);

    expect(nodoArchivo.puedeTenerHijos()).toBe(false);

    const intentoHijo: FileItem = {
      id: 'sub1',
      nombre: 'subcarpeta',
      tipo: 'carpeta',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14T02:01:00.000Z',
      parentId: 'a2'
    };

    expect(() => {
      nodoArchivo.addChild(intentoHijo);
    }).toThrow('Un archivo no puede contener elementos hijos.');
  });

  it('recorre el árbol con DFS y BFS', () => {
    const root = tree.root!;

    const c1 = root.addChild({
      id: 'c1',
      nombre: 'Carpeta A',
      tipo: 'carpeta',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14',
      parentId: 'root'
    });

    const c2 = root.addChild({
      id: 'c2',
      nombre: 'Carpeta B',
      tipo: 'carpeta',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14',
      parentId: 'root'
    });

    c1.addChild({
      id: 'a1',
      nombre: 'doc.pdf',
      tipo: 'archivo',
      extension: '.pdf',
      creadoPor: 'user@test.com',
      fechaCreacion: '2026-10-14',
      parentId: 'c1'
    });

    const dfsNombres: string[] = [];
    tree.dfs((n) => dfsNombres.push(n.value.nombre));
    expect(dfsNombres).toEqual(['Raíz', 'Carpeta A', 'doc.pdf', 'Carpeta B']);

    const bfsNombres: string[] = [];
    tree.bfs((n) => bfsNombres.push(n.value.nombre));
    expect(bfsNombres).toEqual(['Raíz', 'Carpeta A', 'Carpeta B', 'doc.pdf']);
  });

  it('reconstruye el árbol desde lista plana persistida', () => {
    const listaPlana: FileItem[] = [
      {
        id: 'c1',
        nombre: 'Proyectos',
        tipo: 'carpeta',
        creadoPor: 'admin@test.com',
        fechaCreacion: '2026-10-14',
        parentId: 'root'
      },
      {
        id: 'a1',
        nombre: 'info.txt',
        tipo: 'archivo',
        extension: '.txt',
        creadoPor: 'user@test.com',
        fechaCreacion: '2026-10-14',
        parentId: 'c1'
      }
    ];

    const nuevoArbol = new NaryTree<FileItem>();
    nuevoArbol.buildFromFlatList(
      listaPlana,
      (item) => item.parentId,
      (item) => item.id || '',
      rootItem
    );

    expect(nuevoArbol.size()).toBe(3);
    const nodoProyectos = nuevoArbol.find((n) => n.value.id === 'c1');
    expect(nodoProyectos).not.toBeNull();
    expect(nodoProyectos?.children.length).toBe(1);
    expect(nodoProyectos?.children[0].value.nombre).toBe('info.txt');
  });

  it('obtiene todos los descendientes para eliminación en cascada', () => {
    const root = tree.root!;
    const c1 = root.addChild({
      id: 'c1',
      nombre: 'Carpeta',
      tipo: 'carpeta',
      creadoPor: 'u@test.com',
      fechaCreacion: '2026-10-14',
      parentId: 'root'
    });
    c1.addChild({
      id: 'a1',
      nombre: 'archivo.txt',
      tipo: 'archivo',
      creadoPor: 'u@test.com',
      fechaCreacion: '2026-10-14',
      parentId: 'c1'
    });

    const descendientes = tree.getAllDescendantIds(c1);
    expect(descendientes).toEqual(['c1', 'a1']);
  });
});
