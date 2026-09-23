import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from './stack';
import { Book } from './book';

describe('Stack Data Structure', () => {
  let stack: Stack<Book>;

  const libro1: Book = {
    name: 'El mundo de Sofía',
    isbn: '978-8466337830',
    author: 'Jostein Gaarder',
    editorial: 'Ediciones Siruela',
  };

  const libro2: Book = {
    name: 'Relato de un náufrago',
    isbn: '978-0307475428',
    author: 'Gabriel García Márquez',
    editorial: 'Tusquets Editores',
  };

  beforeEach(() => {
    stack = new Stack<Book>();
  });

  it('inicia vacía correctamente', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();
  });

  it('permite agregar elementos con push y consultar cima con peek', () => {
    stack.push(libro1);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual(libro1);

    stack.push(libro2);
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toEqual(libro2);
  });

  it('cumple con el principio LIFO al desapilar con pop', () => {
    stack.push(libro1);
    stack.push(libro2);

    const extraido1 = stack.pop();
    expect(extraido1).toEqual(libro2);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual(libro1);

    const extraido2 = stack.pop();
    expect(extraido2).toEqual(libro1);
    expect(stack.isEmpty()).toBe(true);
  });

  it('retorna elementos ordenados de cima a fondo con toArrayFromTop', () => {
    stack.push(libro1);
    stack.push(libro2);

    const ordenVisual = stack.toArrayFromTop();
    expect(ordenVisual[0]).toEqual(libro2); // Cima
    expect(ordenVisual[1]).toEqual(libro1); // Fondo
  });
});
