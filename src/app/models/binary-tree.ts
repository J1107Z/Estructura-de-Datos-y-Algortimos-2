import { TreeNode } from './tree-node';

//Arbol Binario de Búsqueda

export interface D3TreeNode {
  id: string;
  value?: number;
  isLeaf?: boolean;
  hidden?: boolean;
  children?: D3TreeNode[];
}

export class BinaryTree {
  root: TreeNode | null = null;

  // Inserta un nuevo valor en el árbol
  insert(value: number): boolean {
    const newNode = new TreeNode(value);

    if (this.root === null) {
      this.root = newNode;
      return true;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) {
        return false; // No se permiten valores duplicados
      }

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return true;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return true;
        }
        current = current.right;
      }
    }
  }

  // Inserta una serie de números en el árbol
  insertSeries(values: number[]): { inserted: number[]; duplicates: number[] } {
    const inserted: number[] = [];
    const duplicates: number[] = [];

    for (const val of values) {
      if (this.insert(val)) {
        inserted.push(val);
      } else {
        duplicates.push(val);
      }
    }

    return { inserted, duplicates };
  }

  // Comprueba si un valor se encuentra en el árbol
  search(value: number): boolean {
    let current = this.root;
    while (current !== null) {
      if (current.value === value) {
        return true;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return false;
  }

  // Retorna la ruta de nodos visitados durante la búsqueda
  searchPath(value: number): { found: boolean; path: number[] } {
    const path: number[] = [];
    let current = this.root;

    while (current !== null) {
      path.push(current.value);
      if (current.value === value) {
        return { found: true, path };
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, path };
  }

  // Recorrido In-Order: Left -> Node -> Right (L-N-R)
  inOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  // Recorrido Pre-Order: Node -> Left -> Right (N-L-R)
  preOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }

  // Recorrido Post-Order: Left -> Right -> Node (L-R-N)
  postOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Imprime el recorrido In-Order por consola
  printInOrder(): void {
    const values = this.inOrder();
    console.log('=== Recorrido In-Order (L-N-R) ===');
    console.log(values.length > 0 ? values.join(' -> ') : '(Árbol vacío)');
  }

  // Imprime el recorrido Pre-Order por consola
  printPreOrder(): void {
    const values = this.preOrder();
    console.log('=== Recorrido Pre-Order (N-L-R) ===');
    console.log(values.length > 0 ? values.join(' -> ') : '(Árbol vacío)');
  }

  // Imprime el recorrido Post-Order por consola
  printPostOrder(): void {
    const values = this.postOrder();
    console.log('=== Recorrido Post-Order (L-R-N) ===');
    console.log(values.length > 0 ? values.join(' -> ') : '(Árbol vacío)');
  }

  // Imprime los tres recorridos por consola
  printAll(): void {
    console.log('--------------------------------------------------');
    console.log('IMPRESIÓN DE RECORRIDOS DEL ÁRBOL EN CONSOLA:');
    this.printInOrder();
    this.printPreOrder();
    this.printPostOrder();
    console.log('--------------------------------------------------');
  }

  // Calcula la altura del árbol
  getHeight(node: TreeNode | null = this.root): number {
    if (node === null) {
      return 0;
    }
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // Retorna el total de nodos en el árbol
  size(node: TreeNode | null = this.root): number {
    if (node === null) {
      return 0;
    }
    return 1 + this.size(node.left) + this.size(node.right);
  }

  // Verifica si el árbol está vacío
  isEmpty(): boolean {
    return this.root === null;
  }

  // Limpia el árbol
  clear(): void {
    this.root = null;
  }

  // Convierte la estructura del árbol a formato compatible con d3.hierarchy
  toD3Hierarchy(): D3TreeNode | null {
    if (this.root === null) {
      return null;
    }

    const buildNode = (node: TreeNode | null, pathId: string): D3TreeNode | null => {
      if (!node) return null;

      const item: D3TreeNode = {
        id: `${pathId}_${node.value}`,
        value: node.value,
        isLeaf: node.isLeaf(),
        hidden: false,
      };

      if (node.left !== null || node.right !== null) {
        item.children = [
          node.left
            ? buildNode(node.left, `${pathId}_L`)!
            : { id: `${pathId}_L_dummy`, hidden: true },
          node.right
            ? buildNode(node.right, `${pathId}_R`)!
            : { id: `${pathId}_R_dummy`, hidden: true },
        ];
      }

      return item;
    };

    return buildNode(this.root, 'root');
  }
}
