import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from './queue';
import { Persona } from './persona';

describe('Queue Data Structure (Clase 06)', () => {
  let queue: Queue<Persona>;

  const persona1: Persona = {
    name: 'Juan Camilo Pérez',
    withdrawalAmount: 150000,
    arrivalDate: new Date('2026-09-23T10:00:00'),
  };

  const persona2: Persona = {
    name: 'María Fernanda Gómez',
    withdrawalAmount: 300000,
    arrivalDate: new Date('2026-09-23T10:05:00'),
  };

  beforeEach(() => {
    queue = new Queue<Persona>();
  });

  it('inicia vacía correctamente', () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
    expect(queue.peek()).toBeUndefined();
    expect(queue.dequeue()).toBeUndefined();
  });

  it('permite encolar con enqueue y consultar frente con peek', () => {
    queue.enqueue(persona1);
    expect(queue.isEmpty()).toBe(false);
    expect(queue.size()).toBe(1);
    expect(queue.peek()).toEqual(persona1);

    queue.enqueue(persona2);
    expect(queue.size()).toBe(2);
    // En una cola, el frente sigue siendo el primero que entró (FIFO)
    expect(queue.peek()).toEqual(persona1);
  });

  it('cumple con el principio FIFO al desencolar con dequeue', () => {
    queue.enqueue(persona1);
    queue.enqueue(persona2);

    const atendido1 = queue.dequeue();
    expect(atendido1).toEqual(persona1); // Primero en entrar, primero en salir
    expect(queue.size()).toBe(1);
    expect(queue.peek()).toEqual(persona2);

    const atendido2 = queue.dequeue();
    expect(atendido2).toEqual(persona2);
    expect(queue.isEmpty()).toBe(true);
  });

  it('retorna elementos en orden de llegada con toArray', () => {
    queue.enqueue(persona1);
    queue.enqueue(persona2);

    const elementos = queue.toArray();
    expect(elementos.length).toBe(2);
    expect(elementos[0]).toEqual(persona1);
    expect(elementos[1]).toEqual(persona2);
  });
});
