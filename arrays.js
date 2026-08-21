/*  
        Julian Andres Zapata Posada - 2240291

    Por cada método de JS para trabajar con Arrays contamos con:
        1. Para qué sirve
        2. Ejemplo de cómo se usa
        3. Respuesta final con el resultado de lo que hace el método
*/

/* 1. at()

   ¿Para qué sirve?
   Permite seleccionar un elemento indicando su posición numérica. Admite números negativos para contar desde el final hacia el inicio.

   Ejemplo:
*/

const colores = ["rojo", "verde", "azul", "amarillo"];
const colorSeleccionado = colores.at(-1);

console.log(colorSeleccionado);

/* 
    R// 
      at(-1) toma el último elemento del arreglo, arrojando "amarillo".
*/


/* 2. concat()

   ¿Para qué sirve?
   Combina dos o más arreglos en uno solo nuevo, sin alterar los arreglos de partida.

   Ejemplo:
*/

const perros = ["Firulais", "Rex"];
const gatos = ["Michi", "Tom"];
const mascotas = perros.concat(gatos);

console.log(mascotas);

/* 
    R// 
      concat() junta ambas listas produciendo ["Firulais", "Rex", "Michi", "Tom"].
*/


/* 3. constructor

   ¿Para qué sirve?
   Es la función constructora encargada de crear el prototipo del arreglo (la clase global Array).

   Ejemplo:
*/

const edades = [18, 25, 30];

console.log(edades.constructor === Array);

/* 
    R// 
      constructor apunta a la función nativa Array, por lo que la comparación imprime true.
*/


/* 4. copyWithin()

   ¿Para qué sirve?
   Transfiere una secuencia de valores a otra posición dentro del mismo arreglo, sobreescribiendo los valores previos sin alterar su longitud.

   Ejemplo:
*/

const letras = ["a", "b", "c", "d", "e"];
letras.copyWithin(0, 3, 5);

console.log(letras);

/* 
    R// 
      copyWithin() copió las posiciones 3 a 5 ("d", "e") y las pegó desde el inicio, quedando ["d", "e", "c", "d", "e"].
*/


/* 5. entries()

   ¿Para qué sirve?
   Genera un objeto iterador con parejas de clave y valor [índice, elemento] por cada posición.

   Ejemplo:
*/

const paises = ["Colombia", "México"];
const iteradorPaises = paises.entries();

console.log(iteradorPaises.next().value);
console.log(iteradorPaises.next().value);

/* 
    R// 
      entries() va extrayendo pares [índice, valor], mostrando primero [0, "Colombia"] y luego [1, "México"].
*/


/* 6. every()

   ¿Para qué sirve?
   Verifica si la totalidad de los elementos cumplen una condición establecida. Da true únicamente si todos la satisfacen.

   Ejemplo:
*/

const notas = [4.5, 3.8, 4.0, 5.0];
const todosAprobados = notas.every(nota => nota >= 3.0);

console.log(todosAprobados);

/* 
    R// 
      every() comprueba que ninguna nota sea inferior a 3.0 y devuelve true.
*/


/* 7. fill()

   ¿Para qué sirve?
   Sustituye elementos del arreglo con un valor estático en un rango de posiciones definido.

   Ejemplo:
*/

const casillas = [0, 0, 0, 0];
casillas.fill(7, 1, 3);

console.log(casillas);

/* 
    R// 
      fill(7, 1, 3) asignó el valor 7 entre las posiciones 1 y 2, resultando en [0, 7, 7, 0].
*/


/* 8. filter()

   ¿Para qué sirve?
   Construye un nuevo arreglo filtrando únicamente los elementos que pasen exitosamente una prueba lógica.

   Ejemplo:
*/

const precios = [1500, 8000, 3200, 12000, 500];
const preciosAltos = precios.filter(precio => precio > 3000);

console.log(preciosAltos);

/* 
    R// 
      filter() conservó únicamente los valores mayores a 3000, entregando [8000, 3200, 12000].
*/


/* 9. find()

   ¿Para qué sirve?
   Rastrea el arreglo y retorna el primer elemento que cumpla con la función de búsqueda especificada.

   Ejemplo:
*/

const invitados = ["Ana", "Carlos", "Beatriz", "David"];
const hallado = invitados.find(nombre => nombre.startsWith("B"));

console.log(hallado);

/* 
    R// 
      find() detectó el primer nombre que empieza por "B", imprimiendo "Beatriz".
*/


/* 10. findIndex()

   ¿Para qué sirve?
   Localiza el primer elemento que satisfaga una condición y entrega su posición numérica (índice). Si no lo encuentra da -1.

   Ejemplo:
*/

const productos = ["Arroz", "Leche", "Café", "Pan"];
const posicionCafe = productos.findIndex(item => item === "Café");

console.log(posicionCafe);

/* 
    R// 
      findIndex() encontró "Café" en la posición 2.
*/


/* 11. findLast()

   ¿Para qué sirve?
   Inspecciona la lista en orden inverso (de derecha a izquierda) para encontrar el primer elemento que cumpla una condición.

   Ejemplo:
*/

const puntajes = [12, 45, 18, 55, 30];
const ultimoSuperior = puntajes.findLast(p => p > 40);

console.log(ultimoSuperior);

/* 
    R// 
      findLast() revisó de atrás hacia adelante y halló que 55 es el último número superior a 40.
*/


/* 12. findLastIndex()

   ¿Para qué sirve?
   Recorre desde el final hacia el inicio buscando el índice del primer elemento que cumpla la prueba.

   Ejemplo:
*/

const temperaturas = [20, 35, 22, 38, 25];
const indiceCaluroso = temperaturas.findLastIndex(t => t > 30);

console.log(indiceCaluroso);

/* 
    R// 
      findLastIndex() ubicó la última temperatura mayor a 30 (el 38) en el índice 3.
*/


/* 13. flat()

   ¿Para qué sirve?
   Desempaqueta niveles de arreglos anidados dentro de un arreglo principal, unificándolos en uno más plano.

   Ejemplo:
*/

const matriz = [1, [2, 3], [4, [5, 6]]];
const aplanado = matriz.flat(2);

console.log(aplanado);

/* 
    R// 
      flat(2) niveló los arreglos internos hasta 2 profundidades, devolviendo [1, 2, 3, 4, 5, 6].
*/


/* 14. flatMap()

   ¿Para qué sirve?
   Transforma cada elemento mediante una función y aplana el resultado un nivel de profundidad en una sola operación.

   Ejemplo:
*/

const frases = ["hola mundo", "buen dia"];
const palabras = frases.flatMap(f => f.split(" "));

console.log(palabras);

/* 
    R// 
      flatMap() separó los términos y los aplanó en una única lista: ["hola", "mundo", "buen", "dia"].
*/


/* 15. forEach()

   ¿Para qué sirve?
   Ejecuta una instrucción o bloque de código por cada elemento que contiene el arreglo.

   Ejemplo:
*/

const usuarios = ["Laura", "Mateo", "Sofia"];

usuarios.forEach(u => console.log(`Bienvenido/a ${u}`));

/* 
    R// 
      forEach() iteró sobre cada nombre mostrando un saludo individual en consola para los 3 usuarios.
*/


/* 16. includes()

   ¿Para qué sirve?
   Determina si un valor puntual está dentro del arreglo, respondiendo con true o false.

   Ejemplo:
*/

const ciudades = ["Cali", "Bogotá", "Medellín"];
const ciudadPresente = ciudades.includes("Cali");

console.log(ciudadPresente);

/* 
    R// 
      includes() comprobó que "Cali" sí se encuentra en el arreglo y devolvió true.
*/


/* 17. indexOf()

   ¿Para qué sirve?
   Indica la primera posición en la que aparece un valor buscado. Si no existe, devuelve -1.

   Ejemplo:
*/

const instrumentos = ["guitarra", "piano", "batería"];
const posicionPiano = instrumentos.indexOf("piano");

console.log(posicionPiano);

/* 
    R// 
      indexOf() ubicó "piano" en el índice 1.
*/


/* 18. join()

   ¿Para qué sirve?
   Concatena todos los elementos en una sola cadena de texto usando un conector personalizado.

   Ejemplo:
*/

const fechaPartes = ["2026", "08", "21"];
const fechaCadena = fechaPartes.join("-");

console.log(fechaCadena);

/* 
    R// 
      join("-") unió los elementos mediante guiones, generando "2026-08-21".
*/


/* 19. keys()

   ¿Para qué sirve?
   Retorna un iterador compuesto por los índices numéricos de cada posición del arreglo.

   Ejemplo:
*/

const marcas = ["Toyota", "Ford", "Chevrolet"];
const indicesMarcas = [...marcas.keys()];

console.log(indicesMarcas);

/* 
    R// 
      keys() extrajo las posiciones del arreglo formando la lista [0, 1, 2].
*/


/* 20. lastIndexOf()

   ¿Para qué sirve?
   Busca la última posición en la que se ubica un valor coincidente dentro del arreglo.

   Ejemplo:
*/

const codigos = [101, 202, 303, 101, 404];
const ultimaOcurrencia = codigos.lastIndexOf(101);

console.log(ultimaOcurrencia);

/* 
    R// 
      lastIndexOf() detectó que la última aparición del número 101 corresponde al índice 3.
*/


/* 21. map()

   ¿Para qué sirve?
   Crea un nuevo arreglo con los resultados de aplicar una transformación matemática o lógica a cada elemento.

   Ejemplo:
*/

const dolares = [5, 10, 20];
const pesos = dolares.map(d => d * 4000);

console.log(pesos);

/* 
    R// 
      map() multiplicó cada valor por 4000 entregando [20000, 40000, 80000].
*/


/* 22. pop()

   ¿Para qué sirve?
   Remueve el elemento final del arreglo, lo devuelve y disminuye la cantidad de elementos.

   Ejemplo:
*/

const tareas = ["Lavar", "Cocinar", "Estudiar"];
const tareaQuitada = tareas.pop();

console.log(tareaQuitada);
console.log(tareas);

/* 
    R// 
      pop() extrajo "Estudiar" del final, dejando el arreglo en ["Lavar", "Cocinar"].
*/


/* 23. push()

   ¿Para qué sirve?
   Inserta uno o más elementos al extremo final del arreglo y retorna el nuevo conteo total.

   Ejemplo:
*/

const carrito = ["Camisa", "Pantalón"];
const nuevoConteo = carrito.push("Zapatos");

console.log(carrito);
console.log(nuevoConteo);

/* 
    R// 
      push() sumó "Zapatos" al final y reportó un tamaño actualizado de 3 elementos.
*/


/* 24. reduce()

   ¿Para qué sirve?
   Acumula los elementos de izquierda a derecha ejecutando una función reductora, entregando un único valor consolidado.

   Ejemplo:
*/

const gastos = [50, 120, 30, 200];
const totalGastos = gastos.reduce((acumulador, actual) => acumulador + actual, 0);

console.log(totalGastos);

/* 
    R// 
      reduce() sumó todos los montos sucesivamente, obteniendo 400.
*/


/* 25. reduceRight()

   ¿Para qué sirve?
   Aplica una operación acumulativa procesando los elementos en sentido inverso (de derecha a izquierda).

   Ejemplo:
*/

const silabas = ["do", "fa", "re"];
const palabraInvertida = silabas.reduceRight((acum, silaba) => acum + silaba, "");

console.log(palabraInvertida);

/* 
    R// 
      reduceRight() unió los textos iniciando desde la derecha, produciendo "refado".
*/


/* 26. reverse()

   ¿Para qué sirve?
   Invierte la posición de los elementos directamente sobre el arreglo original.

   Ejemplo:
*/

const serie = [1, 2, 3, 4, 5];
serie.reverse();

console.log(serie);

/* 
    R// 
      reverse() colocó los elementos en sentido contrario, quedando [5, 4, 3, 2, 1].
*/


/* 27. shift()

   ¿Para qué sirve?
   Suprime el primer elemento del arreglo, lo retorna y recorre los elementos restantes una posición hacia atrás.

   Ejemplo:
*/

const fila = ["Pedro", "Juan", "Maria"];
const primerTurno = fila.shift();

console.log(primerTurno);
console.log(fila);

/* 
    R// 
      shift() retiró a "Pedro" de la posición 0, dejando la lista en ["Juan", "Maria"].
*/


/* 28. slice()

   ¿Para qué sirve?
   Corta y extrae un segmento del arreglo delimitado por índices, sin modificar el arreglo original.

   Ejemplo:
*/

const planetas = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter"];
const seleccion = planetas.slice(1, 4);

console.log(seleccion);

/* 
    R// 
      slice(1, 4) extrajo los elementos en los índices 1, 2 y 3, retornando ["Venus", "Tierra", "Marte"].
*/


/* 29. some()

   ¿Para qué sirve?
   Evalúa si al menos un elemento de la lista cumple con el criterio dado. Devuelve true si encuentra alguna coincidencia.

   Ejemplo:
*/

const edadesGrupo = [14, 16, 17, 21, 15];
const hayMayor = edadesGrupo.some(edad => edad >= 18);

console.log(hayMayor);

/* 
    R// 
      some() detectó el valor 21 (que cumple ser >= 18) y retornó true.
*/


/* 30. sort()

   ¿Para qué sirve?
   Reordena los elementos dentro del mismo arreglo siguiendo un orden alfabético o según una regla de comparación personalizada.

   Ejemplo:
*/

const valores = [40, 100, 1, 5, 25];
valores.sort((a, b) => a - b);

console.log(valores);

/* 
    R// 
      sort() organizó los números de menor a mayor, produciendo [1, 5, 25, 40, 100].
*/


/* 31. splice()

   ¿Para qué sirve?
   Permite eliminar, reemplazar o agregar elementos en cualquier punto del arreglo modificando la estructura original.

   Ejemplo:
*/

const meses = ["Enero", "Marzo", "Abril"];
meses.splice(1, 0, "Febrero");

console.log(meses);

/* 
    R// 
      splice() se ubicó en el índice 1, no borró ningún dato (0) e insertó "Febrero", dando ["Enero", "Febrero", "Marzo", "Abril"].
*/


/* 32. toLocaleString()

   ¿Para qué sirve?
   Convierte los elementos a texto aplicando las convenciones regionales del idioma o país especificado.

   Ejemplo:
*/

const valoresMonetarios = [1500.5, 3000];
const textoRegional = valoresMonetarios.toLocaleString("es-CO");

console.log(textoRegional);

/* 
    R// 
      toLocaleString() formateó los números con las normas regionales correspondientes.
*/


/* 33. toString()

   ¿Para qué sirve?
   Convierte el arreglo completo en una cadena de texto plana con los elementos separados por comas.

   Ejemplo:
*/

const vocales = ["a", "e", "i", "o", "u"];
const textoPlano = vocales.toString();

console.log(textoPlano);

/* 
    R// 
      toString() unió los caracteres formando la cadena "a,e,i,o,u".
*/


/* 34. unshift()

   ¿Para qué sirve?
   Inserta uno o más elementos en la posición inicial del arreglo y retorna el nuevo número de elementos.

   Ejemplo:
*/

const atletas = ["Carlos", "Daniela"];
const totalAtletas = atletas.unshift("Andrés");

console.log(atletas);
console.log(totalAtletas);

/* 
    R// 
      unshift() añadió "Andrés" al principio del arreglo y devolvió el nuevo tamaño total de 3.
*/


/* 35. values()

   ¿Para qué sirve?
   Genera un objeto iterador para recorrer secuencialmente cada uno de los valores contenidos en el arreglo.

   Ejemplo:
*/

const dias = ["Lunes", "Martes", "Miércoles"];
const iteradorValores = dias.values();

for (const dia of iteradorValores) {
  console.log(dia);
}

/* 
    R// 
      values() entregó cada elemento de manera individual, imprimiendo "Lunes", "Martes" y "Miércoles".
*/
