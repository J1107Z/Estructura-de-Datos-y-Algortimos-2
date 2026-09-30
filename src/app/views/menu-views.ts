import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-view',
  template: `<div>Perfil</div>`,
})
export class ProfileView {}

@Component({
  selector: 'app-messages-view',
  template: `<div>Mensajes</div>`,
})
export class MessagesView {}

@Component({
  selector: 'app-settings-view',
  template: `<div>Configuración</div>`,
})
export class SettingsView {}

@Component({
  selector: 'app-account-view',
  template: `<div>Cuenta</div>`,
})
export class AccountView {}

@Component({
  selector: 'app-security-view',
  template: `<div>Seguridad y Privacidad</div>`,
})
export class SecurityView {}

@Component({
  selector: 'app-password-view',
  template: `<div>Contraseña</div>`,
})
export class PasswordView {}

@Component({
  selector: 'app-notification-view',
  template: `<div>Notificaciones</div>`,
})
export class NotificationView {}

@Component({
  selector: 'app-help-view',
  template: `<div>Ayuda</div>`,
})
export class HelpView {}

@Component({
  selector: 'app-faq-view',
  template: `<div>Preguntas Frecuentes</div>`,
})
export class FaqView {}

@Component({
  selector: 'app-ticket-view',
  template: `<div>Enviar Ticket</div>`,
})
export class TicketView {}

@Component({
  selector: 'app-network-view',
  template: `<div>Estado de Red</div>`,
})
export class NetworkStatusView {}

@Component({
  selector: 'app-logout-view',
  template: `<div>Cerrar Sesión</div>`,
})
export class LogoutView {}
