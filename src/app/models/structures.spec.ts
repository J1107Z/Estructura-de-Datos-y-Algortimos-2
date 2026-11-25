import { Trie } from './trie';
import { MaxHeap } from './max-heap';
import { Graph } from './graph';
import { Song } from './song';

describe('Estructuras del sistema musical', () => {
  it('debe insertar, buscar y sugerir por prefijo en el Trie', () => {
    const trie = new Trie();
    trie.insert('que lio');
    trie.insert('fumando');
    trie.insert('flash foto');
    trie.insert('mbappe');

    expect(trie.search('que lio')).toBe(true);
    expect(trie.search('que')).toBe(false);
    expect(trie.getSuggestions('f')).toEqual(['fumando', 'flash foto']);
    expect(trie.getSuggestions('mb')).toEqual(['mbappe']);
    expect(trie.getSuggestions('z')).toEqual([]);
  });

  it('debe ordenar canciones por popularidad usando MaxHeap', () => {
    const canciones: Song[] = [
      { title: 'bobadita', artist: 'Kris R', plays: 790 },
      { title: 'que lio', artist: 'Blessd', plays: 980 },
      { title: 'flash foto', artist: 'Arcángel', plays: 910 },
    ];

    const heap = new MaxHeap(canciones);
    expect(heap.peek()?.title).toBe('que lio');

    const top2 = heap.getTop(2);
    expect(top2.map((s) => s.title)).toEqual(['que lio', 'flash foto']);

    expect(heap.pop()?.plays).toBe(980);
    expect(heap.pop()?.plays).toBe(910);
    expect(heap.pop()?.plays).toBe(790);
  });

  it('debe conectar y recomendar canciones en el grafo no dirigido', () => {
    const graph = new Graph();
    graph.addNode({ title: 'que lio', artist: 'Blessd', plays: 980 });
    graph.addNode({ title: 'fumando', artist: 'Blessd', plays: 920 });
    graph.addNode({ title: 'tuki tuki', artist: 'Kris R', plays: 840 });

    expect(graph.addEdge('que lio', 'fumando')).toBe(true);
    expect(graph.addEdge('que lio', 'tuki tuki')).toBe(true);

    expect(graph.adjList['que lio']).toEqual(['fumando', 'tuki tuki']);
    expect(graph.adjList['fumando']).toEqual(['que lio']);

    const relacionadas = graph.getRelated('que lio');
    expect(relacionadas.map((s) => s.title)).toEqual(['fumando', 'tuki tuki']);
  });
});
