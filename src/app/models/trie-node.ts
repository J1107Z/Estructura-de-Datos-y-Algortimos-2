export class Node {
  value: string | null;
  isEndOfWord: boolean;
  children: { [key: string]: Node };
  popularity: number;

  constructor(value: string | null) {
    this.value = value;
    this.isEndOfWord = false;
    this.children = {};
    this.popularity = 0;
  }
}
