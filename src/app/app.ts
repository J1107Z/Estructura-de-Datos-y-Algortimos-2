import { Component, OnDestroy, signal } from '@angular/core';
import { LinkedList } from './models/linked-list';
import { DoublyLinkedList } from './models/doubly-linked-list';
import { CircularLinkedList } from './models/circular-linked-list';
import { CircularDoublyLinkedList } from './models/circular-doubly-linked-list';
import { Node, DoublyNode } from './models/node';
import { Paciente, Atencion, Medico, MiembroComite } from './models/clinica.models';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  titulo = signal('Sistema Clinico');

  // 1. Pacientes en espera (Lista simple)
  listaEspera = new LinkedList<Paciente>();
  pacientesEspera = signal<Paciente[]>([]);
  totalEspera = signal<number>(0);
  contadorPacientes = 1;

  // 2. Historial de atención (Lista doble)
  listaHistorial = new DoublyLinkedList<Atencion>();
  historialAtencion = signal<Atencion[]>([]);
  totalHistorial = signal<number>(0);
  contadorAtencion = 1;

  // 3. Rotación de médicos (Lista circular)
  listaMedicos = new CircularLinkedList<Medico>();
  medicos = signal<Medico[]>([]);
  nodoMedicoActual: Node<Medico> | null = null;
  medicoActual = signal<Medico | null>(null);
  segundosRestantes = signal<number>(10);
  intervalo: any = null;

  // 4. Comité administrativo (Lista circular doble)
  listaComite = new CircularDoublyLinkedList<MiembroComite>();
  miembrosComite = signal<MiembroComite[]>([]);
  nodoComiteActual: DoublyNode<MiembroComite> | null = null;
  miembroComiteActual = signal<MiembroComite | null>(null);
  totalComite = signal<number>(0);

  constructor() {
    this.cargarDatos();
    this.iniciarRotacion();
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  // datos
  cargarDatos(): void {
    // 3. Médicos para la lista
    this.listaMedicos.append({ id: 1, nombre: 'Dr. Juan Jose Hineztroza', especialidad: 'Medicina General' });
    this.listaMedicos.append({ id: 2, nombre: 'Dra. Valeria Meneses', especialidad: 'Pediatría' });
    this.listaMedicos.append({ id: 3, nombre: 'Dr. Julian Zapata', especialidad: 'Urgencias' });
    this.listaMedicos.append({ id: 4, nombre: 'Dra. Manuela Zapata', especialidad: 'Cardiología' });

    this.nodoMedicoActual = this.listaMedicos.head;
    if (this.nodoMedicoActual) {
      this.medicoActual.set(this.nodoMedicoActual.value);
    }
    this.medicos.set(this.listaMedicos.toArray());

    // 1. Pacientes iniciales para la lista simple
    this.listaEspera.append({
      id: this.contadorPacientes++,
      nombre: 'Juan Gabriel',
      motivo: 'Fiebre alta',
    });
    this.listaEspera.append({
      id: this.contadorPacientes++,
      nombre: 'Yeick Jacson',
      motivo: 'Dolor estomacal',
    });
    this.listaEspera.append({
      id: this.contadorPacientes++,
      nombre: 'Janner Hoyos',
      motivo: 'Torcedura de tobillo',
    });
    this.actualizarPacientes();

    // 2. Historial inicial en lista doble
    this.listaHistorial.append({
      id: this.contadorAtencion++,
      paciente: 'Christopher Veca',
      motivo: 'Revisión general',
      medico: 'Dr. Juan Jose Hineztroza',
      especialidad: 'Medicina General',
    });
    this.actualizarHistorial();

    // 4. Miembros del comité en lista circular doble
    this.listaComite.append({ id: 1, nombre: 'Dra. Sofía Garces', cargo: 'Directora Médica' });
    this.listaComite.append({ id: 2, nombre: 'Lic. Fernando Rivera', cargo: 'Coordinador de Enfermería' });
    this.listaComite.append({ id: 3, nombre: 'Ing. Manuel Eduardo', cargo: 'Director Administrativo' });
    this.listaComite.append({ id: 4, nombre: 'Abg. Yeny Posada', cargo: 'Asesora Legal' });

    this.nodoComiteActual = this.listaComite.head;
    if (this.nodoComiteActual) {
      this.miembroComiteActual.set(this.nodoComiteActual.value);
    }
    this.actualizarComite();
  }

  // 1. Gestión de pacientes en espera (lista enlazada simple)

  agregarPaciente(nombreInput: HTMLInputElement, motivoInput: HTMLInputElement): void {
    const nombre = nombreInput.value.trim();
    const motivo = motivoInput.value.trim();

    if (!nombre || !motivo) {
      return;
    }

    this.listaEspera.append({
      id: this.contadorPacientes++,
      nombre,
      motivo,
    });

    this.actualizarPacientes();
    nombreInput.value = '';
    motivoInput.value = '';
  }

  // Al atender: se elimina de la lista simple y se agrega al historial
  atenderPaciente(): void {
    if (!this.listaEspera.head) {
      return;
    }

    const atendido = this.listaEspera.shift();
    if (!atendido) return;
    const medico = this.medicoActual();

    // Se agrega al historial (lista doble)
    this.listaHistorial.append({
      id: this.contadorAtencion++,
      paciente: atendido.nombre,
      motivo: atendido.motivo,
      medico: medico ? medico.nombre : 'Médico General',
      especialidad: medico ? medico.especialidad : 'Guardia',
    });

    this.actualizarPacientes();
    this.actualizarHistorial();
  }

  actualizarPacientes(): void {
    this.pacientesEspera.set(this.listaEspera.toArray());
    this.totalEspera.set(this.listaEspera.size());
  }


  // 2. Historial de atención (lista doblemente enlazada)


  actualizarHistorial(): void {
    this.historialAtencion.set(this.listaHistorial.toArray());
    this.totalHistorial.set(this.listaHistorial.size());
  }


  // 3. Rotación automática de médicos (lista circular)

  iniciarRotacion(): void {
    this.intervalo = setInterval(() => {
      const seg = this.segundosRestantes();
      if (seg > 1) {
        this.segundosRestantes.set(seg - 1);
      } else {
        this.rotarMedico();
        this.segundosRestantes.set(10);
      }
    }, 1000);
  }

  rotarMedico(): void {
    if (this.nodoMedicoActual && this.nodoMedicoActual.next) {
      this.nodoMedicoActual = this.nodoMedicoActual.next;
      this.medicoActual.set(this.nodoMedicoActual.value);
    }
  }


  // 4. Comité administrativo (lista circular doblemente enlazada)


  siguienteMiembro(): void {
    if (this.nodoComiteActual && this.nodoComiteActual.next) {
      this.nodoComiteActual = this.nodoComiteActual.next;
      this.miembroComiteActual.set(this.nodoComiteActual.value);
    }
  }

  anteriorMiembro(): void {
    if (this.nodoComiteActual && this.nodoComiteActual.prev) {
      this.nodoComiteActual = this.nodoComiteActual.prev;
      this.miembroComiteActual.set(this.nodoComiteActual.value);
    }
  }

  actualizarComite(): void {
    this.miembrosComite.set(this.listaComite.toArray());
    this.totalComite.set(this.listaComite.size());
  }
}
