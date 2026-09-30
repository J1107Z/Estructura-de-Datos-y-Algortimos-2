import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { BinaryTree, D3TreeNode } from '../models/binary-tree';

@Component({
  selector: 'app-tree-view',
  imports: [CommonModule],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.css',
})
export class TreeView implements OnInit, AfterViewInit {
  @ViewChild('treeContainer') treeContainer!: ElementRef<HTMLDivElement>;

  // Instancia del Árbol Binario
  tree = new BinaryTree();

  // Señales de estado
  totalNodos = signal<number>(0);
  alturaArbol = signal<number>(0);
  recorridoInOrder = signal<number[]>([]);
  recorridoPreOrder = signal<number[]>([]);
  recorridoPostOrder = signal<number[]>([]);
  mensajeOperacion = signal<string>('');
  nodoBuscado = signal<number | null>(null);
  resultadoBusqueda = signal<{ found: boolean; value: number; path: number[] } | null>(null);

  // Serie inicial de números
  private readonly serieInicial: number[] = [50, 30, 70, 20, 40, 60, 80];

  ngOnInit(): void {
    this.cargarSerieInicial();
  }

  ngAfterViewInit(): void {
    this.renderizarArbolD3();
  }

  // Carga e inserta la serie inicial de números e imprime por consola
  cargarSerieInicial(): void {
    this.tree.clear();
    this.nodoBuscado.set(null);
    this.resultadoBusqueda.set(null);

    this.tree.insertSeries(this.serieInicial);
    this.actualizarEstado();
    this.mensajeOperacion.set(`Serie inicial cargada: [${this.serieInicial.join(', ')}]`);

    // Impresión requerida por consola
    this.tree.printAll();
    this.renderizarArbolD3();
  }

  // Sincroniza las señales con el árbol actual
  private actualizarEstado(): void {
    this.totalNodos.set(this.tree.size());
    this.alturaArbol.set(this.tree.getHeight());
    this.recorridoInOrder.set(this.tree.inOrder());
    this.recorridoPreOrder.set(this.tree.preOrder());
    this.recorridoPostOrder.set(this.tree.postOrder());
  }

  // Inserta uno o varios números
  insertarValores(inputElement: HTMLInputElement): void {
    const rawVal = inputElement.value.trim();
    if (!rawVal) {
      this.mensajeOperacion.set('Ingrese al menos un número.');
      return;
    }

    const items = rawVal
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const numeros = items.map(item => Number(item));

    if (numeros.length === 0 || numeros.some(n => isNaN(n))) {
      this.mensajeOperacion.set('Debe ingresar números válidos (si son varios, sepárelos por coma).');
      return;
    }

    if (numeros.length === 1) {
      const valor = numeros[0];
      const insertado = this.tree.insert(valor);
      if (insertado) {
        this.mensajeOperacion.set(`Número ${valor} insertado con éxito.`);
      } else {
        this.mensajeOperacion.set(`El valor ${valor} ya existe en el árbol (no se permiten duplicados).`);
      }
    } else {
      const resultado = this.tree.insertSeries(numeros);
      let msg = `Insertados: [${resultado.inserted.join(', ')}].`;
      if (resultado.duplicates.length > 0) {
        msg += ` Omitidos por duplicados: [${resultado.duplicates.join(', ')}].`;
      }
      this.mensajeOperacion.set(msg);
    }

    inputElement.value = '';
    this.actualizarEstado();
    this.tree.printAll();
    this.renderizarArbolD3();
  }

  // Función para comprobar si un valor se encuentra en el árbol
  buscarNumero(inputElement: HTMLInputElement): void {
    const rawVal = inputElement.value.trim();
    if (!rawVal) {
      this.mensajeOperacion.set('Ingrese un número a buscar.');
      return;
    }

    const valor = Number(rawVal);
    if (isNaN(valor)) {
      this.mensajeOperacion.set('Ingrese un número válido para buscar.');
      return;
    }

    const resultado = this.tree.searchPath(valor);
    this.nodoBuscado.set(resultado.found ? valor : null);
    this.resultadoBusqueda.set({
      found: resultado.found,
      value: valor,
      path: resultado.path,
    });

    if (resultado.found) {
      const rutaTexto = resultado.path.join(' -> ');
      this.mensajeOperacion.set(`El valor ${valor} SÍ se encuentra en el árbol. Ruta de búsqueda: ${rutaTexto}`);
      console.log(`[Búsqueda] Valor ${valor} encontrado. Ruta recorrida: ${rutaTexto}`);
    } else {
      const rutaTexto = resultado.path.length > 0 ? resultado.path.join(' -> ') : 'Ninguno';
      this.mensajeOperacion.set(`El valor ${valor} NO se encuentra en el árbol. Ruta explorada: ${rutaTexto}`);
      console.log(`[Búsqueda] Valor ${valor} no encontrado en el árbol. Ruta explorada: ${rutaTexto}`);
    }

    this.renderizarArbolD3();
  }

  // Imprime manualmente los tres recorridos en consola
  imprimirEnConsola(): void {
    this.tree.printAll();
    this.mensajeOperacion.set('Recorridos In-Order, Pre-Order y Post-Order impresos en la consola del navegador.');
  }

  // Limpia el árbol
  limpiarArbol(): void {
    this.tree.clear();
    this.nodoBuscado.set(null);
    this.resultadoBusqueda.set(null);
    this.actualizarEstado();
    this.mensajeOperacion.set('Árbol vaciado.');
    this.renderizarArbolD3();
  }

  // Renderiza el árbol binario utilizando D3
  renderizarArbolD3(): void {
    if (!this.treeContainer) {
      return;
    }

    const container = this.treeContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    if (this.tree.isEmpty()) {
      return;
    }

    const dataHierarchy = this.tree.toD3Hierarchy();
    if (!dataHierarchy) {
      return;
    }

    const root = d3.hierarchy<D3TreeNode>(dataHierarchy, d => d.children);

    const containerWidth = container.clientWidth || 650;
    const width = Math.max(550, containerWidth);
    const depth = root.height;
    const height = Math.max(280, (depth + 1) * 75);

    const margin = { top: 35, right: 35, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const treeLayout = d3.tree<D3TreeNode>().size([innerWidth, innerHeight]);
    const treeData = treeLayout(root);

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('display', 'block')
      .style('margin', '0 auto');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Filtrar nodos y enlaces ficticios
    const links = treeData.links().filter(l => !l.target.data.hidden);
    const nodes = treeData.descendants().filter(d => !d.data.hidden);

    // Dibujar líneas de conexión entre nodos
    g.selectAll('line.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#000000')
      .attr('stroke-width', 1.5);

    // Dibujar nodos
    const nodeGroup = g
      .selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    const nodoEncontrado = this.nodoBuscado();
    const rutaBusqueda = this.resultadoBusqueda()?.path || [];

    // Círculo del nodo
    nodeGroup
      .append('circle')
      .attr('r', 18)
      .attr('fill', d => {
        if (nodoEncontrado !== null && d.data.value === nodoEncontrado) {
          return '#d6d6d6';
        }
        if (rutaBusqueda.includes(d.data.value!)) {
          return '#eeeeee';
        }
        return '#ffffff';
      })
      .attr('stroke', '#000000')
      .attr('stroke-width', d => (nodoEncontrado !== null && d.data.value === nodoEncontrado ? 2.5 : 1.5));

    // Valor numérico del nodo
    nodeGroup
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-family', '"Times New Roman", Times, serif')
      .attr('font-weight', 'bold')
      .attr('fill', '#000000')
      .text(d => (d.data.value !== undefined ? d.data.value.toString() : ''));
  }
}
