export class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T): void {
    const newNode = new Node<T>(value);

    if (!this.head) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  peek(value: T, current: Node<T> | null = this.head): Node<T> | null {
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  size(): number {
    return this.length;
  }

  remove(value: T, current: Node<T> | null = this.head): void {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      this.length--;
      return;
    }

    let curr: Node<T> = this.head;
    while (curr.next && curr.next.value !== value) {
      curr = curr.next;
    }

    if (curr.next) {
      curr.next = curr.next.next;
      if (!curr.next) {
        this.tail = curr;
      }
      this.length--;
    }
  }

  print(): void {
    let current = this.head;
    let result = '';
    while (current) {
      result += JSON.stringify(current.value) + ' -> ';
      current = current.next;
    }
    console.log(result + 'null');
  }

  // Auxiliar para renderizar la lista en el template con @for
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
