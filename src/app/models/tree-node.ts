// Nodo para Árbol Binario

export class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }

  // Verifica si el nodo es hoja (sin hijos)
  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}
