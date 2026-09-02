# 02-Angular - Gestor de Contactos

Proyecto correspondiente a la Tarea 2 (Challenge 02) de la materia Estructuras de Datos II. Consiste en una aplicación web en Angular para gestionar una lista de contactos (ver contactos, agregar nuevos y eliminar existentes) simulando una carga de datos inicial con retardo.

## Requerimientos del Challenge 02

- Loader de carga visible al iniciar la aplicación.
- Carga de una lista inicial de contactos mediante funciones asíncronas (`async/await` y `setTimeout`).
- Formulario para registrar contactos con nombre y número de teléfono.
- Opción para eliminar contactos existentes.
- División del proyecto en componentes independientes.

## Componentes del Proyecto

- `src/app/loader`: Componente encargado de mostrar el mensaje de carga mientras se obtienen los datos.
- `src/app/contact-form`: Componente con los campos de texto y botón para agregar contactos.
- `src/app/contact-list`: Componente que recibe la lista y maneja la eliminación de contactos.
- `src/app/app.ts` / `src/app/app.html`: Componente principal que almacena la lista de contactos, el estado del loader y la lógica de agregar/eliminar.

## Conceptos vistos en clase

### JavaScript / TypeScript
- Variables (`const` y `let`)
- Funciones regulares y de flecha
- Arreglos y métodos (`push`, `filter`)
- Asincronía con Promesas, `async/await` y `setTimeout`

### Angular
- Componentes Standalone (`@Component` con arreglo `imports`)
- Paso de propiedades mediante `@Input()`
- Emisión de eventos hacia el componente padre mediante `@Output()` y `EventEmitter`
- Control de flujo en HTML mediante `@if` / `@else` y `@for`
- Eventos en plantillas como `(click)` y referencias de plantilla

## Cómo ejecutar el proyecto

1. Instalar dependencias (en caso de ser necesario):
```bash
npm install
```

2. Iniciar el servidor local:
```bash
npm start
# o tambien:
ng serve
```

3. Abrir en el navegador:
```
http://localhost:4200/
```

## Pruebas

Para ejecutar las pruebas unitarias del proyecto:
```bash
ng test
```

## Autor

Julian Andres Zapata Posada - 2240291
