# 03-Challege - Listas Enlazadas en Angular

Proyecto correspondiente al **Challenge 03** de la asignatura **Estructuras de Datos II**.

**Estudiante:** Julian Andres Zapata Posada  
**Código:** 2240291  
**Profesor:** Jonathan López Londoño  

---

## Descripción del Proyecto

Implementación de estructuras de datos lineales enlazadas (Lista Enlazada Simple y Lista Doblemente Enlazada) integradas en una aplicación Angular modular construida con componentes standalone y estado reactivo basado en **Signals**, respetando los temas vistos en:
- `Clase 02 - Refuerzo Angular.pdf`
- `Clase 03 - Listas.pdf`

---

## Requerimientos del Challenge 03

1. **Lista Enlazada Simple (`LinkedList`)**:
   - Implementación de la clase `Node` y `LinkedList` con métodos `append`, `peek`, `size`, `remove` y `print`.
   - Simulación de un reproductor de canciones en orden secuencial con datos simulados (*mocked data*):
     - *La Romana* - Bad Bunny y El Alfa
     - *POR QUÉ SERÁ* - Grupo Frontera y Maluma
     - *El granjero* - Arcángel
     - *SUPERSAYAYIN* - Topboy TGR
     - *Te Hubieras Ido Antes* - Julión Álvarez y su Norteño Banda
   - Botón de navegación secuencial al siguiente nodo (`current = current.next`), reinicio desde `head` y adición de canciones con `append`.

2. **Lista Doblemente Enlazada (`DoublyLinkedList`)**:
   - Implementación de la clase `DoublyNode` y `DoublyLinkedList` con punteros `next` y `prev`.
   - Simulación de navegación web con historial hacia atrás y hacia adelante:
     - Google, YouTube, Spotify Web, UAO Virtual y GitHub.
   - Navegación bidireccional con botones `⬅️ Atrás` (`current = current.prev`) y `Adelante ➡️` (`current = current.next`), e inspección de punteros en vivo.

3. **Componentes en Angular**:
   - `src/app/reproductor-musica`: Componente independiente para el reproductor.
   - `src/app/historial-navegador`: Componente independiente para el historial web.
   - `src/app/app`: Componente principal que integra ambas vistas y muestra los datos del estudiante.

---

## Cómo ejecutar el proyecto

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm start
```

3. Abrir en el navegador:
```text
http://localhost:4200
```
