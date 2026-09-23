import { Component, signal } from '@angular/core';
import { Book } from '../models/book';
import { Stack } from '../models/stack';

@Component({
  selector: 'app-book-stack',
  imports: [],
  templateUrl: './book-stack.html',
  styleUrl: './book-stack.css',
})
export class BookStack {
  // Estructura de datos Pila (Stack) de la Clase 06
  pila = new Stack<Book>();

  // Estados reactivos mediante Signals
  libros = signal<Book[]>([]);
  totalLibros = signal<number>(0);
  libroCima = signal<Book | null>(null);
  mensajeOperacion = signal<string>('');

  constructor() {
    this.cargarDatosIniciales();
  }

  // 2. Llenar la pila inicialmente con datos de prueba (Mock Data)
  private cargarDatosIniciales(): void {
    this.pila = new Stack<Book>();

    this.pila.push({
      name: 'El mundo de Sofía',
      isbn: '978-8466337830',
      author: 'Jostein Gaarder',
      editorial: 'Ediciones Siruela',
    });

    this.pila.push({
      name: 'Relato de un náufrago',
      isbn: '978-0307475428',
      author: 'Gabriel García Márquez',
      editorial: 'Tusquets Editores',
    });

    this.pila.push({
      name: 'Crónica de una muerte anunciada',
      isbn: '978-0307474728',
      author: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana',
    });

    this.pila.push({
      name: 'Cien años de soledad',
      isbn: '978-8437604947',
      author: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana',
    });

    this.actualizarEstado();
    this.mensajeOperacion.set('Pila inicializada con libros de prueba.');
  }

  // Sincroniza las señales con el estado actual de la Pila
  actualizarEstado(): void {
    this.libros.set(this.pila.toArrayFromTop());
    this.totalLibros.set(this.pila.size());
    const cima = this.pila.peek() ?? null;
    this.libroCima.set(cima);
  }

  // 1 & 3. Agregar un nuevo libro a la pila usando push
  agregarLibro(
    nameInput: HTMLInputElement,
    isbnInput: HTMLInputElement,
    authorInput: HTMLInputElement,
    editorialInput: HTMLInputElement
  ): void {
    const name = nameInput.value.trim();
    const isbn = isbnInput.value.trim();
    const author = authorInput.value.trim();
    const editorial = editorialInput.value.trim();

    if (!name || !isbn || !author || !editorial) {
      this.mensajeOperacion.set('Debe completar todos los campos del libro.');
      return;
    }

    const nuevoLibro: Book = { name, isbn, author, editorial };
    this.pila.push(nuevoLibro);

    nameInput.value = '';
    isbnInput.value = '';
    authorInput.value = '';
    editorialInput.value = '';

    this.actualizarEstado();
    this.mensajeOperacion.set(`Libro "${name}" agregado a la cima de la pila (push).`);
  }

  // Desapilar el último libro ingresado (pop)
  desapilarLibro(): void {
    if (this.pila.isEmpty()) {
      this.mensajeOperacion.set('No se puede desapilar: la pila está vacía.');
      return;
    }

    const libroEliminado = this.pila.pop();
    this.actualizarEstado();
    this.mensajeOperacion.set(`Libro "${libroEliminado?.name}" desapilado con éxito (pop).`);
  }

  // Consultar la cima de la pila sin removerla (peek)
  consultarCima(): void {
    if (this.pila.isEmpty()) {
      this.mensajeOperacion.set('La pila está vacía (peek retorna undefined).');
      return;
    }

    const cima = this.pila.peek();
    this.mensajeOperacion.set(`Cima actual (peek): "${cima?.name}" escrito por ${cima?.author}.`);
  }

  // Imprimir en consola la pila (print)
  imprimirEnConsola(): void {
    this.pila.print();
    this.mensajeOperacion.set('Contenido de la pila impreso en la consola del navegador (F12).');
  }

  // Vaciar completamente la pila
  vaciarPila(): void {
    while (!this.pila.isEmpty()) {
      this.pila.pop();
    }
    this.actualizarEstado();
    this.mensajeOperacion.set('La pila ha sido vaciada.');
  }
}
