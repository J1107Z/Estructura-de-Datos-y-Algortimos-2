import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App - Sistema Clínico', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('debe inicializar el componente y cargar datos iniciales', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.totalEspera()).toBe(3);
    expect(app.totalHistorial()).toBe(1);
    expect(app.medicoActual()).toBeTruthy();
    expect(app.totalComite()).toBe(4);
  });

  it('al atender un paciente se debe eliminar de lista simple y agregar al historial', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const inicialEspera = app.totalEspera();
    const inicialHistorial = app.totalHistorial();
    const primerPaciente = app.pacientesEspera()[0];

    app.atenderPaciente();

    expect(app.totalEspera()).toBe(inicialEspera - 1);
    expect(app.totalHistorial()).toBe(inicialHistorial + 1);
    expect(app.historialAtencion().some((h) => h.paciente === primerPaciente.nombre)).toBe(true);
  });

  it('debe rotar el médico de guardia en la lista circular', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const primerMedico = app.medicoActual();
    app.rotarMedico();
    const segundoMedico = app.medicoActual();

    expect(segundoMedico?.id).not.toBe(primerMedico?.id);
  });

  it('debe navegar en ambas direcciones en el comité administrativo (lista circular doble)', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const inicial = app.miembroComiteActual();
    app.siguienteMiembro();
    const siguiente = app.miembroComiteActual();
    expect(siguiente?.id).not.toBe(inicial?.id);

    app.anteriorMiembro();
    const regreso = app.miembroComiteActual();
    expect(regreso?.id).toBe(inicial?.id);
  });
});
