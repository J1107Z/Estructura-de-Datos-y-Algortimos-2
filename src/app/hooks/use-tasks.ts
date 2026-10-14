import { inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

export function useTasks() {
  const taskService = inject(TaskService);

  return {
    tasks: taskService.tasks,
    isPending: taskService.isPending,
    error: taskService.error,
    agregarTarea: (title: string, desc: string = '') => taskService.agregarTarea(title, desc),
    actualizarTarea: (id: string, data: Partial<Task>) => taskService.actualizarTarea(id, data),
    eliminarTarea: (id: string) => taskService.eliminarTarea(id),
    alternarCompletada: (id: string, completadaActual: boolean) =>
      taskService.alternarCompletada(id, completadaActual),
    recargar: () => taskService.recargar()
  };
}
