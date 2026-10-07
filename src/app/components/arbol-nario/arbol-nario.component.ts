import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuTreeService } from '../../services/menu-tree.service';
import { NaryTreeNode } from '../../models/nary-tree-node';
import { MenuItem } from '../../models/menu-item';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

@Component({
  selector: 'app-arbol-nario',
  imports: [CommonModule, SidebarItemComponent],
  templateUrl: './arbol-nario.component.html',
  styleUrl: './arbol-nario.component.css',
})
export class ArbolNarioComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);
  private menuService = inject(MenuTreeService);

  menuNodes = signal<NaryTreeNode<MenuItem>[]>([]);

  ngOnInit(): void {
    const tree = this.menuService.getTree();
    if (tree.root) {
      this.menuNodes.set(tree.root.children);
      this.menuService.printDFS();
    }
  }

  // Vuelve al menú de selección de ejercicios
  irAlInicio(): void {
    this.router.navigate(['/dashboard']);
  }

  // Cierra sesión
  cerrarSesion(): void {
    this.auth.salir();
  }

  onItemSelected(item: MenuItem): void {
    const tree = this.menuService.getTree();
    tree.dfs(node => {
      node.value.isActive = node.value === item;
    });
  }
}
