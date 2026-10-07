import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaryTreeNode } from '../../../models/nary-tree-node';
import { MenuItem } from '../../../models/menu-item';

@Component({
  selector: 'app-sidebar-item',
  imports: [CommonModule, forwardRef(() => SidebarItemComponent)],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css',
})
export class SidebarItemComponent {
  @Input({ required: true }) node!: NaryTreeNode<MenuItem>;
  @Input() depth: number = 0;
  @Output() itemSelected = new EventEmitter<MenuItem>();

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
