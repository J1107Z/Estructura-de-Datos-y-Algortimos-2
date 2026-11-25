import { TrieNode } from './trie-node';

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode(null);
  }

  insert(word: string): void {
    const text = word.toLowerCase().trim();
    if (!text) return;

    let current = this.root;

    for (const character of text) {
      if (current.children[character] === undefined) {
        current.children[character] = new TrieNode(character);
      }
      current = current.children[character];
    }

    current.isEndOfWord = true;
  }

  search(word: string): boolean {
    const text = word.toLowerCase().trim();
    if (!text) return false;

    let current = this.root;

    for (const character of text) {
      if (current.children[character] === undefined) {
        return false;
      }
      current = current.children[character];
    }

    return current.isEndOfWord;
  }

  getSuggestions(prefix: string): string[] {
    const text = prefix.toLowerCase().trim();
    let current = this.root;

    for (const character of text) {
      if (current.children[character] === undefined) {
        return [];
      }
      current = current.children[character];
    }

    const results: string[] = [];
    this.collectWords(current, text, results);
    return results;
  }

  collectWords(node: TrieNode, currentWord: string, results: string[]): void {
    if (node.isEndOfWord) {
      results.push(currentWord);
    }

    for (const character in node.children) {
      this.collectWords(node.children[character], currentWord + character, results);
    }
  }

  getAllWords(): string[] {
    const results: string[] = [];
    this.collectWords(this.root, '', results);
    return results;
  }

  clear(): void {
    this.root = new TrieNode(null);
  }
}
