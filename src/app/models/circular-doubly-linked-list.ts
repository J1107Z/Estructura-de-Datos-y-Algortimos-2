import { DoublyNode } from './node';

// Lista circular doblemente enlazada
export class CircularDoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;
  length: number = 0;

  // Agrega al final conectando ambos sentidos de forma circular
  append(value: T): void {
    const newNode = new DoublyNode<T>(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
      newNode.prev = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head.prev = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  // Elimina un nodo y reconecta los punteros
  remove(predicate: (val: T) => boolean): DoublyNode<T> | null {
    if (!this.head || !this.tail) return null;

    // Caso de un solo nodo
    if (this.head === this.tail && predicate(this.head.value)) {
      const removed = this.head;
      this.head = null;
      this.tail = null;
      this.length = 0;
      return removed;
    }

    let curr = this.head;
    let found: DoublyNode<T> | null = null;

    do {
      if (predicate(curr.value)) {
        found = curr;
        break;
      }
      curr = curr.next!;
    } while (curr !== this.head && curr !== null);

    if (found) {
      if (found === this.head) {
        this.head = this.head.next;
      }
      if (found === this.tail) {
        this.tail = this.tail.prev;
      }

      if (found.prev) {
        found.prev.next = found.next;
      }
      if (found.next) {
        found.next.prev = found.prev;
      }

      this.length--;
      return found;
    }

    return null;
  }

  size(): number {
    return this.length;
  }

  // Pasa los elementos a arreglo para el HTML
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
      result += JSON.stringify(curr.value) + ' <-> ';
      curr = curr.next!;
    } while (curr !== this.head);
    console.log(result + '(círculo)');
  }
}
