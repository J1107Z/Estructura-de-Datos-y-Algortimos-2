import { Song } from './song';

export class Graph {
  nodes: Song[];
  adjList: { [key: string]: string[] };

  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  addNode(song: Song): boolean {
    if (!this.searchNode(song.title)) {
      this.nodes.push(song);
      this.adjList[song.title] = [];
      return true;
    }
    return false;
  }

  addEdge(node1: string, node2: string): boolean {
    if (node1 === node2) return false;
    if (!this.adjList[node1] || !this.adjList[node2]) return false;

    if (!this.adjList[node1].includes(node2)) {
      this.adjList[node1].push(node2);
    }
    if (!this.adjList[node2].includes(node1)) {
      this.adjList[node2].push(node1);
    }
    return true;
  }

  removeEdge(node1: string, node2: string): void {
    if (this.adjList[node1]) {
      this.adjList[node1] = this.adjList[node1].filter((n) => n !== node2);
    }
    if (this.adjList[node2]) {
      this.adjList[node2] = this.adjList[node2].filter((n) => n !== node1);
    }
  }

  searchNode(title: string): Song | undefined {
    if (!this.nodes.length) return undefined;
    return this.nodes.find((n) => n.title.toLowerCase() === title.toLowerCase());
  }

  getRelated(title: string): Song[] {
    const found = this.searchNode(title);
    if (!found) return [];

    const neighbors = this.adjList[found.title] || [];
    const related: Song[] = [];

    for (const name of neighbors) {
      const song = this.searchNode(name);
      if (song) {
        related.push(song);
      }
    }

    return related;
  }

  printAdjacency(title: string): string[] | undefined {
    if (this.searchNode(title)) {
      console.log(`Relacionadas con ${title}:`, this.adjList[title]);
      return this.adjList[title];
    }
    return undefined;
  }

  printGraph(): void {
    console.log('Grafo de canciones:', this.adjList);
  }

  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  removeNode(title: string): boolean {
    if (!this.searchNode(title)) return false;

    const neighbors = [...(this.adjList[title] || [])];
    for (const neighbor of neighbors) {
      this.removeEdge(title, neighbor);
    }

    delete this.adjList[title];
    this.nodes = this.nodes.filter((n) => n.title !== title);
    return true;
  }

  clear(): void {
    this.nodes = [];
    this.adjList = {};
  }
}
