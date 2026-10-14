import { NaryTreeNode } from './nary-tree-node';

export class NaryTree<T> {
  root: NaryTreeNode<T> | null = null;

  constructor(rootValue?: T) {
    if (rootValue !== undefined) {
      this.root = new NaryTreeNode<T>(rootValue);
    }
  }

  // Recorrido en profundidad (DFS)
  dfs(
    callback: (node: NaryTreeNode<T>, depth: number) => void,
    node: NaryTreeNode<T> | null = this.root,
    depth: number = 0
  ): void {
    if (node === null) return;
    callback(node, depth);
    for (const child of node.children) {
      this.dfs(callback, child, depth + 1);
    }
  }

  // Recorrido en anchura por niveles (BFS)
  bfs(callback: (node: NaryTreeNode<T>, level: number) => void): void {
    if (this.root === null) return;

    const queue: { node: NaryTreeNode<T>; level: number }[] = [
      { node: this.root, level: 0 },
    ];

    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      callback(node, level);
      for (const child of node.children) {
        queue.push({ node: child, level: level + 1 });
      }
    }
  }

  // Busca un nodo por predicado
  find(predicate: (node: NaryTreeNode<T>) => boolean): NaryTreeNode<T> | null {
    let result: NaryTreeNode<T> | null = null;
    this.dfs((node) => {
      if (!result && predicate(node)) {
        result = node;
      }
    });
    return result;
  }

  // Busca el nodo padre de un identificador dado
  findParentOf(childId: string): NaryTreeNode<T> | null {
    let parentFound: NaryTreeNode<T> | null = null;
    this.dfs((node) => {
      if (!parentFound) {
        const hasChild = node.children.some(
          (c) => (c.value as any)?.id === childId
        );
        if (hasChild) {
          parentFound = node;
        }
      }
    });
    return parentFound;
  }

  // Retorna el numero total de nodos
  size(node: NaryTreeNode<T> | null = this.root): number {
    if (node === null) return 0;
    let count = 1;
    for (const child of node.children) {
      count += this.size(child);
    }
    return count;
  }

  // Retorna la altura del arbol
  height(node: NaryTreeNode<T> | null = this.root): number {
    if (node === null) return 0;
    if (node.isLeaf()) return 1;

    let maxChildHeight = 0;
    for (const child of node.children) {
      const childH = this.height(child);
      if (childH > maxChildHeight) {
        maxChildHeight = childH;
      }
    }
    return maxChildHeight + 1;
  }

  // Genera el listado textual del recorrido DFS
  getDfsTrace(labelFn: (val: T) => string = (val) => String(val)): string[] {
    const trace: string[] = [];
    this.dfs((node, depth) => {
      const indentation = '   '.repeat(depth);
      const prefix = depth === 0 ? '[Raíz] ' : '├── ';
      trace.push(`${indentation}${prefix}${labelFn(node.value)}`);
    });
    return trace;
  }

  // Genera el listado textual del recorrido BFS
  getBfsTrace(labelFn: (val: T) => string = (val) => String(val)): string[] {
    const trace: string[] = [];
    let currentLevel = -1;
    this.bfs((node, level) => {
      if (level !== currentLevel) {
        currentLevel = level;
        trace.push(`Nivel ${level}:`);
      }
      trace.push(`  • ${labelFn(node.value)}`);
    });
    return trace;
  }

  // Imprime DFS en consola
  printDFS(labelFn: (val: T) => string = (val) => String(val)): void {
    console.log('=== Recorrido DFS del Árbol N-ario ===');
    for (const line of this.getDfsTrace(labelFn)) {
      console.log(line);
    }
  }

  // Imprime BFS en consola
  printBFS(labelFn: (val: T) => string = (val) => String(val)): void {
    console.log('=== Recorrido BFS del Árbol N-ario ===');
    for (const line of this.getBfsTrace(labelFn)) {
      console.log(line);
    }
  }

  // Obtiene los identificadores de un nodo y todos sus descendientes
  getAllDescendantIds(startNode: NaryTreeNode<T>): string[] {
    const ids: string[] = [];
    const collect = (node: NaryTreeNode<T>) => {
      const id = (node.value as any)?.id;
      if (id) ids.push(id);
      for (const child of node.children) {
        collect(child);
      }
    };
    collect(startNode);
    return ids;
  }

  // Reconstruye el arbol desde una coleccion plana con parentId
  buildFromFlatList(
    items: T[],
    getParentId: (item: T) => string | null,
    getId: (item: T) => string,
    rootValue: T
  ): void {
    this.root = new NaryTreeNode<T>(rootValue);

    const nodeMap = new Map<string, NaryTreeNode<T>>();
    const rootId = getId(rootValue);
    nodeMap.set(rootId, this.root);

    // Primera pasada: instanciar nodos
    for (const item of items) {
      const id = getId(item);
      if (id && id !== rootId) {
        nodeMap.set(id, new NaryTreeNode<T>(item));
      }
    }

    // Segunda pasada: enlazar hijos con sus padres
    for (const item of items) {
      const id = getId(item);
      if (id === rootId) continue;

      const parentId = getParentId(item);
      const childNode = nodeMap.get(id);
      if (!childNode) continue;

      const parentNode = (parentId && nodeMap.get(parentId)) || this.root;
      if (parentNode) {
        try {
          parentNode.addChild(childNode);
        } catch {
          // Si el padre no puede tener hijos, lo asocia a la raiz
          this.root.addChild(childNode);
        }
      }
    }
  }
}
