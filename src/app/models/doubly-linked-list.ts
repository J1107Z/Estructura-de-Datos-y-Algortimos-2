import { DoublyNode } from './node';

// Lista doblemente enlazada
export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;
  length: number = 0;

  // Agrega un nodo al final
  append(value: T): void {
    const newNode = new DoublyNode<T>(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.length = 1;
      return;
    }

    if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
      this.length++;
    }
  }

  // Elimina un nodo conectando el anterior con el siguiente
  remove(predicate: (val: T) => boolean): DoublyNode<T> | null {
    if (!this.head) return null;

    let current: DoublyNode<T> | null = this.head;
    while (current) {
      if (predicate(current.value)) {
        if (current === this.head) {
          this.head = current.next;
          if (this.head) {
            this.head.prev = null;
          }
        }
        if (current === this.tail) {
          this.tail = current.prev;
          if (this.tail) {
            this.tail.next = null;
          }
        }
        if (current.prev && current !== this.head) {
          current.prev.next = current.next;
        }
        if (current.next && current !== this.tail) {
          current.next.prev = current.prev;
        }

        this.length--;
        return current;
      }
      current = current.next;
    }
    return null;
  }

  size(): number {
    return this.length;
  }

  // Imprime la lista
  print(): void {
    let current = this.head;
    let result = 'null <-> ';
    while (current) {
      result += JSON.stringify(current.value) + ' <-> ';
      current = current.next;
    }
    console.log(result + 'null');
  }

  // Recorrido de inicio a fin
  toArray(): T[] {
    const elementos: T[] = [];
    let current = this.head;
    while (current) {
      elementos.push(current.value);
      current = current.next;
    }
    return elementos;
  }

  // Recorrido inverso (del final al inicio)
  toReverseArray(): T[] {
    const elementos: T[] = [];
    let current = this.tail;
    while (current) {
      elementos.push(current.value);
      current = current.prev;
    }
    return elementos;
  }
}
