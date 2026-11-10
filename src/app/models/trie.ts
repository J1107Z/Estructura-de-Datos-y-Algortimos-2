import { Node } from './trie-node';
import { Product } from './product';
import { MinHeap } from './min-heap';

export class Trie {
  root: Node;

  constructor() {
    this.root = new Node(null);
  }

  insert(word: string, popularity: number = 0): void {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return;

    let current = this.root;

    for (let character of cleanWord) {
      if (current.children[character] === undefined) {
        current.children[character] = new Node(character);
      }

      current = current.children[character];
    }
    current.isEndOfWord = true;
    current.popularity = popularity;
  }

  search(word: string): boolean {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return false;

    let current = this.root;
    for (let character of cleanWord) {
      if (current.children[character] === undefined) {
        return false;
      }
      current = current.children[character];
    }
    return current.isEndOfWord;
  }

  searchByPrefix(prefix: string): Product[] {
    const cleanPrefix = prefix.toLowerCase().trim();
    let current = this.root;

    for (let character of cleanPrefix) {
      if (current.children[character] === undefined) {
        return [];
      }
      current = current.children[character];
    }

    const results: Product[] = [];
    this.collectProducts(current, cleanPrefix, results);
    return results;
  }

  collectProducts(node: Node, currentWord: string, results: Product[]): void {
    if (node.isEndOfWord) {
      results.push({
        name: currentWord,
        popularity: node.popularity,
      });
    }

    for (let character in node.children) {
      this.collectProducts(
        node.children[character],
        currentWord + character,
        results
      );
    }
  }

  searchTopK(prefix: string, k: number): Product[] {
    if (k <= 0) return [];

    const matchedProducts = this.searchByPrefix(prefix);
    if (matchedProducts.length === 0) return [];

    const heap = new MinHeap();

    for (let product of matchedProducts) {
      heap.push(product);
      if (heap.size() > k) {
        heap.pop();
      }
    }

    const topK: Product[] = [];
    while (heap.size() > 0) {
      const minProduct = heap.pop();
      if (minProduct !== undefined) {
        topK.unshift(minProduct);
      }
    }

    return topK;
  }

  getAllProducts(): Product[] {
    const results: Product[] = [];
    this.collectProducts(this.root, '', results);
    return results;
  }

  clear(): void {
    this.root = new Node(null);
  }
}
