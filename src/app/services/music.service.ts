import { Injectable, signal } from '@angular/core';
import { Song } from '../models/song';
import { Trie } from '../models/trie';
import { MaxHeap } from '../models/max-heap';
import { Graph } from '../models/graph';

@Injectable({ providedIn: 'root' })
export class MusicService {
  trie = new Trie();
  maxHeap = new MaxHeap();
  graph = new Graph();

  songs = signal<Song[]>([]);
  topSongs = signal<Song[]>([]);
  heapList = signal<Song[]>([]);
  graphUpdates = signal<number>(0);

  private readonly cancionesIniciales: Song[] = [
    { title: 'que lio', artist: 'Blessd', plays: 980 },
    { title: 'fumando', artist: 'Blessd', plays: 920 },
    { title: 'mbappe', artist: 'Eladio Carrión', plays: 950 },
    { title: 'kemba walker', artist: 'Eladio Carrión', plays: 860 },
    { title: 'pendig', artist: 'Myke Towers', plays: 940 },
    { title: '5 estrellas w sound 23', artist: 'Myke Towers', plays: 890 },
    { title: 'tuki tuki', artist: 'Kris R', plays: 840 },
    { title: 'bobadita', artist: 'Kris R', plays: 790 },
    { title: 'flash foto', artist: 'Arcángel', plays: 910 },
    { title: 'el granjero', artist: 'Arcángel', plays: 870 },
  ];

  private readonly conexionesIniciales: [string, string][] = [
    ['que lio', 'fumando'],
    ['que lio', 'tuki tuki'],
    ['fumando', 'bobadita'],
    ['tuki tuki', 'bobadita'],
    ['mbappe', 'kemba walker'],
    ['mbappe', 'flash foto'],
    ['kemba walker', 'el granjero'],
    ['flash foto', 'el granjero'],
    ['pendig', '5 estrellas w sound 23'],
    ['5 estrellas w sound 23', 'que lio'],
    ['pendig', 'mbappe'],
  ];

  constructor() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.trie.clear();
    this.maxHeap.clear();
    this.graph.clear();

    const lista = this.cancionesIniciales.map((c) => ({ ...c }));

    for (const song of lista) {
      this.trie.insert(song.title);
      this.maxHeap.push(song);
      this.graph.addNode(song);
    }

    for (const [c1, c2] of this.conexionesIniciales) {
      this.graph.addEdge(c1, c2);
    }

    this.songs.set(lista);
    this.actualizarRanking();
    this.graphUpdates.set(this.graphUpdates() + 1);
  }

  agregarCancion(title: string, artist: string, plays: number): boolean {
    const cleanTitle = title.toLowerCase().trim();
    const cleanArtist = artist.trim() || 'Artista desconocido';
    const validPlays = isNaN(plays) || plays < 0 ? 0 : plays;

    if (!cleanTitle || this.trie.search(cleanTitle)) {
      return false;
    }

    const nuevaCancion: Song = {
      title: cleanTitle,
      artist: cleanArtist,
      plays: validPlays,
    };

    this.trie.insert(nuevaCancion.title);
    this.maxHeap.push(nuevaCancion);
    this.graph.addNode(nuevaCancion);

    this.songs.set([...this.songs(), nuevaCancion]);
    this.actualizarRanking();
    this.graphUpdates.set(this.graphUpdates() + 1);
    return true;
  }

  buscarCancion(title: string): boolean {
    return this.trie.search(title);
  }

  sugerirPorPrefijo(prefix: string): Song[] {
    const titles = this.trie.getSuggestions(prefix);
    return titles
      .map((t) => this.songs().find((s) => s.title === t))
      .filter((s): s is Song => s !== undefined);
  }

  obtenerTop(k: number): Song[] {
    return this.topSongs().slice(0, k);
  }

  escucharCancion(title: string, incremento: number = 1): void {
    const clean = title.toLowerCase().trim();

    const actualizadas = this.songs().map((song) => {
      if (song.title === clean) {
        return { ...song, plays: song.plays + incremento };
      }
      return song;
    });

    this.songs.set(actualizadas);

    const nodoGrafo = this.graph.searchNode(clean);
    if (nodoGrafo) {
      nodoGrafo.plays += incremento;
    }

    this.reconstruirHeap();
  }

  extraerMasPopular(): Song | undefined {
    const extraida = this.maxHeap.pop();
    this.actualizarRanking();
    return extraida;
  }

  reconstruirHeap(): void {
    this.maxHeap = new MaxHeap(this.songs().map((s) => ({ ...s })));
    this.actualizarRanking();
  }

  conectarCanciones(song1: string, song2: string): boolean {
    const ok = this.graph.addEdge(song1, song2);
    if (ok) {
      this.graphUpdates.set(this.graphUpdates() + 1);
    }
    return ok;
  }

  desconectarCanciones(song1: string, song2: string): void {
    this.graph.removeEdge(song1, song2);
    this.graphUpdates.set(this.graphUpdates() + 1);
  }

  obtenerRelacionadas(title: string): Song[] {
    this.graphUpdates();
    const listaActual = this.songs();
    return this.graph
      .getRelated(title)
      .map((rel) => listaActual.find((s) => s.title === rel.title) ?? rel);
  }

  actualizarRanking(): void {
    this.heapList.set(this.maxHeap.toArray());
    this.topSongs.set(this.maxHeap.getTop(this.maxHeap.size()));
  }
}
