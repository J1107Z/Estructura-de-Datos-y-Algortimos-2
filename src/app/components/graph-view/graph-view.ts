import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { Graph } from '../../models/graph';
import { GraphNode, PersonNode, CityNode } from '../../models/graph-node';

interface D3GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'person' | 'city';
  age?: number;
}

interface D3GraphLink extends d3.SimulationLinkDatum<D3GraphNode> {
  source: string | D3GraphNode;
  target: string | D3GraphNode;
  isCityLink?: boolean;
}

@Component({
  selector: 'app-graph-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './graph-view.html',
  styleUrl: './graph-view.css',
})
export class GraphView implements OnInit, AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;

  // Instancia de la estructura Grafo
  graph = new Graph();

  // Señales reactivas de Angular
  ciudades = signal<string[]>([]);
  personas = signal<GraphNode[]>([]);
  ciudadSeleccionada = signal<string>('');
  personasEnCiudad = signal<GraphNode[]>([]);
  mensajeOperacion = signal<string>('');
  nodoSeleccionado = signal<GraphNode | null>(null);

  // Campos para formularios interactivos
  nuevaCiudadNombre = '';
  nuevaPersonaNombre = '';
  nuevaPersonaEdad: number | null = null;
  nuevaPersonaCiudad = '';

  amigo1 = '';
  amigo2 = '';

  // Simulación D3
  private simulation: d3.Simulation<D3GraphNode, D3GraphLink> | null = null;

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngAfterViewInit(): void {
    this.renderizarGrafoD3();
  }

  // Carga los datos iniciales de amigos y ciudades en el grafo proporcionados por el usuario
  cargarDatosIniciales(): void {
    this.graph.clear();

    // Ciudades proporcionadas
    const ciudadesIniciales = ['Cali', 'Palmira', 'Jamundí', 'Boca Raton'];
    for (const ciudad of ciudadesIniciales) {
      this.graph.addNode(new CityNode(ciudad));
    }

    // Personas proporcionadas por el usuario (cada persona tiene name y age, y se conecta a una ciudad)
    const personasIniciales: { name: string; age: number; city: string }[] = [
      { name: 'Valeria Meneses', age: 19, city: 'Palmira' },
      { name: 'Julian Zapata', age: 19, city: 'Jamundí' },
      { name: 'Roger Alvarez', age: 19, city: 'Palmira' },
      { name: 'Nicolas Medina', age: 21, city: 'Boca Raton' },
      { name: 'Manuela Zapata', age: 12, city: 'Jamundí' },
      { name: 'Santiago Herrera', age: 22, city: 'Cali' },
      { name: 'Melissa', age: 22, city: 'Cali' },
      { name: 'Jhon Arias', age: 18, city: 'Cali' },
      { name: 'Sofía Dominguez', age: 20, city: 'Cali' },
      { name: 'Andrea Correa', age: 24, city: 'Palmira' },
      { name: 'Eynar Rivera', age: 27, city: 'Cali' },
      { name: 'Salomé García', age: 19, city: 'Cali' },
      { name: 'Santiago Perez', age: 19, city: 'Jamundí' },
      { name: 'Laura Muñoz', age: 20, city: 'Palmira' },
    ];

    for (const p of personasIniciales) {
      this.graph.addNode(new PersonNode(p.name, p.age));
      // Cada persona debe estar referenciada a una ciudad mediante una arista
      this.graph.addEdge(p.name, p.city);
    }

    // Relaciones de amistad entre amigos
    const amistadesIniciales: [string, string][] = [
      ['Julian Zapata', 'Valeria Meneses'],
      ['Julian Zapata', 'Roger Alvarez'],
      ['Julian Zapata', 'Manuela Zapata'],
      ['Julian Zapata', 'Santiago Perez'],
      ['Julian Zapata', 'Nicolas Medina'],
      ['Julian Zapata', 'Salomé García'],
      ['Valeria Meneses', 'Roger Alvarez'],
      ['Valeria Meneses', 'Andrea Correa'],
      ['Roger Alvarez', 'Laura Muñoz'],
      ['Andrea Correa', 'Laura Muñoz'],
      ['Santiago Herrera', 'Melissa'],
      ['Santiago Herrera', 'Jhon Arias'],
      ['Santiago Herrera', 'Eynar Rivera'],
      ['Melissa', 'Sofía Dominguez'],
      ['Sofía Dominguez', 'Salomé García'],
      ['Eynar Rivera', 'Jhon Arias'],
    ];

    for (const [amigo1, amigo2] of amistadesIniciales) {
      this.graph.addEdge(amigo1, amigo2);
    }

    this.actualizarListas();

    if (ciudadesIniciales.length > 0) {
      this.ciudadSeleccionada.set(ciudadesIniciales[0]);
      this.consultarPersonasEnCiudad(ciudadesIniciales[0]);
    }

    this.mensajeOperacion.set('Grafo de amigos y ciudades cargado correctamente.');
    console.log('[Grafo] Grafo de amigos y ciudades creado con éxito.');
    this.graph.print();

    this.renderizarGrafoD3();
  }

  // Configura amigos y ciudades personalizados
  actualizarConDatosPersonalizados(
    ciudades: string[],
    personas: { name: string; age: number; city: string }[],
    amistades?: [string, string][]
  ): void {
    this.graph.clear();

    for (const c of ciudades) {
      this.graph.addNode(new CityNode(c));
    }

    for (const p of personas) {
      this.graph.addNode(new PersonNode(p.name, p.age));
      this.graph.addEdge(p.name, p.city);
    }

    if (amistades) {
      for (const [a1, a2] of amistades) {
        this.graph.addEdge(a1, a2);
      }
    }

    this.actualizarListas();
    if (ciudades.length > 0) {
      this.ciudadSeleccionada.set(ciudades[0]);
      this.consultarPersonasEnCiudad(ciudades[0]);
    }

    this.mensajeOperacion.set('Datos personalizados aplicados al grafo.');
    this.graph.print();
    this.renderizarGrafoD3();
  }

  private actualizarListas(): void {
    const cityNodes = this.graph.nodes
      .filter((n) => n.type === 'city')
      .map((n) => n.name);
    const personNodes = this.graph.nodes.filter((n) => n.type === 'person');

    this.ciudades.set(cityNodes);
    this.personas.set(personNodes);
  }

  // Retorna e imprime la lista de personas que viven en una ciudad particular
  consultarPersonasEnCiudad(ciudad: string): void {
    if (!ciudad) return;
    this.ciudadSeleccionada.set(ciudad);

    // Se obtiene e imprime en la consola del navegador
    const lista = this.graph.printPeopleInCity(ciudad);
    this.personasEnCiudad.set(lista);

    this.mensajeOperacion.set(
      `Consulta para "${ciudad}": se encontraron ${lista.length} personas residentes.`
    );
  }

  // Imprime todo el grafo en consola
  imprimirGrafoConsola(): void {
    this.graph.printGraph();
    this.mensajeOperacion.set(
      'Grafo completo (lista de adyacencia) impreso en la consola.'
    );
  }

  // Imprime la adyacencia de un nodo en consola
  imprimirAdyacencia(nombre: string): void {
    if (!nombre) return;
    this.graph.printAdjacency(nombre);
    this.mensajeOperacion.set(`Adyacencia del nodo "${nombre}" impresa en la consola.`);
  }

  // Agrega una nueva ciudad
  agregarCiudad(): void {
    const nombre = this.nuevaCiudadNombre.trim();
    if (!nombre) {
      this.mensajeOperacion.set('Ingrese el nombre de la ciudad.');
      return;
    }

    const agregado = this.graph.addNode(new CityNode(nombre));
    if (agregado) {
      this.mensajeOperacion.set(`Ciudad "${nombre}" agregada con éxito.`);
      this.nuevaCiudadNombre = '';
      this.actualizarListas();
      this.renderizarGrafoD3();
    } else {
      this.mensajeOperacion.set(`La ciudad "${nombre}" ya existe en el grafo.`);
    }
  }

  // Agrega una nueva persona y la conecta a su ciudad
  agregarPersona(): void {
    const nombre = this.nuevaPersonaNombre.trim();
    const edad = Number(this.nuevaPersonaEdad);
    const ciudad = this.nuevaPersonaCiudad.trim();

    if (!nombre) {
      this.mensajeOperacion.set('Ingrese el nombre de la persona.');
      return;
    }
    if (isNaN(edad) || edad <= 0) {
      this.mensajeOperacion.set('Ingrese una edad válida.');
      return;
    }
    if (!ciudad) {
      this.mensajeOperacion.set('Seleccione una ciudad de residencia de la lista.');
      return;
    }

    // Si la ciudad no existe, se agrega automáticamente
    if (!this.graph.searchNode(ciudad)) {
      this.graph.addNode(new CityNode(ciudad));
    }

    const agregado = this.graph.addNode(new PersonNode(nombre, edad));
    if (agregado) {
      this.graph.addEdge(nombre, ciudad);
      this.mensajeOperacion.set(
        `Persona "${nombre}" (${edad} años) agregada y conectada a "${ciudad}".`
      );
      this.nuevaPersonaNombre = '';
      this.nuevaPersonaEdad = null;
      this.nuevaPersonaCiudad = '';
      this.actualizarListas();
      if (this.ciudadSeleccionada() === ciudad) {
        this.consultarPersonasEnCiudad(ciudad);
      }
      this.renderizarGrafoD3();
    } else {
      this.mensajeOperacion.set(`La persona "${nombre}" ya existe en el grafo.`);
    }
  }

  // Conecta dos amigos entre sí
  conectarAmigos(): void {
    const a1 = this.amigo1.trim();
    const a2 = this.amigo2.trim();

    if (!a1 || !a2) {
      this.mensajeOperacion.set('Seleccione dos personas para conectar como amigos.');
      return;
    }
    if (a1 === a2) {
      this.mensajeOperacion.set('Seleccione dos personas distintas.');
      return;
    }

    const exito = this.graph.addEdge(a1, a2);
    if (exito) {
      this.mensajeOperacion.set(`Amistad conectada entre "${a1}" y "${a2}".`);
      this.amigo1 = '';
      this.amigo2 = '';
      this.renderizarGrafoD3();
    } else {
      this.mensajeOperacion.set('No se pudo establecer la conexión de amistad.');
    }
  }

  // Renderiza el grafo en pantalla utilizando D3 (d3-graph)
  renderizarGrafoD3(): void {
    if (!this.graphContainer) return;

    const container = this.graphContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    if (this.graph.isEmpty()) {
      return;
    }

    const width = container.clientWidth || 750;
    const height = 560;

    // Preparar datos para D3
    const nodesData: D3GraphNode[] = this.graph.nodes.map((n) => ({
      id: n.name,
      name: n.name,
      type: n.type,
      age: n.age,
    }));

    const linksData: D3GraphLink[] = [];
    const addedEdges = new Set<string>();

    for (const sourceName of Object.keys(this.graph.adjList)) {
      const sourceNode = this.graph.searchNode(sourceName);
      const neighbors = this.graph.adjList[sourceName] || [];
      for (const targetName of neighbors) {
        const edgeKey = [sourceName, targetName].sort().join('---');
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          const targetNode = this.graph.searchNode(targetName);
          const isCityLink =
            (sourceNode?.type === 'city' && targetNode?.type === 'person') ||
            (sourceNode?.type === 'person' && targetNode?.type === 'city');

          linksData.push({
            source: sourceName,
            target: targetName,
            isCityLink,
          });
        }
      }
    }

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('display', 'block')
      .style('margin', '0 auto');

    const g = svg.append('g');

    // Zoom y Pan
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        })
    );

    // Simulación de fuerzas D3
    this.simulation = d3
      .forceSimulation<D3GraphNode>(nodesData)
      .force(
        'link',
        d3
          .forceLink<D3GraphNode, D3GraphLink>(linksData)
          .id((d) => d.id)
          .distance((d) => (d.isCityLink ? 115 : 75))
      )
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(38));

    // Dibujar enlaces (aristas)
    const link = g
      .selectAll<SVGLineElement, D3GraphLink>('line.link')
      .data(linksData)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', (d) => (d.isCityLink ? '#2563eb' : '#64748b'))
      .attr('stroke-width', (d) => (d.isCityLink ? 2 : 1.5))
      .attr('stroke-dasharray', (d) => (d.isCityLink ? '5 4' : 'none'))
      .attr('stroke-opacity', 0.85);

    // Grupo de nodos
    const node = g
      .selectAll<SVGGElement, D3GraphNode>('g.node')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, D3GraphNode>()
      .on('start', (event, d) => {
        if (!event.active && this.simulation) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active && this.simulation) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Círculo del nodo
    node
      .append('circle')
      .attr('r', (d) => (d.type === 'city' ? 24 : 19))
      .attr('fill', (d) => {
        if (d.type === 'city') {
          return d.name === this.ciudadSeleccionada() ? '#1e40af' : '#2563eb';
        }
        return '#059669';
      })
      .attr('stroke', '#000000')
      .attr('stroke-width', 2);

    // Icono o etiqueta de tipo
    node
      .append('text')
      .attr('dy', (d) => (d.type === 'city' ? -2 : -1))
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => (d.type === 'city' ? '12px' : '11px'))
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .attr('pointer-events', 'none')
      .text((d) => (d.type === 'city' ? '🏙' : '👤'));

    // Etiqueta de texto con el nombre y edad debajo del nodo
    node
      .append('text')
      .attr('dy', (d) => (d.type === 'city' ? 38 : 34))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', '"Times New Roman", Times, serif')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text((d) => (d.type === 'city' ? d.name : `${d.name} (${d.age})`));

    // Interacción al hacer click en el nodo
    node.on('click', (_event, d) => {
      const gNode = this.graph.searchNode(d.name);
      if (gNode) {
        this.nodoSeleccionado.set(gNode);
        if (gNode.type === 'city') {
          this.consultarPersonasEnCiudad(gNode.name);
        } else {
          this.mensajeOperacion.set(
            `Persona seleccionada: "${gNode.name}", edad: ${gNode.age}. Conexiones: ${
              this.graph.adjList[gNode.name]?.join(', ') || 'ninguna'
            }`
          );
        }
      }
    });

    // Actualización de posiciones en cada tick de la simulación
    this.simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as D3GraphNode).x || 0)
        .attr('y1', (d) => (d.source as D3GraphNode).y || 0)
        .attr('x2', (d) => (d.target as D3GraphNode).x || 0)
        .attr('y2', (d) => (d.target as D3GraphNode).y || 0);

      node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
    });
  }
}
