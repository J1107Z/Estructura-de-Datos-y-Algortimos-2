import { Injectable, signal } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { Gif, GiphyResponse } from '../models/gif.model';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiUrl = environment.giphyApiUrl;
  private apiKey = environment.giphyApiKey;

  gifs = signal<Gif[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  ultimoTermino = signal<string>('');
  metodoActual = signal<'fetch' | 'axios'>('fetch');

  async buscarConFetch(termino: string, limite: number = 25): Promise<void> {
    const query = termino.trim();
    if (!query) {
      this.gifs.set([]);
      this.ultimoTermino.set('');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.ultimoTermino.set(query);
    this.metodoActual.set('fetch');

    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        q: query,
        limit: limite.toString(),
        offset: '0',
        rating: 'g',
        lang: 'en'
      });

      const resp = await fetch(`${this.apiUrl}?${params}`);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const json: GiphyResponse = await resp.json();
      this.gifs.set(json.data);
    } catch (err: any) {
      this.error.set(err.message || 'Error al consultar la API de Giphy');
      this.gifs.set([]);
    } finally {
      this.cargando.set(false);
    }
  }

  async buscarConAxios(termino: string, limite: number = 25): Promise<void> {
    const query = termino.trim();
    if (!query) {
      this.gifs.set([]);
      this.ultimoTermino.set('');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.ultimoTermino.set(query);
    this.metodoActual.set('axios');

    try {
      const { data } = await axios.get<GiphyResponse>(this.apiUrl, {
        params: {
          api_key: this.apiKey,
          q: query,
          limit: limite,
          offset: 0,
          rating: 'g',
          lang: 'en'
        }
      });

      this.gifs.set(data.data);
    } catch (err: any) {
      this.error.set(err.message || 'Error al consultar la API de Giphy');
      this.gifs.set([]);
    } finally {
      this.cargando.set(false);
    }
  }

  async buscar(termino: string, metodo: 'fetch' | 'axios' = 'fetch'): Promise<void> {
    if (metodo === 'axios') {
      await this.buscarConAxios(termino);
    } else {
      await this.buscarConFetch(termino);
    }
  }
}
