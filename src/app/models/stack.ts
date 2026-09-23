//Implementación de Pila

export class Stack<T> {
  private items: T[] = [];

  // push: Agrega un nuevo elemento a la pila, colocándolo en la cima.
  push(element: T): void {
    this.items.push(element);
  }

  // pop: Retorna el último elemento ingresado en la pila, retirándolo de ella.
  pop(): T | undefined {
    return this.items.pop();
  }

  // peek: Retorna el último elemento ingresado en la pila, sin retirarlo de ella.
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  // isEmpty: Retorna true si la pila está vacía.
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // size: Retorna el número de elementos en la pila.
  size(): number {
    return this.items.length;
  }

  // print: Imprime el contenido de la pila en consola.
  print(): void {
    console.log('=== Contenido de la Pila (Top a Fondo) ===');
    for (let i = this.items.length - 1; i >= 0; i--) {
      console.log(`[Posición ${i}]`, this.items[i]);
    }
    if (this.isEmpty()) {
      console.log('(La pila está vacía)');
    }
  }

  // Retorna los elementos ordenados desde la Cima (Top) hacia el Fondo para la pantalla
  toArrayFromTop(): T[] {
    return [...this.items].reverse();
  }

  // Retorna copia de los elementos en orden de inserción
  toArray(): T[] {
    return [...this.items];
  }
}
