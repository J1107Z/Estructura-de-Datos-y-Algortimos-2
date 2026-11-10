import { Trie } from './trie';
import { MinHeap } from './min-heap';

describe('Trie and MinHeap', () => {
  it('should insert and search words in Trie', () => {
    const trie = new Trie();
    trie.insert('razer deathadder v3', 98);
    trie.insert('razer blackwidow v4', 96);

    expect(trie.search('razer deathadder v3')).toBe(true);
    expect(trie.search('razer')).toBe(false);
    expect(trie.search('logitech')).toBe(false);
  });

  it('should return Top K most popular products by prefix using Heap', () => {
    const trie = new Trie();
    trie.insert('razer kraken v3 headset', 90);
    trie.insert('razer deathadder v3 raton', 95);
    trie.insert('razer gigantus v2 mousepad', 85);
    trie.insert('logitech g915 teclado', 80);

    const top2 = trie.searchTopK('razer', 2);
    expect(top2).toEqual([
      { name: 'razer deathadder v3 raton', popularity: 95 },
      { name: 'razer kraken v3 headset', popularity: 90 },
    ]);
  });

  it('should maintain MinHeap order on push, pop, peek, and heapify', () => {
    const heap = new MinHeap([
      { name: 'corsair k70 teclado', popularity: 94 },
      { name: 'corsair mm350 mousepad', popularity: 84 },
      { name: 'corsair hs80 headset', popularity: 91 },
    ]);

    expect(heap.size()).toBe(3);
    expect(heap.peek()?.popularity).toBe(84);
    expect(heap.pop()?.popularity).toBe(84);
    expect(heap.pop()?.popularity).toBe(91);
    expect(heap.pop()?.popularity).toBe(94);
  });
});
