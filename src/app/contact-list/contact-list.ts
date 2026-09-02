import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  imports: [],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  @Input() contacts: { name: string; phone: string }[] = [];
  @Output() delete = new EventEmitter<{ name: string; phone: string }>();

  eliminar(contact: { name: string; phone: string }) {
    this.delete.emit(contact);
  }
}
