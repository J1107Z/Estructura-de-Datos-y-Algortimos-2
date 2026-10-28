import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { TareasService } from '../../services/tareas.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-tareas',
  imports: [FormsModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit, OnDestroy {

  protected srv = inject(TareasService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  tareas = signal<any[]>([]);
  nueva = '';

  async ngOnInit() {
    await this.cargar();
    this.canal = this.srv.escuchar(() => this.cargar());
  }
  async cargar() {
    const { data } = await this.srv.listar();
    this.tareas.set(data ?? []);
  }
  async agregar() {
    const titulo = this.nueva.trim();
    if (!titulo) return;
    this.nueva = '';
    await this.srv.crear(titulo);
    await this.cargar();
  }
  async cambiarEstado(id: number, valor: boolean) {
    this.tareas.update((lista) =>
      lista.map((t) => (t.id === id ? { ...t, completada: valor } : t))
    );
    await this.srv.completar(id, valor);
  }
  async eliminar(id: number) {
    this.tareas.update((lista) => lista.filter((t) => t.id !== id));
    await this.srv.borrar(id);
  }

  ngOnDestroy() {
    if (this.canal) {
      this.sb.removeChannel(this.canal);
    }
  }
}
