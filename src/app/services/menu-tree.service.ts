import { Injectable } from '@angular/core';
import { NaryTree } from '../models/nary-tree';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root',
})
export class MenuTreeService {
  private tree: NaryTree<MenuItem>;

  constructor() {
    this.tree = this.construirArbolMenu();
  }

  // Construye el Árbol N-ario con la jerarquía del menú en español
  private construirArbolMenu(): NaryTree<MenuItem> {
    const rootItem: MenuItem = {
      title: 'Raíz del Sistema',
      link: '/',
    };

    const tree = new NaryTree<MenuItem>(rootItem);
    const root = tree.root!;

    // 1. Resumen General
    root.addChild({
      title: 'Resumen General',
      link: '/resumen',
    });

    // 2. Mensajería Interna
    root.addChild({
      title: 'Mensajería Interna',
      link: '/mensajes',
    });

    // 3. Configuración de Cuenta (nodo con submenús)
    const configNode = root.addChild({
      title: 'Configuración de Cuenta',
      link: '/cuenta',
    });
    configNode.expanded = true;

    configNode.addChild({
      title: 'Datos Personales',
      link: '/cuenta/datos',
    });

    configNode.addChild({
      title: 'Preferencias de Usuario',
      link: '/cuenta/preferencias',
    });

    configNode.addChild({
      title: 'Seguridad y Privacidad',
      link: '/cuenta/seguridad',
      isActive: true, // Elemento activo con resaltado azul
    });

    configNode.addChild({
      title: 'Credenciales de Acceso',
      link: '/cuenta/credenciales',
    });

    configNode.addChild({
      title: 'Centro de Notificaciones',
      link: '/cuenta/notificaciones',
    });

    // 4. Soporte y Asistencia (nodo con submenús)
    const soporteNode = root.addChild({
      title: 'Soporte y Asistencia',
      link: '/soporte',
    });
    soporteNode.expanded = true;

    soporteNode.addChild({
      title: 'Preguntas Frecuentes',
      link: '/soporte/faq',
    });

    soporteNode.addChild({
      title: 'Crear Solicitud de Ayuda',
      link: '/soporte/solicitud',
    });

    soporteNode.addChild({
      title: 'Estado de los Servicios',
      link: '/soporte/estado',
    });

    // 5. Cerrar Sesión
    root.addChild({
      title: 'Cerrar Sesión',
      link: '/salir',
    });

    return tree;
  }

  getTree(): NaryTree<MenuItem> {
    return this.tree;
  }

  printDFS(): void {
    this.tree.printDFS(item => item.title);
  }
}
