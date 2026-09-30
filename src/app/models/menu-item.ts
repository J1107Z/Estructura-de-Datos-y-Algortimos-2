import { Type } from '@angular/core';

// Representa un elemento de menú del árbol N-ario
export interface MenuItem {
  title: string;
  link: string;
  component: Type<any>;
  isActive?: boolean;
}
