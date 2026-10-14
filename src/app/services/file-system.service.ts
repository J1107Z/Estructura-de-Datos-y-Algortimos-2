import { Injectable, computed, inject, signal } from '@angular/core';
import { FileItem } from '../models/file-item.model';
import { NaryTree } from '../models/nary-tree';
import { NaryTreeNode } from '../models/nary-tree-node';
import { AuthService } from './auth.service';
import { RealtimeCollectionService } from './realtime-collection.service';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private authService = inject(AuthService);
  private realtimeService = inject(RealtimeCollectionService<FileItem>);

  readonly rootItem: FileItem = {
    id: 'root',
    nombre: 'Raíz',
    tipo: 'carpeta',
    creadoPor: 'sistema',
    fechaCreacion: '2026-10-14T00:00:00.000Z',
    parentId: null
  };

  readonly selectedId = signal<string>('root');
  readonly mensajeOperacion = signal<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Arbol N-ario reactivo reconstruido con computed
  readonly tree = computed(() => {
    const items = this.realtimeService.results();
    const nuevoArbol = new NaryTree<FileItem>();
    nuevoArbol.buildFromFlatList(
      items,
      (item) => item.parentId,
      (item) => item.id || '',
      this.rootItem
    );
    return nuevoArbol;
  });

  // Nodo actualmente seleccionado
  readonly selectedNode = computed(() => {
    const id = this.selectedId();
    const currentTree = this.tree();
    if (!id || id === 'root') {
      return currentTree.root;
    }
    return currentTree.find((n) => n.value.id === id) ?? currentTree.root;
  });

  // Metricas del arbol
  readonly totalElementos = computed(() => this.tree().size());
  readonly alturaArbol = computed(() => this.tree().height());

  // Traza textual de recorridos del arbol
  readonly dfsTrace = computed(() =>
    this.tree().getDfsTrace((item) =>
      `${item.tipo === 'carpeta' ? '📁' : '📄'} ${item.nombre} (${item.creadoPor})`
    )
  );

  readonly bfsTrace = computed(() =>
    this.tree().getBfsTrace((item) =>
      `${item.tipo === 'carpeta' ? '📁' : '📄'} ${item.nombre} (${item.creadoPor})`
    )
  );

  constructor() {
    this.realtimeService.init('sistema_archivos');
  }

  seleccionarNodo(nodo: NaryTreeNode<FileItem>): void {
    this.selectedId.set(nodo.value.id || 'root');
  }

  // Creacion de carpeta validando permisos y jerarquia
  async crearCarpeta(nombre: string, parentNode?: NaryTreeNode<FileItem> | null): Promise<void> {
    this.mensajeOperacion.set(null);

    // Validacion de autenticacion
    if (!this.authService.estaLogueado()) {
      const err = 'Debe estar autenticado para crear una carpeta.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      throw new Error(err);
    }

    const destino = parentNode ?? this.selectedNode() ?? this.tree().root;
    if (!destino) {
      throw new Error('No existe un nodo destino válido.');
    }

    // Validacion de regla de negocio: un archivo no puede tener hijos
    if (!destino.puedeTenerHijos()) {
      const err = 'Un archivo no puede contener elementos hijos. Seleccione una carpeta.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      throw new Error(err);
    }

    const nuevaCarpeta: Omit<FileItem, 'id'> = {
      nombre: nombre.trim(),
      tipo: 'carpeta',
      creadoPor: this.authService.usuario() || 'anonimo',
      fechaCreacion: new Date().toISOString(),
      parentId: destino.value.id || 'root'
    };

    try {
      await this.realtimeService.add(nuevaCarpeta);
    } catch (err: any) {
      this.mensajeOperacion.set({
        tipo: 'error',
        texto: err.message || 'Error al persistir la carpeta.'
      });
      throw err;
    }
  }

  // Creacion de archivo validando permisos y jerarquia
  async crearArchivo(
    nombre: string,
    extension: string,
    parentNode?: NaryTreeNode<FileItem> | null
  ): Promise<void> {
    this.mensajeOperacion.set(null);

    // Validacion de autenticacion
    if (!this.authService.estaLogueado()) {
      const err = 'Debe estar autenticado para crear un archivo.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      throw new Error(err);
    }

    const destino = parentNode ?? this.selectedNode() ?? this.tree().root;
    if (!destino) {
      throw new Error('No existe un nodo destino válido.');
    }

    // Validacion de regla de negocio: un archivo no puede tener hijos
    if (!destino.puedeTenerHijos()) {
      const err = 'Un archivo no puede contener elementos hijos. Seleccione una carpeta.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      throw new Error(err);
    }

    const nombreLimpio = nombre.trim();
    const ext = extension.startsWith('.') ? extension : `.${extension}`;

    const nuevoArchivo: Omit<FileItem, 'id'> = {
      nombre: `${nombreLimpio}${ext}`,
      tipo: 'archivo',
      extension: ext,
      creadoPor: this.authService.usuario() || 'anonimo',
      fechaCreacion: new Date().toISOString(),
      parentId: destino.value.id || 'root'
    };

    try {
      await this.realtimeService.add(nuevoArchivo);
    } catch (err: any) {
      this.mensajeOperacion.set({
        tipo: 'error',
        texto: err.message || 'Error al persistir el archivo.'
      });
      throw err;
    }
  }

  // Eliminacion de nodo y de todos sus descendientes en cascada
  async eliminarElemento(nodo: NaryTreeNode<FileItem>): Promise<void> {
    if (!nodo.value.id || nodo.value.id === 'root') {
      const err = 'No se puede eliminar la carpeta raíz del sistema.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      return;
    }

    if (!this.authService.estaLogueado()) {
      const err = 'Debe estar autenticado para eliminar elementos.';
      this.mensajeOperacion.set({ tipo: 'error', texto: err });
      return;
    }

    const idsParaEliminar = this.tree().getAllDescendantIds(nodo);

    try {
      for (const id of idsParaEliminar) {
        await this.realtimeService.deleteItem(id);
      }

      this.selectedId.set('root');
    } catch (err: any) {
      this.mensajeOperacion.set({
        tipo: 'error',
        texto: err.message || 'Error al eliminar el elemento.'
      });
    }
  }

  limpiarMensaje(): void {
    this.mensajeOperacion.set(null);
  }
}
