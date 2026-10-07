// Nodo para Árbol N-ario

export class NaryTreeNode<T> {
  value: T;
  children: NaryTreeNode<T>[] = [];
  expanded: boolean = true;

  constructor(value: T) {
    this.value = value;
  }

  // Agrega un nuevo nodo hijo a este nodo
  addChild(child: NaryTreeNode<T> | T): NaryTreeNode<T> {
    const node = child instanceof NaryTreeNode ? child : new NaryTreeNode(child);
    this.children.push(node);
    return node;
  }

  // Verifica si el nodo es hoja (sin hijos)
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  // Alterna el estado de expansión del submenú
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}
