import { Node } from './node';

// Lista circular simple
export class CircularLinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  length: number = 0;

  // Agrega al final y enlaza el ultimo con el primero
  append(value: T): void {
    const newNode = new Node<T>(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
      this.tail.next = this.head;
    }

    this.length++;
  }

  // Elimina un nodo manteniendo el ciclo
  remove(predicate: (val: T) => boolean): Node<T> | null {
    if (!this.head || !this.tail) return null;

    // Si solo hay un elemento
    if (this.head === this.tail && predicate(this.head.value)) {
      const removed = this.head;
      this.head = null;
      this.tail = null;
      this.length = 0;
      return removed;
    }

    // Si es la cabeza
    if (predicate(this.head.value)) {
      const removed = this.head;
      this.head = this.head.next;
      this.tail.next = this.head;
      this.length--;
      return removed;
    }

    // Si esta en medio o al final
    let curr = this.head;
    while (curr.next && curr.next !== this.head && !predicate(curr.next.value)) {
      curr = curr.next;
    }

    if (curr.next && curr.next !== this.head && predicate(curr.next.value)) {
      const removed = curr.next;
      if (removed === this.tail) {
        this.tail = curr;
      }
      curr.next = removed.next;
      this.length--;
      return removed;
    }

    return null;
  }

  size(): number {
    return this.length;
  }

  // Pasa todos los elementos a un arreglo para mostrarlos
  toArray(): T[] {
    const elementos: T[] = [];
    if (!this.head) return elementos;

    let curr = this.head;
    do {
      elementos.push(curr.value);
      curr = curr.next!;
    } while (curr !== this.head && curr !== null);

    return elementos;
  }

  print(): void {
    if (!this.head) {
      console.log('Lista vacia');
      return;
    }
    let curr = this.head;
    let result = '';
    do {
      result += JSON.stringify(curr.value) + ' -> ';
      curr = curr.next!;
    } while (curr !== this.head);
    console.log(result + '(vuelve al inicio)');
  }
}
