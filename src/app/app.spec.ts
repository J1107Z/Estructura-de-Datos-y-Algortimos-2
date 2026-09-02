import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('debe crear la aplicación correctamente', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe iniciar con el loader activo (isLoading = true)', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoading()).toBe(true);
  });

  it('debe permitir agregar un nuevo contacto al estado', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const nuevo = { name: 'Julian Zapata', phone: '3142395201' };
    app.agregarContacto(nuevo);
    expect(app.contacts).toContain(nuevo);
  });

  it('debe permitir eliminar un contacto del estado', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const contacto1 = { name: 'Contacto 1', phone: '111111' };
    const contacto2 = { name: 'Contacto 2', phone: '222222' };
    app.contacts = [contacto1, contacto2];

    app.eliminarContacto(contacto1);
    expect(app.contacts).not.toContain(contacto1);
    expect(app.contacts.length).toBe(1);
  });
});
