import { TreeNode } from './tree-node';

// Estructura de datos: Árbol Binario de Búsqueda (BST)

export interface D3TreeNode {
  id: string;
  value?: number;
  isLeaf?: boolean;
  hidden?: boolean;
  children?: D3TreeNode[];
}

export class BinaryTree {
  root: TreeNode | null = null;

  // Inserta un valor según reglas de BST
  insert(value: number): boolean {
    const newNode = new TreeNode(value);

    if (this.root === null) {
      this.root = newNode;
      return true;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) {
        return false; // Sin duplicados
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

  // Inserta una serie de números
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

  // Comprueba si un valor está en el árbol
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

  // Retorna la ruta explorada al buscar un valor
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

  // Recorrido In-Order (L-N-R)
  inOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  // Recorrido Pre-Order (N-L-R)
  preOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }

  // Recorrido Post-Order (L-R-N)
  postOrder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Imprime todos los recorridos en consola
  printAll(): void {
    console.log('=== Recorridos del Árbol Binario ===');
    console.log('In-Order (L-N-R):', this.inOrder().join(' -> ') || '(Vacío)');
    console.log('Pre-Order (N-L-R):', this.preOrder().join(' -> ') || '(Vacío)');
    console.log('Post-Order (L-R-N):', this.postOrder().join(' -> ') || '(Vacío)');
  }

  // Retorna la altura del árbol
  getHeight(node: TreeNode | null = this.root): number {
    if (node === null) return 0;
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  // Retorna el total de nodos
  size(node: TreeNode | null = this.root): number {
    if (node === null) return 0;
    return 1 + this.size(node.left) + this.size(node.right);
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  clear(): void {
    this.root = null;
  }

  // Convierte el árbol a estructura compatible con d3.hierarchy
  toD3Hierarchy(): D3TreeNode | null {
    if (this.root === null) return null;

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
