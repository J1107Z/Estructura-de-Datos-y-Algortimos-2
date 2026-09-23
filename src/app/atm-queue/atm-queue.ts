import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Persona } from '../models/persona';
import { Queue } from '../models/queue';

@Component({
  selector: 'app-atm-queue',
  imports: [CommonModule],
  templateUrl: './atm-queue.html',
  styleUrl: './atm-queue.css',
})
export class AtmQueue {
  // Estructura de datos Cola (Queue)
  cola = new Queue<Persona>();


  personas = signal<Persona[]>([]);
  totalPersonas = signal<number>(0);
  personaFrente = signal<Persona | null>(null);
  mensajeOperacion = signal<string>('');

  constructor() {
    this.cargarDatosIniciales();
  }

  // Genera una fecha/hora aleatoria asignada por el sistema dentro del día actual
  private generarFechaAleatoria(minutosAtrasMax: number = 60): Date {
    const ahora = new Date();
    // Minutos aleatorios hacia atrás entre
    const offsetMinutos = Math.floor(Math.random() * minutosAtrasMax) + 1;
    const segundosAleatorios = Math.floor(Math.random() * 60);
    return new Date(ahora.getTime() - (offsetMinutos * 60 * 1000 + segundosAleatorios * 1000));
  }

  // 2. Llenar la cola con datos de prueba
  private cargarDatosIniciales(): void {
    this.cola = new Queue<Persona>();

    // Fechas de llegada generadas aleatoriamente
    const mockData: Persona[] = [
      {
        name: 'Julian Andres Zapata ',
        withdrawalAmount: 1500000,
        arrivalDate: this.generarFechaAleatoria(50),
      },
      {
        name: 'María Fernanda Granobles',
        withdrawalAmount: 300000,
        arrivalDate: this.generarFechaAleatoria(35),
      },
      {
        name: 'Manuel Eduardo Zapata',
        withdrawalAmount: 800000,
        arrivalDate: this.generarFechaAleatoria(20),
      },
      {
        name: 'Ana Sofía Martínez',
        withdrawalAmount: 500000,
        arrivalDate: this.generarFechaAleatoria(5),
      },
    ];

    // Ordenar por fecha de llegada para garantizar orden cronológico de entrada
    mockData.sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());

    for (const persona of mockData) {
      this.cola.enqueue(persona);
    }

    this.actualizarEstado();
    this.mensajeOperacion.set('Cola del cajero automático inicializada con personas en espera.');
  }

  // Sincroniza las señales con el estado actual de la Cola
  actualizarEstado(): void {
    // 4. Se asegura que la cola se visualice ordenada por la fecha de llegada
    const lista = this.cola.toArray();
    lista.sort((a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime());
    this.personas.set(lista);
    this.totalPersonas.set(this.cola.size());
    const frente = this.cola.peek() ?? null;
    this.personaFrente.set(frente);
  }

  // 1 & 3. Formulario para crear una nueva persona y agregarla a la cola (enqueue)
  agregarPersona(nameInput: HTMLInputElement, amountInput: HTMLInputElement): void {
    const name = nameInput.value.trim();
    const amountVal = amountInput.value.trim();
    const withdrawalAmount = Number(amountVal);

    if (!name || !amountVal || isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      this.mensajeOperacion.set('Debe ingresar un nombre válido y un monto de retiro mayor a 0.');
      return;
    }

    // El sistema asigna automáticamente la fecha y hora de llegada
    const arrivalDate = new Date();

    const nuevaPersona: Persona = {
      name,
      withdrawalAmount,
      arrivalDate,
    };

    this.cola.enqueue(nuevaPersona);

    nameInput.value = '';
    amountInput.value = '';

    this.actualizarEstado();
    this.mensajeOperacion.set(`"${name}" ingresó a la cola del cajero para retirar $${withdrawalAmount.toLocaleString('es-CO')}.`);
  }

  // Atender a la primera persona en la cola
  atenderPersona(): void {
    if (this.cola.isEmpty()) {
      this.mensajeOperacion.set('No hay personas en la cola para atender.');
      return;
    }

    const personaAtendida = this.cola.dequeue();
    this.actualizarEstado();
    this.mensajeOperacion.set(
      `Cajero atendió a "${personaAtendida?.name}". Retiró con éxito $${personaAtendida?.withdrawalAmount.toLocaleString('es-CO')} (dequeue).`
    );
  }

  // Consultar la primera persona de la cola sin quitarla
  consultarFrente(): void {
    if (this.cola.isEmpty()) {
      this.mensajeOperacion.set('La cola está vacía.');
      return;
    }

    const frente = this.cola.peek();
    this.mensajeOperacion.set(
      `Siguiente en el cajero (peek): "${frente?.name}" con un retiro de $${frente?.withdrawalAmount.toLocaleString('es-CO')}.`
    );
  }

  // Imprimir en consola la cola (print)
  imprimirEnConsola(): void {
    this.cola.print();
    this.mensajeOperacion.set('Contenido de la cola impreso en la consola del navegador (F12).');
  }

  // Vaciar la cola
  vaciarCola(): void {
    while (!this.cola.isEmpty()) {
      this.cola.dequeue();
    }
    this.actualizarEstado();
    this.mensajeOperacion.set('La cola del cajero ha sido vaciada.');
  }

  // Formatea la fecha y hora para visualización limpia
  formatearFecha(fecha: Date): string {
    const d = new Date(fecha);
    return `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;
  }
}
