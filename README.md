# 02-Angular - Gestor de Contactos (Challenge 02)

Aplicación web desarrollada como solución al **Challenge 02** de la asignatura **Estructuras de Datos II**, siguiendo rigurosa y exclusivamente los conceptos, directivas, patrones y buenas prácticas explicados en las diapositivas de clase del profesor **Jonathan López Londoño**.

---

## 👤 Información del Autor
- **Autor:** Julian Andres Zapata Posada
- **Código estudiantil:** 2240291
- **Asignatura:** Estructuras de Datos II
- **Docente:** Jonathan López Londoño

---

## 📋 Requisitos del Challenge 02 Cumplidos

- [x] **Mostrar un loader al inicio** (`Display a loader on startup`): Se implementó el componente `<app-loader>` y se controla mediante la señal reactiva `isLoading`.
- [x] **Cargar una lista inicial de contactos** (`Load an initial contact list`): Carga simulada de forma asíncrona mediante `async/await`, `Promise` y `setTimeout`.
- [x] **Permitir agregar contactos con nombre y teléfono** (`Allow users to add contacts with name and phone`): Formulario interactivo en `<app-contact-form>` que valida entradas y emite eventos hacia el componente principal.
- [x] **Permitir eliminar contactos** (`Allow users to delete contacts`): Botón de eliminación en cada elemento de `<app-contact-list>` con emisión de eventos.
- [x] **Dividir la aplicación en componentes** (`Divide the app into components`): Arquitectura modular compuesta por `Loader`, `ContactList`, `ContactForm` y `App`.
- [x] **Todo el contenido e interfaz en español**.

---

## 🏗️ Arquitectura y Jerarquía de Componentes

```
src/app/
├── loader/
│   ├── loader.ts           → Componente standalone para la visualización del estado de carga
│   ├── loader.html         → Estructura HTML del spinner y mensajes informativos
│   └── loader.css          → Animación y estilos visuales del loader
├── contact-list/
│   ├── contact-list.ts     → Componente que recibe @Input() contacts y emite @Output() deleteContact
│   ├── contact-list.html   → Plantilla con @for para iterar contactos y botón de eliminación
│   └── contact-list.css    → Estilos de tarjetas de contacto, avatares y estados vacíos
├── contact-form/
│   ├── contact-form.ts     → Componente para captura de nombre/teléfono y emisión con @Output()
│   ├── contact-form.html   → Formulario con eventos (input) y validación básica
│   └── contact-form.css    → Estilos de campos de texto y botón de acción
├── app.ts                  → Componente raíz contenedor del estado principal (Signals) y lógica asíncrona
├── app.html                → Control de flujo con @if / @else para alternar entre loader y contenido
└── app.css                 → Layout principal, encabezado con datos del autor y footer
```

---

## 📚 Conceptos de las Diapositivas Aplicados

### 1. Componentes Standalone y Jerarquía (Diapositivas 3, 5 y 6)
- Estructuración modular mediante `@Component` con `selector`, `imports: [...]`, `templateUrl` y `styleUrl`.
- Integración de componentes hijos en el arreglo `imports` del componente padre (`App`).

### 2. Interpolación de Variables (Diapositiva 7)
- Uso de `{{ VARIABLE }}` para renderizar valores primitivos (strings, números, longitud de arreglos) en las plantillas HTML.

### 3. Comunicación con `@Input()` (Diapositivas 8, 9 y 10)
- Enlace de propiedades padre-hijo mediante `[contacts]="contacts()"` en el componente `ContactList` utilizando el decorador `@Input()`.

### 4. Emisión de Eventos con `@Output()` y `EventEmitter` (Diapositivas 11 y 12)
- Comunicación hijo-padre mediante `new EventEmitter<{ name: string; phone: string }>()`.
- Emisión de nuevos contactos con `(addContact)="agregarContacto($event)"` y eliminación con `(deleteContact)="eliminarContacto($event)"`.

### 5. Manejo de Estados Reactivos con `Signals` (Diapositivas 13 y 15)
- Declaración de señales reactivas:
  - `public isLoading = signal<boolean>(true);`
  - `public contacts = signal<{ name: string; phone: string }[]>([]);`
- Actualización inmutable de estados con `.set()`:
  - `this.contacts.set([...this.contacts(), nuevoContacto]);`
  - `this.contacts.set(this.contacts().filter(c => c !== contactoAEliminar));`
- Lectura de valores reactivos con `isLoading()` y `contacts()`.

### 6. Control de Flujo con Bloques `@if` / `@else` y `@for` (Diapositivas 14 y 16)
- `@if (isLoading()) { <app-loader /> } @else { ... }` para alternar la vista entre el loader y los componentes principales.
- `@for (contacto of contacts; track contacto.phone)` para renderizar dinámicamente cada contacto de la lista.

### 7. Manejo de Eventos HTML `(click)` y `(input)` (Diapositivas 18, 19, 20 y 21)
- Captura de eventos de usuario con `(click)="guardarContacto(...)"` y `(click)="eliminar(contacto)"`.
- Captura de datos en tiempo real mediante `(input)="capturarNombre($event)"` leyendo `e.target.value`.

---

## 🚀 Instrucciones de Ejecución

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **NPM** o **Angular CLI**

### Pasos para iniciar el servidor de desarrollo

1. Ubicarse en el directorio del proyecto:
   ```bash
   cd 02-Angular
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm start
   # o bien:
   npx ng serve
   ```

3. Abrir en el navegador web:
   ```
   http://localhost:4200/
   ```

### Construcción para producción (Build)
```bash
npx ng build
```

### Ejecución de pruebas unitarias
```bash
npx ng test
```
