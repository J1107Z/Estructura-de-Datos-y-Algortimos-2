import { Graph } from './graph';
import { PersonNode, CityNode } from './graph-node';

describe('Graph', () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  it('debe iniciar vacío', () => {
    expect(graph.isEmpty()).toBe(true);
    expect(graph.nodes.length).toBe(0);
  });

  it('debe agregar nodos de ciudad y persona correctamente', () => {
    const ciudad = new CityNode('Cali');
    const persona = new PersonNode('Andrés', 24);

    expect(graph.addNode(ciudad)).toBe(true);
    expect(graph.addNode(persona)).toBe(true);

    // No debe permitir nombres duplicados
    expect(graph.addNode(new CityNode('Cali'))).toBe(false);

    expect(graph.isEmpty()).toBe(false);
    expect(graph.nodes.length).toBe(2);
  });

  it('debe buscar un nodo por nombre', () => {
    graph.addNode(new CityNode('Bogotá'));
    const encontrado = graph.searchNode('Bogotá');

    expect(encontrado).toBeDefined();
    expect(encontrado?.name).toBe('Bogotá');
    expect(encontrado?.type).toBe('city');
  });

  it('debe conectar persona con ciudad y amigos entre sí con addEdge', () => {
    graph.addNode(new CityNode('Medellín'));
    graph.addNode(new PersonNode('Mateo', 25));
    graph.addNode(new PersonNode('Valentina', 23));

    // Conectar persona a ciudad
    expect(graph.addEdge('Mateo', 'Medellín')).toBe(true);
    expect(graph.addEdge('Valentina', 'Medellín')).toBe(true);

    // Conectar amigos entre sí
    expect(graph.addEdge('Mateo', 'Valentina')).toBe(true);

    expect(graph.adjList['Medellín']).toContain('Mateo');
    expect(graph.adjList['Medellín']).toContain('Valentina');
    expect(graph.adjList['Mateo']).toContain('Medellín');
    expect(graph.adjList['Mateo']).toContain('Valentina');
  });

  it('debe retornar e imprimir las personas que viven en una ciudad particular', () => {
    graph.addNode(new CityNode('Cali'));
    graph.addNode(new CityNode('Bogotá'));

    graph.addNode(new PersonNode('Santiago', 26));
    graph.addNode(new PersonNode('Mariana', 21));
    graph.addNode(new PersonNode('Carlos', 30));

    graph.addEdge('Santiago', 'Cali');
    graph.addEdge('Mariana', 'Cali');
    graph.addEdge('Carlos', 'Bogotá');

    const personasEnCali = graph.getPeopleInCity('Cali');
    expect(personasEnCali.length).toBe(2);
    expect(personasEnCali.map((p) => p.name)).toEqual(['Santiago', 'Mariana']);

    const personasEnBogota = graph.printPeopleInCity('Bogotá');
    expect(personasEnBogota.length).toBe(1);
    expect(personasEnBogota[0].name).toBe('Carlos');
  });

  it('debe eliminar un nodo y limpiar sus referencias en la lista de adyacencia', () => {
    graph.addNode(new CityNode('Cali'));
    graph.addNode(new PersonNode('Santiago', 26));
    graph.addEdge('Santiago', 'Cali');

    expect(graph.removeNode('Santiago')).toBe(true);
    expect(graph.searchNode('Santiago')).toBeUndefined();
    expect(graph.adjList['Cali']).not.toContain('Santiago');
  });
});
