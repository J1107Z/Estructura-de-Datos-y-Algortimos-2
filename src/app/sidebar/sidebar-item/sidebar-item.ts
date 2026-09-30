import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaryTreeNode } from '../../models/nary-tree-node';
import { MenuItem } from '../../models/menu-item';

@Component({
  selector: 'app-sidebar-item',
  imports: [CommonModule, forwardRef(() => SidebarItem)],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
  @Input({ required: true }) node!: NaryTreeNode<MenuItem>;
  @Input() depth: number = 0;
  @Output() itemSelected = new EventEmitter<MenuItem>();

  // Maneja el clic en el elemento
  handleClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.node.isLeaf()) {
      this.node.toggleExpand();
    }
    this.itemSelected.emit(this.node.value);
  }

  onChildSelected(item: MenuItem): void {
    this.itemSelected.emit(item);
  }
}
