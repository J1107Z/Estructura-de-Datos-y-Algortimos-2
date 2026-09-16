import { TestBed } from '@angular/core/testing';
import { App, checkOddOrEvenRegular, checkOddOrEvenArrow } from './app';

describe('01-Challenge: Regular vs Arrow Functions', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should correctly determine even and odd numbers using checkOddOrEvenRegular', () => {
    expect(checkOddOrEvenRegular(4)).toContain('even');
    expect(checkOddOrEvenRegular(7)).toContain('odd');
    expect(checkOddOrEvenRegular(0)).toContain('even');
    expect(checkOddOrEvenRegular(-2)).toContain('even');
    expect(checkOddOrEvenRegular(-3)).toContain('odd');
  });

  it('should correctly determine even and odd numbers using checkOddOrEvenArrow', () => {
    expect(checkOddOrEvenArrow(8)).toContain('even');
    expect(checkOddOrEvenArrow(9)).toContain('odd');
    expect(checkOddOrEvenArrow(0)).toContain('even');
    expect(checkOddOrEvenArrow(-4)).toContain('even');
    expect(checkOddOrEvenArrow(-5)).toContain('odd');
  });

  it('should render the main title in the DOM', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('01-Challenge: Regular Functions vs Arrow Functions');
  });
});
