import { GraphNode } from './graph-node';

export class Graph {
  nodes: GraphNode[];
  adjList: { [key: string]: string[] };

  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  // Agrega un nuevo nodo al grafo 
  addNode(node: GraphNode): boolean {
    if (!this.searchNode(node.name)) {
      this.nodes.push(node);
      this.adjList[node.name] = [];
      return true;
    }
    return false;
  }

  // Conecta dos nodos mediante una arista no dirigida 
  addEdge(node1: string, node2: string): boolean {
    if (!this.adjList[node1] || !this.adjList[node2]) {
      return false;
    }

    if (!this.adjList[node1].includes(node2)) {
      this.adjList[node1].push(node2);
    }
    if (!this.adjList[node2].includes(node1)) {
      this.adjList[node2].push(node1);
    }
    return true;
  }

  // Busca y retorna un nodo del grafo por su nombre
  searchNode(nodeName: string): GraphNode | undefined {
    if (!this.nodes.length) return undefined;
    return this.nodes.find((n) => n.name === nodeName);
  }

  // Imprime y retorna la lista de adyacencia de un nodo específico
  printAdjacency(nodeName: string): string[] | undefined {
    if (this.searchNode(nodeName)) {
      console.log(`[Adyacencia de ${nodeName}]:`, this.adjList[nodeName]);
      return this.adjList[nodeName];
    }
    console.warn(`El nodo ${nodeName} no existe en el grafo.`);
    return undefined;
  }

  // Imprime todo el objeto de adyacencia del grafo
  printGraph(): void {
    console.log('[Grafo - Lista de Adyacencia]:', this.adjList);
  }

  // Alias print
  print(): void {
    this.printGraph();
  }

  // Verifica si el grafo está vacío
  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  // Elimina un nodo y sus aristas asociadas
  removeNode(nodeName: string): boolean {
    if (!this.searchNode(nodeName)) return false;

    // Eliminar aristas de nodos vecinos que apunten a este nodo
    const neighbors = [...(this.adjList[nodeName] || [])];
    for (const neighbor of neighbors) {
      this.removeEdge(nodeName, neighbor);
    }

    delete this.adjList[nodeName];
    this.nodes = this.nodes.filter((n) => n.name !== nodeName);
    return true;
  }

  // Elimina una arista entre dos nodos
  removeEdge(node1: string, node2: string): void {
    if (this.adjList[node1]) {
      this.adjList[node1] = this.adjList[node1].filter((n) => n !== node2);
    }
    if (this.adjList[node2]) {
      this.adjList[node2] = this.adjList[node2].filter((n) => n !== node1);
    }
  }

  // Retorna la lista de personas que viven en una ciudad en particular
  getPeopleInCity(cityName: string): GraphNode[] {
    const cityNode = this.searchNode(cityName);
    if (!cityNode || cityNode.type !== 'city') {
      return [];
    }

    const neighbors = this.adjList[cityName] || [];
    return neighbors
      .map((name) => this.searchNode(name)!)
      .filter((node) => node && node.type === 'person');
  }

  // Imprime por consola y retorna la lista de personas que viven en una ciudad en particular
  printPeopleInCity(cityName: string): GraphNode[] {
    const people = this.getPeopleInCity(cityName);
    console.log(`[Personas en Ciudad] Personas que viven en ${cityName}:`, people);
    return people;
  }

  // Vacía el grafo
  clear(): void {
    this.nodes = [];
    this.adjList = {};
  }
}
