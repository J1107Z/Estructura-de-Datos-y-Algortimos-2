export class NaryTreeNode<T> {
  value: T;
  children: NaryTreeNode<T>[] = [];
  expanded: boolean = true;

  constructor(value: T) {
    this.value = value;
  }

  // Verifica si el nodo puede albergar nodos hijos
  puedeTenerHijos(): boolean {
    const item = this.value as any;
    if (item && item.tipo === 'archivo') {
      return false;
    }
    return true;
  }

  // Agrega un nuevo nodo hijo validando restricciones de tipo
  addChild(child: NaryTreeNode<T> | T): NaryTreeNode<T> {
    if (!this.puedeTenerHijos()) {
      throw new Error('Un archivo no puede contener elementos hijos.');
    }
    const node = child instanceof NaryTreeNode ? child : new NaryTreeNode(child);
    this.children.push(node);
    return node;
  }

  // Remueve un nodo hijo por su identificador
  removeChild(id: string): boolean {
    const index = this.children.findIndex(
      (c) => (c.value as any)?.id === id
    );
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  // Determina si el nodo es hoja (sin hijos)
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  // Alterna la visibilidad de los hijos
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}
