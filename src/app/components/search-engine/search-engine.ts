import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Trie } from '../../models/trie';
import { Product } from '../../models/product';

@Component({
  selector: 'app-search-engine',
  imports: [FormsModule],
  templateUrl: './search-engine.html',
  styleUrl: './search-engine.css',
})
export class SearchEngine implements OnInit {
  trie = new Trie();

  marcasRapidas: string[] = [
    'razer',
    'logitech',
    'corsair',
    'hyper x',
    'steelseries',
    'redragon',
  ];

  prefijoBusqueda = signal<string>('razer');
  cantidadTopK = signal<number>(3);

  resultadosTopK = signal<Product[]>([]);
  coincidenciasPrefijo = signal<Product[]>([]);
  todosLosProductos = signal<Product[]>([]);
  mensajeEstado = signal<string>('');

  nuevaMarca = 'razer';
  nuevoNombre = '';
  nuevaPopularidad: number | null = null;

  private readonly productosIniciales: Product[] = [
    { name: 'razer deathadder v3 pro raton', popularity: 98 },
    { name: 'razer blackwidow v4 pro teclado', popularity: 96 },
    { name: 'razer viper v2 pro raton', popularity: 94 },
    { name: 'razer huntsman v3 pro teclado', popularity: 93 },
    { name: 'razer kraken v3 pro headset', popularity: 91 },
    { name: 'razer blackshark v2 pro headset', popularity: 90 },
    { name: 'razer wolverine v2 chroma control', popularity: 89 },
    { name: 'razer basilisk v3 pro raton', popularity: 88 },
    { name: 'razer strider chroma mousepad', popularity: 86 },
    { name: 'razer gigantus v2 mousepad', popularity: 85 },

    { name: 'logitech g pro x superlight raton', popularity: 99 },
    { name: 'logitech g915 tkl teclado', popularity: 96 },
    { name: 'logitech g715 wireless teclado', popularity: 94 },
    { name: 'logitech g502 x plus raton', popularity: 93 },
    { name: 'logitech g pro x 2 headset', popularity: 92 },
    { name: 'logitech g733 lightspeed headset', popularity: 90 },
    { name: 'logitech g305 lightspeed raton', popularity: 89 },
    { name: 'logitech powerplay wireless mousepad', popularity: 87 },
    { name: 'logitech g840 xl mousepad', popularity: 86 },
    { name: 'logitech f710 wireless control', popularity: 82 },

    { name: 'corsair k100 rgb teclado', popularity: 97 },
    { name: 'corsair k70 rgb pro teclado', popularity: 95 },
    { name: 'corsair virtuoso rgb wireless headset', popularity: 93 },
    { name: 'corsair hs80 rgb wireless headset', popularity: 91 },
    { name: 'corsair k65 plus wireless teclado', popularity: 90 },
    { name: 'corsair m65 rgb ultra raton', popularity: 89 },
    { name: 'corsair dark core rgb pro raton', popularity: 88 },
    { name: 'corsair scimitar rgb elite raton', popularity: 86 },
    { name: 'corsair mm700 rgb extended mousepad', popularity: 85 },
    { name: 'corsair mm350 pro mousepad', popularity: 84 },

    { name: 'hyper x cloud iii wireless headset', popularity: 97 },
    { name: 'hyper x cloud alpha headset', popularity: 95 },
    { name: 'hyper x alloy origins 60 teclado', popularity: 93 },
    { name: 'hyper x alloy elite 2 teclado', popularity: 91 },
    { name: 'hyper x pulsefire haste 2 raton', popularity: 90 },
    { name: 'hyper x cloud stinger 2 headset', popularity: 89 },
    { name: 'hyper x pulsefire surge raton', popularity: 88 },
    { name: 'hyper x fury s pro mousepad', popularity: 87 },
    { name: 'hyper x clutch gladiator control', popularity: 85 },
    { name: 'hyper x pulsefire mat rgb mousepad', popularity: 83 },

    { name: 'steelseries apex pro tkl teclado', popularity: 98 },
    { name: 'steelseries arctis nova pro headset', popularity: 96 },
    { name: 'steelseries arctis nova 7 headset', popularity: 94 },
    { name: 'steelseries qck heavy mousepad', popularity: 93 },
    { name: 'steelseries apex 7 tkl teclado', popularity: 91 },
    { name: 'steelseries prime wireless raton', popularity: 90 },
    { name: 'steelseries aerox 5 wireless raton', popularity: 89 },
    { name: 'steelseries qck prism rgb mousepad', popularity: 87 },
    { name: 'steelseries rival 5 raton', popularity: 85 },
    { name: 'steelseries stratus duo control', popularity: 83 },

    { name: 'redragon kumara k552 teclado', popularity: 95 },
    { name: 'redragon draconic k530 pro teclado', popularity: 93 },
    { name: 'redragon zeus x rgb headset', popularity: 91 },
    { name: 'redragon horus k618 wireless teclado', popularity: 90 },
    { name: 'redragon cobra m711 raton', popularity: 89 },
    { name: 'redragon storm pro m808 raton', popularity: 88 },
    { name: 'redragon icon h520 headset', popularity: 87 },
    { name: 'redragon harrow g808 control', popularity: 86 },
    { name: 'redragon saturn g807 control', popularity: 85 },
    { name: 'redragon flick xl mousepad', popularity: 84 },
  ];

  ngOnInit(): void {
    this.cargarProductosIniciales();
  }

  cargarProductosIniciales(): void {
    this.trie.clear();

    for (let item of this.productosIniciales) {
      this.trie.insert(item.name, item.popularity);
    }

    this.todosLosProductos.set(this.trie.getAllProducts());
    this.prefijoBusqueda.set('razer');
    this.cantidadTopK.set(3);
    this.ejecutarBusquedaTopK();
  }

  actualizarPrefijo(valor: string): void {
    this.prefijoBusqueda.set(valor);
    this.ejecutarBusquedaTopK();
  }

  actualizarTopK(valor: number): void {
    const k = Number(valor);
    this.cantidadTopK.set(k);
    this.ejecutarBusquedaTopK();
  }

  seleccionarMarca(marca: string): void {
    this.prefijoBusqueda.set(marca);
    this.ejecutarBusquedaTopK();
  }

  ejecutarBusquedaTopK(): void {
    const prefijo = this.prefijoBusqueda().trim();
    const k = Number(this.cantidadTopK());

    if (isNaN(k) || k <= 0) {
      this.resultadosTopK.set([]);
      this.coincidenciasPrefijo.set([]);
      this.mensajeEstado.set('Ingrese un valor de K mayor a 0.');
      return;
    }

    const coincidencias = this.trie.searchByPrefix(prefijo);
    const topK = this.trie.searchTopK(prefijo, k);

    this.coincidenciasPrefijo.set(coincidencias);
    this.resultadosTopK.set(topK);
    this.mensajeEstado.set('');
  }

  insertarProducto(): void {
    const marca = this.nuevaMarca.trim().toLowerCase();
    const nombre = this.nuevoNombre.trim().toLowerCase();
    const popularidad = Number(this.nuevaPopularidad);

    if (!nombre) {
      this.mensajeEstado.set('Ingrese el nombre del producto.');
      return;
    }

    if (
      this.nuevaPopularidad === null ||
      isNaN(popularidad) ||
      popularidad < 0 ||
      popularidad > 100
    ) {
      this.mensajeEstado.set('Ingrese una popularidad válida entre 0 y 100.');
      return;
    }

    const nombreCompleto = nombre.startsWith(marca + ' ')
      ? nombre
      : `${marca} ${nombre}`;

    this.trie.insert(nombreCompleto, popularidad);

    this.nuevoNombre = '';
    this.nuevaPopularidad = null;

    this.todosLosProductos.set(this.trie.getAllProducts());
    this.ejecutarBusquedaTopK();
    this.mensajeEstado.set(
      `Producto "${nombreCompleto}" (popularidad: ${popularidad}) agregado al Trie.`
    );
  }
}
