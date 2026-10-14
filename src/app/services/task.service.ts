import { Injectable, inject } from '@angular/core';
import { RealtimeCollectionService } from './realtime-collection.service';
import { Task } from '../models/task.model';
import { auth } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private collectionService = inject(RealtimeCollectionService<Task>).init('tasks');

  readonly tasks = this.collectionService.results;
  readonly isPending = this.collectionService.isPending;
  readonly error = this.collectionService.error;

  async agregarTarea(title: string, description: string = ''): Promise<string | null> {
    const usuarioActual = auth.currentUser;
    const nuevaTarea: Omit<Task, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: Date.now(),
      userId: usuarioActual?.uid,
      userEmail: usuarioActual?.email ?? undefined
    };
    return await this.collectionService.add(nuevaTarea);
  }

  async actualizarTarea(id: string, datos: Partial<Task>): Promise<void> {
    await this.collectionService.update(id, datos);
  }

  async eliminarTarea(id: string): Promise<void> {
    await this.collectionService.deleteItem(id);
  }

  async alternarCompletada(id: string, completadaActual: boolean): Promise<void> {
    await this.collectionService.update(id, { completed: !completadaActual });
  }

  async recargar(): Promise<Task[]> {
    return await this.collectionService.getAll();
  }
}
