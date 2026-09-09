export class DoublyNode<T> {
  value: T;
  next: DoublyNode<T> | null;
  prev: DoublyNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null;
  tail: DoublyNode<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

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

  remove(value: T): DoublyNode<T> | null {
    if (!this.head) return null;

    let current: DoublyNode<T> | null = this.head;
    while (current) {
      if (current.value === value) {
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
        if (current.prev) {
          current.prev.next = current.next;
        }
        if (current.next) {
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

  // Método auxiliar para renderizar la lista en el template con @for
  toArray(): T[] {
    const elementos: T[] = [];
    let current = this.head;
    while (current) {
      elementos.push(current.value);
      current = current.next;
    }
    return elementos;
  }
}
