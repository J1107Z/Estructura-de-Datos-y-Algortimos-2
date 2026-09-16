import { Component, OnInit, signal } from '@angular/core';

// 1. Regular Function 
export function checkOddOrEvenRegular(num: number): string {
  const isEven = num % 2 === 0;
  const result = isEven ? 'even' : 'odd';
  const logMessage = `[Regular Function] The number ${num} is ${result}`;
  console.log(logMessage);
  return logMessage;
}

// 2. Arrow Function
export const checkOddOrEvenArrow = (num: number): string => {
  const isEven = num % 2 === 0;
  const result = isEven ? 'even' : 'odd';
  const logMessage = `[Arrow Function] The number ${num} is ${result}`;
  console.log(logMessage);
  return logMessage;
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Almacena las salidas para mostrarlas también en pantalla en texto plano
  protected readonly consoleLogs = signal<string[]>([]);
  protected readonly inputNumber = signal<number | null>(null);

  ngOnInit(): void {
    // Ejecución inicial automática de prueba (mostrado en consola)
    this.addLog('=== Inicializando 01-Challenge ===');
    this.addLog(checkOddOrEvenRegular(4));
    this.addLog(checkOddOrEvenRegular(7));
    this.addLog(checkOddOrEvenArrow(10));
    this.addLog(checkOddOrEvenArrow(15));
  }

  protected onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputNumber.set(value === '' ? null : Number(value));
  }

  protected testRegular(): void {
    const val = this.inputNumber();
    if (val === null || isNaN(val)) {
      alert('Por favor ingresa un número válido.');
      return;
    }
    const msg = checkOddOrEvenRegular(val);
    this.addLog(msg);
  }

  protected testArrow(): void {
    const val = this.inputNumber();
    if (val === null || isNaN(val)) {
      alert('Por favor ingresa un número válido.');
      return;
    }
    const msg = checkOddOrEvenArrow(val);
    this.addLog(msg);
  }

  protected testBoth(): void {
    const val = this.inputNumber();
    if (val === null || isNaN(val)) {
      alert('Por favor ingresa un número válido.');
      return;
    }
    this.addLog(checkOddOrEvenRegular(val));
    this.addLog(checkOddOrEvenArrow(val));
  }

  protected clearLogs(): void {
    this.consoleLogs.set([]);
  }

  private addLog(message: string): void {
    this.consoleLogs.update(logs => [...logs, message]);
  }
}
