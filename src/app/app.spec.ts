import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MusicService } from './services/music.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('debe crear la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe mostrar el título principal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Spotify Educativo');
  });

  it('debe sincronizar el aumento de +1 reproducción entre Buscador y Ranking', async () => {
    const fixture = TestBed.createComponent(App);
    const service = TestBed.inject(MusicService);
    await fixture.whenStable();

    const inicial = service.songs().find((s) => s.title === 'fumando')?.plays ?? 0;

    service.escucharCancion('fumando');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const textoBuscador = compiled.querySelector('app-buscador')?.textContent ?? '';
    const textoRanking = compiled.querySelector('app-ranking')?.textContent ?? '';

    expect(textoBuscador).toContain(`${inicial + 1} rep.`);
    expect(textoRanking).toContain(`${inicial + 1} rep.`);
  });
});
