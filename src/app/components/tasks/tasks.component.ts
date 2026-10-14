import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { useAuth } from '../../hooks/use-auth';
import { useTasks } from '../../hooks/use-tasks';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  readonly authHook = useAuth();
  readonly tasksHook = useTasks();

  // Estados locales para nueva tarea
  nuevoTitulo = signal<string>('');
  nuevaDescripcion = signal<string>('');

  // Estado para edicion
  tareaEditandoId = signal<string | null>(null);
  tituloEditado = signal<string>('');
  descripcionEditada = signal<string>('');

  // Filtros
  filtroActual = signal<'todas' | 'pendientes' | 'completadas'>('todas');
  busqueda = signal<string>('');
  mensajeFeedback = signal<string>('');

  // Tareas filtradas computadas
  tareasFiltradas = computed(() => {
    let lista = this.tasksHook.tasks();
    const filtro = this.filtroActual();
    const query = this.busqueda().trim().toLowerCase();
    const correoUsuario = this.authHook.usuario()?.toLowerCase().trim();

    // Filtrar por el usuario actual (o tareas sin asignar previamente)
    if (correoUsuario) {
      lista = lista.filter(
        (t) => !t.userEmail || t.userEmail.toLowerCase().trim() === correoUsuario
      );
    }

    if (filtro === 'pendientes') {
      lista = lista.filter((t) => !t.completed);
    } else if (filtro === 'completadas') {
      lista = lista.filter((t) => t.completed);
    }

    if (query) {
      lista = lista.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Ordenar por fecha descendente
    return lista.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  });

  tareasDelUsuario = computed(() => {
    const correoUsuario = this.authHook.usuario()?.toLowerCase().trim();
    const lista = this.tasksHook.tasks();
    if (!correoUsuario) return lista;
    return lista.filter(
      (t) => !t.userEmail || t.userEmail.toLowerCase().trim() === correoUsuario
    );
  });

  totalTareas = computed(() => this.tareasDelUsuario().length);
  totalCompletadas = computed(
    () => this.tareasDelUsuario().filter((t) => t.completed).length
  );
  totalPendientes = computed(
    () => this.tareasDelUsuario().filter((t) => !t.completed).length
  );

  async agregarNuevaTarea(): Promise<void> {
    const titulo = this.nuevoTitulo().trim();
    const descripcion = this.nuevaDescripcion().trim();

    if (!titulo) {
      this.mostrarMensaje('Ingresa un título para la tarea.');
      return;
    }

    try {
      await this.tasksHook.agregarTarea(titulo, descripcion);
      this.nuevoTitulo.set('');
      this.nuevaDescripcion.set('');
      this.mostrarMensaje('Tarea creada exitosamente.');
    } catch {
      this.mostrarMensaje('Error al crear la tarea.');
    }
  }

  iniciarEdicion(tarea: Task): void {
    if (!tarea.id) return;
    this.tareaEditandoId.set(tarea.id);
    this.tituloEditado.set(tarea.title);
    this.descripcionEditada.set(tarea.description || '');
  }

  cancelarEdicion(): void {
    this.tareaEditandoId.set(null);
    this.tituloEditado.set('');
    this.descripcionEditada.set('');
  }

  async guardarEdicion(id: string): Promise<void> {
    const titulo = this.tituloEditado().trim();
    const descripcion = this.descripcionEditada().trim();

    if (!titulo) {
      this.mostrarMensaje('El título no puede estar vacío.');
      return;
    }

    try {
      await this.tasksHook.actualizarTarea(id, {
        title: titulo,
        description: descripcion
      });
      this.cancelarEdicion();
      this.mostrarMensaje('Tarea actualizada.');
    } catch {
      this.mostrarMensaje('Error al actualizar tarea.');
    }
  }

  async alternarEstado(tarea: Task): Promise<void> {
    if (!tarea.id) return;
    try {
      await this.tasksHook.alternarCompletada(tarea.id, tarea.completed);
    } catch {
      this.mostrarMensaje('Error al cambiar estado.');
    }
  }

  async borrarTarea(id?: string): Promise<void> {
    if (!id) return;
    try {
      await this.tasksHook.eliminarTarea(id);
      this.mostrarMensaje('Tarea eliminada.');
    } catch {
      this.mostrarMensaje('Error al eliminar tarea.');
    }
  }

  cerrarSesion(): void {
    this.authHook.salir();
  }

  private mostrarMensaje(msg: string): void {
    this.mensajeFeedback.set(msg);
    setTimeout(() => {
      this.mensajeFeedback.set('');
    }, 3000);
  }
}
