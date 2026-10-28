import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private sb = inject(SupabaseService).client;
  url = signal('');

  async subir(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const { data: { user } } = await this.sb.auth.getUser();

    const ruta = `${user!.id}/${Date.now()}-${file.name}`;

    let { error } = await this.sb.storage.from('avatars')
      .upload(ruta, file, { upsert: true });

    if (error)
      ({ error } = await this.sb.storage.from('avatars').upload(ruta, file));

    if (error)
      return alert(error.message);

    this.url.set(this.sb.storage.from('avatars')
      .getPublicUrl(ruta).data.publicUrl);
  }
}
