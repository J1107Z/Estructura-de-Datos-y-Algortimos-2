import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file-item.model';
import { NaryTreeNode } from '../../models/nary-tree-node';

@Component({
  selector: 'app-tree-node-item',
  imports: [CommonModule],
  templateUrl: './tree-node-item.component.html',
  styleUrl: './tree-node-item.component.scss'
})
export class TreeNodeItemComponent {
  @Input({ required: true }) node!: NaryTreeNode<FileItem>;
  @Input() depth: number = 0;
  @Input() selectedId: string | null = null;

  @Output() nodeSelected = new EventEmitter<NaryTreeNode<FileItem>>();

  onItemClick(event: MouseEvent): void {
    event.stopPropagation();
    this.nodeSelected.emit(this.node);
  }

  toggleExpand(event: MouseEvent): void {
    event.stopPropagation();
    this.node.toggleExpand();
  }

  onChildSelected(selectedChild: NaryTreeNode<FileItem>): void {
    this.nodeSelected.emit(selectedChild);
  }
}
