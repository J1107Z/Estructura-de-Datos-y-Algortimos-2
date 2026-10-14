import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FileSystemService } from '../../services/file-system.service';
import { FileItem } from '../../models/file-item.model';
import { NaryTreeNode } from '../../models/nary-tree-node';
import { TreeNodeItemComponent } from '../tree-node-item/tree-node-item.component';

@Component({
  selector: 'app-file-explorer',
  imports: [CommonModule, FormsModule, TreeNodeItemComponent],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.scss'
})
export class FileExplorerComponent {
  readonly authService = inject(AuthService);
  readonly fileSystemService = inject(FileSystemService);

  // Formulario nueva carpeta
  nombreNuevaCarpeta = signal<string>('');
  creandoCarpeta = signal<boolean>(false);

  // Formulario nuevo archivo
  nombreNuevoArchivo = signal<string>('');
  extensionArchivo = signal<string>('.txt');
  creandoArchivo = signal<boolean>(false);

  // Extensiones comunes
  readonly extensionesDisponibles = ['.txt', '.pdf', '.docx', '.xlsx', '.png', '.ts', '.json'];

  // Nodo seleccionado
  readonly nodoActual = computed(() => this.fileSystemService.selectedNode());

  // Evalua si el nodo actual puede tener hijos
  readonly puedeCrearEnSeleccionado = computed(() => {
    const nodo = this.nodoActual();
    return nodo ? nodo.puedeTenerHijos() : false;
  });

  // Lista de hijos directos del nodo actual (si es carpeta)
  readonly hijosNodoActual = computed(() => {
    const nodo = this.nodoActual();
    return nodo ? nodo.children : [];
  });

  seleccionarNodo(nodo: NaryTreeNode<FileItem>): void {
    this.fileSystemService.seleccionarNodo(nodo);
  }

  async handleCrearCarpeta(): Promise<void> {
    const nombre = this.nombreNuevaCarpeta().trim();
    if (!nombre) return;

    this.creandoCarpeta.set(true);
    try {
      await this.fileSystemService.crearCarpeta(nombre);
      this.nombreNuevaCarpeta.set('');
    } catch {
      // Error manejado en servicio
    } finally {
      this.creandoCarpeta.set(false);
    }
  }

  async handleCrearArchivo(): Promise<void> {
    const nombre = this.nombreNuevoArchivo().trim();
    if (!nombre) return;

    this.creandoArchivo.set(true);
    try {
      await this.fileSystemService.crearArchivo(nombre, this.extensionArchivo());
      this.nombreNuevoArchivo.set('');
    } catch {
      // Error manejado en servicio
    } finally {
      this.creandoArchivo.set(false);
    }
  }

  async handleEliminar(nodo: NaryTreeNode<FileItem>): Promise<void> {
    if (confirm(`¿Deseas eliminar "${nodo.value.nombre}"?`)) {
      await this.fileSystemService.eliminarElemento(nodo);
    }
  }

  cerrarSesion(): void {
    this.authService.salir();
  }

  formatearFecha(iso: string): string {
    if (!iso || iso === 'Inicial') return 'Inicial';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  }
}
