// Principio FIFO (First In, First Out)


export class Queue<T> {
  private items: T[] = [];

  // enqueue: Agrega un nuevo elemento a la cola, colocándolo al final de la misma.
  enqueue(element: T): void {
    this.items.push(element);
  }

  // dequeue: Retorna el primer elemento de la cola, eliminándolo de la misma.
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // peek: Retorna el primer elemento de la cola, sin eliminarlo de la misma.
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0];
  }

  // size: Retorna el número de elementos en la cola.
  size(): number {
    return this.items.length;
  }

  // isEmpty: Retorna true si la cola está vacía.
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // print: Imprime el contenido de la cola.
  print(): void {
    console.log('=== Contenido de la Cola (Frente al Final - FIFO) ===');
    for (let i = 0; i < this.items.length; i++) {
      console.log(`[Posición ${i + 1}]`, this.items[i]);
    }
    if (this.isEmpty()) {
      console.log('(La cola está vacía)');
    }
  }

  // Retorna una copia de los elementos en orden de llegada (FIFO)
  toArray(): T[] {
    return [...this.items];
  }
}
