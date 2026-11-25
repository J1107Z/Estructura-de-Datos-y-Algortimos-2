import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song';

interface NodoD3 extends d3.SimulationNodeDatum {
  id: string;
}

interface EnlaceD3 extends d3.SimulationLinkDatum<NodoD3> {
  source: string | NodoD3;
  target: string | NodoD3;
}

@Component({
  selector: 'app-recomendaciones',
  imports: [FormsModule],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.scss',
})
export class Recomendaciones implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('grafoContenedor') grafoContenedor!: ElementRef<HTMLDivElement>;

  musicService = inject(MusicService);

  cancionSeleccionada = signal<string>('');
  mensaje = signal<string>('');

  cancion1 = '';
  cancion2 = '';

  private simulation: d3.Simulation<NodoD3, EnlaceD3> | null = null;
  private vistaLista = false;

  constructor() {
    effect(() => {
      this.musicService.graphUpdates();
      if (this.vistaLista) {
        this.dibujarGrafo();
      }
    });
  }

  get relacionadas(): Song[] {
    const titulo = this.cancionSeleccionada();
    return titulo ? this.musicService.obtenerRelacionadas(titulo) : [];
  }

  ngOnInit(): void {
    const primera = this.musicService.graph.nodes[0]?.title || '';
    this.seleccionarCancion(primera);
  }

  ngAfterViewInit(): void {
    this.vistaLista = true;
    this.dibujarGrafo();
  }

  ngOnDestroy(): void {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  seleccionarCancion(titulo: string): void {
    if (!titulo) return;
    this.cancionSeleccionada.set(titulo);
    if (this.vistaLista) {
      this.dibujarGrafo();
    }
  }

  conectar(): void {
    if (!this.cancion1 || !this.cancion2 || this.cancion1 === this.cancion2) {
      this.mensaje.set('Selecciona dos canciones distintas para conectar.');
      return;
    }

    this.musicService.conectarCanciones(this.cancion1, this.cancion2);
    this.mensaje.set(`Se conectó "${this.cancion1}" con "${this.cancion2}".`);
    this.cancion1 = '';
    this.cancion2 = '';
  }

  desconectar(vecina: string): void {
    const actual = this.cancionSeleccionada();
    this.musicService.desconectarCanciones(actual, vecina);
    this.mensaje.set(`Se quitó la conexión entre "${actual}" y "${vecina}".`);
  }

  imprimirGrafo(): void {
    this.musicService.graph.printGraph();
    this.mensaje.set('Lista de adyacencia impresa en la consola (F12).');
  }

  dibujarGrafo(): void {
    if (!this.grafoContenedor) return;

    if (this.simulation) {
      this.simulation.stop();
    }

    const container = this.grafoContenedor.nativeElement;
    d3.select(container).selectAll('*').remove();

    const width = container.clientWidth || 720;
    const height = 420;
    const activa = this.cancionSeleccionada();
    const vecinos = this.musicService.graph.adjList[activa] || [];

    const nodes: NodoD3[] = this.musicService.graph.nodes.map((n) => ({ id: n.title }));
    const links: EnlaceD3[] = [];
    const vistos = new Set<string>();

    for (const origen of Object.keys(this.musicService.graph.adjList)) {
      for (const destino of this.musicService.graph.adjList[origen]) {
        const clave = [origen, destino].sort().join('--');
        if (!vistos.has(clave)) {
          vistos.add(clave);
          links.push({ source: origen, target: destino });
        }
      }
    }

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('cursor', 'grab');

    const grupo = svg.append('g');

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2.5])
        .on('zoom', (event) => {
          grupo.attr('transform', event.transform);
        })
    );

    this.simulation = d3
      .forceSimulation<NodoD3>(nodes)
      .force(
        'link',
        d3
          .forceLink<NodoD3, EnlaceD3>(links)
          .id((d) => d.id)
          .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-360))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(42));

    const link = grupo
      .selectAll<SVGLineElement, EnlaceD3>('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        const s = typeof d.source === 'string' ? d.source : d.source.id;
        const t = typeof d.target === 'string' ? d.target : d.target.id;
        return s === activa || t === activa ? '#1db954' : '#404040';
      })
      .attr('stroke-width', (d) => {
        const s = typeof d.source === 'string' ? d.source : d.source.id;
        const t = typeof d.target === 'string' ? d.target : d.target.id;
        return s === activa || t === activa ? 2.4 : 1.5;
      });

    const node = grupo
      .selectAll<SVGGElement, NodoD3>('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer');

    const drag = d3
      .drag<SVGGElement, NodoD3>()
      .on('start', (event, d) => {
        if (!event.active && this.simulation) {
          this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active && this.simulation) {
          this.simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    node
      .append('circle')
      .attr('r', (d) => (d.id === activa ? 16 : 13))
      .attr('fill', (d) => {
        if (d.id === activa) return '#1db954';
        if (vecinos.includes(d.id)) return '#38bdf8';
        return '#2a2a2a';
      })
      .attr('stroke', (d) => (d.id === activa ? '#ffffff' : '#737373'))
      .attr('stroke-width', 1.5);

    node
      .append('text')
      .attr('dy', 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', (d) => {
        if (d.id === activa) return '#1ed760';
        if (vecinos.includes(d.id)) return '#7dd3fc';
        return '#d4d4d8';
      })
      .text((d) => d.id);

    node.on('click', (_e, d) => {
      this.seleccionarCancion(d.id);
    });

    this.simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as NodoD3).x || 0)
        .attr('y1', (d) => (d.source as NodoD3).y || 0)
        .attr('x2', (d) => (d.target as NodoD3).x || 0)
        .attr('y2', (d) => (d.target as NodoD3).y || 0);

      node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
    });
  }
}
