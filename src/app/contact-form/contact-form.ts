import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  imports: [],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  @Output() add = new EventEmitter<{ name: string; phone: string }>();

  guardar(nameInput: HTMLInputElement, phoneInput: HTMLInputElement) {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (name && phone) {
      this.add.emit({ name, phone });
      nameInput.value = '';
      phoneInput.value = '';
    }
  }
}
