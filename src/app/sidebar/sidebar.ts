import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTreeService } from '../services/menu-tree.service';
import { NaryTreeNode } from '../models/nary-tree-node';
import { MenuItem } from '../models/menu-item';
import { SidebarItem } from './sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SidebarItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  menuNodes = signal<NaryTreeNode<MenuItem>[]>([]);

  constructor(private menuService: MenuTreeService) {}

  ngOnInit(): void {
    const tree = this.menuService.getTree();
    if (tree.root) {
      this.menuNodes.set(tree.root.children);
      // Imprime el árbol por consola
      this.menuService.printDFS();
    }
  }

  onItemSelected(item: MenuItem): void {
    // Desactivar todos y activar el seleccionado
    const tree = this.menuService.getTree();
    tree.dfs(node => {
      node.value.isActive = node.value === item;
    });
  }
}
