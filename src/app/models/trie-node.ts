export class TrieNode {
  value: string | null;
  isEndOfWord: boolean;
  children: { [key: string]: TrieNode };

  constructor(value: string | null) {
    this.value = value;
    this.isEndOfWord = false;
    this.children = {};
  }
}
