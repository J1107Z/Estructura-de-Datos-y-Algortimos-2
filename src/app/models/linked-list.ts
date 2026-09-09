import { Node } from './node';

// Lista enlazada simple
export class LinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  length: number = 0;

  // Agrega al final de la lista
  append(value: T): void {
    const newNode = new Node<T>(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  // Busca un elemento en la lista
  peek(value: T): Node<T> | null {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  // Retorna el tamano de la lista
  size(): number {
    return this.length;
  }

  // Elimina un nodo segun la condicion
  remove(predicate: (val: T) => boolean): Node<T> | null {
    if (!this.head) return null;

    // Si es la cabeza
    if (predicate(this.head.value)) {
      const removed = this.head;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      this.length--;
      return removed;
    }

    // Si esta en otra posicion
    let curr: Node<T> = this.head;
    while (curr.next && !predicate(curr.next.value)) {
      curr = curr.next;
    }

    if (curr.next) {
      const removed = curr.next;
      curr.next = curr.next.next;
      if (!curr.next) {
        this.tail = curr;
      }
      this.length--;
      return removed;
    }

    return null;
  }

  // Saca el primer elemento de la lista (para atender paciente)
  shift(): T | null {
    if (!this.head) return null;

    const valor = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.length--;
    return valor;
  }

  // Imprime los elementos en consola
  print(): void {
    let current = this.head;
    let result = '';
    while (current) {
      result += JSON.stringify(current.value) + ' -> ';
      current = current.next;
    }
    console.log(result + 'null');
  }

  // Convierte la lista en arreglo para mostrarla en el HTML
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
