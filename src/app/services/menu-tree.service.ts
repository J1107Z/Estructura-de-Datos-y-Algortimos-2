import { Injectable } from '@angular/core';
import { NaryTree } from '../models/nary-tree';
import { MenuItem } from '../models/menu-item';
import {
  ProfileView,
  MessagesView,
  SettingsView,
  AccountView,
  SecurityView,
  PasswordView,
  NotificationView,
  HelpView,
  FaqView,
  TicketView,
  NetworkStatusView,
  LogoutView,
} from '../views/menu-views';

@Injectable({
  providedIn: 'root',
})
export class MenuTreeService {
  private tree: NaryTree<MenuItem>;

  constructor() {
    this.tree = this.construirArbolMenu();
  }

  // Construye el Árbol N-ario con menús y submenús en español
  private construirArbolMenu(): NaryTree<MenuItem> {
    const rootItem: MenuItem = {
      title: 'Raíz del Sistema',
      link: '/',
      component: ProfileView,
    };

    const tree = new NaryTree<MenuItem>(rootItem);
    const root = tree.root!;

    // 1. Resumen General
    root.addChild({
      title: 'Resumen General',
      link: '/resumen',
      component: ProfileView,
    });

    // 2. Mensajería Interna
    root.addChild({
      title: 'Mensajería Interna',
      link: '/mensajes',
      component: MessagesView,
    });

    // 3. Configuración de Cuenta (nodo con submenús)
    const configNode = root.addChild({
      title: 'Configuración de Cuenta',
      link: '/cuenta',
      component: SettingsView,
    });
    configNode.expanded = true;

    // Submenús de Configuración
    configNode.addChild({
      title: 'Datos Personales',
      link: '/cuenta/datos',
      component: AccountView,
    });

    configNode.addChild({
      title: 'Preferencias de Usuario',
      link: '/cuenta/preferencias',
      component: ProfileView,
    });

    configNode.addChild({
      title: 'Seguridad y Privacidad',
      link: '/cuenta/seguridad',
      component: SecurityView,
      isActive: true, // Elemento activo con resaltado azul
    });

    configNode.addChild({
      title: 'Credenciales de Acceso',
      link: '/cuenta/credenciales',
      component: PasswordView,
    });

    configNode.addChild({
      title: 'Centro de Notificaciones',
      link: '/cuenta/notificaciones',
      component: NotificationView,
    });

    // 4. Soporte y Asistencia (nodo con submenús)
    const soporteNode = root.addChild({
      title: 'Soporte y Asistencia',
      link: '/soporte',
      component: HelpView,
    });
    soporteNode.expanded = true;

    // Submenús de Soporte
    soporteNode.addChild({
      title: 'Preguntas Frecuentes',
      link: '/soporte/faq',
      component: FaqView,
    });

    soporteNode.addChild({
      title: 'Crear Solicitud de Ayuda',
      link: '/soporte/solicitud',
      component: TicketView,
    });

    soporteNode.addChild({
      title: 'Estado de los Servicios',
      link: '/soporte/estado',
      component: NetworkStatusView,
    });

    // 5. Cerrar Sesión
    root.addChild({
      title: 'Cerrar Sesión',
      link: '/salir',
      component: LogoutView,
    });

    return tree;
  }

  getTree(): NaryTree<MenuItem> {
    return this.tree;
  }

  printDFS(): void {
    this.tree.printDFS(item => item.title);
  }

  printBFS(): void {
    this.tree.printBFS(item => item.title);
  }
}
