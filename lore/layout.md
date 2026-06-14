# lore/layout.md — Layout / Posicionamiento / Efectos visuales

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [layout] `backgroundAttachment: fixed` para grillas continuas entre secciones

- Contexto: Sitio con grilla de fondo que debe parecer continua entre secciones distintas.
- Causa probable: `background-position` por defecto es relativo al bounding box del elemento. Cada sección tiene su propio origen → las líneas de la grilla no se alinean entre secciones.
- Pista: `backgroundAttachment: 'fixed'` hace que el origen sea el viewport — todas las secciones comparten el mismo sistema de coordenadas. Advertencia: no funciona dentro de elementos con `transform`, `filter` o `will-change` (crean stacking context y rompen el `fixed`). Si la grilla se desalinea en alguna sección, verificar si hay un ancestro con esas propiedades.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] Efecto glow de cursor sin repaints costosos

- Contexto: Efecto spotlight / radial glow que sigue al cursor dentro de una sección.
- Causa probable: Implementación naive con `position:fixed` o actualizando `element.style.background` completo en cada `mousemove` genera repaints en toda la página.
- Pista: Dos capas absolutas con `pointer-events:none` — una para el glow suave de fondo y otra con `mask-image` radial. En `mousemove`, actualizar solo la `mask-image` y el `background` de esas capas — operaciones de compositor que la GPU maneja sin repaint. El glow que "se congela" al salir del elemento es efecto intencional (no limpiar en `mouseleave`).
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] `line-height: 1` recorta letras en fuentes display

- Contexto: Heading o marquee con `lineHeight: 1` en fuentes display (Space Grotesk, Archivo, Lato...) dentro de un contenedor con `overflow: hidden`.
- Causa probable: El line-box a `lineHeight: 1` tiene exactamente el alto del `font-size`. Las fuentes display tienen ascenders/descenders que sobresalen del em-square y son cortados por `overflow:hidden`.
- Pista: Mínimo `lineHeight: 1.08`–`1.12` para fuentes display. Si el contenedor tiene `overflow:hidden` y no se puede cambiar, añadir `paddingBottom` al elemento de texto con `marginBottom` negativo equivalente para compensar sin afectar el layout. Revisar especialmente letras `g`, `j`, `p`, `y` en el estado final.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] `overflow-hidden` en `<section>` recorta el `<h2>` encima del marquee

- Contexto: Sección con un heading encima de un marquee horizontal. Se añade `overflow:hidden` a la sección para contener el marquee.
- Causa probable: `overflow:hidden` en la `<section>` recorta todo el contenido visual que sobresale, incluyendo el ink overflow del `<h2>`.
- Pista: `overflow:hidden` debe estar solo en el `<div>` que contiene las filas del marquee, no en la `<section>` padre. El `<h2>` y otros elementos del bloque necesitan respirar fuera de ese clip. Si el `<h2>` se ve recortado, buscar qué ancestro tiene `overflow:hidden` y evaluar si puede moverse a un nivel inferior.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] Gradiente dinámico en `mousemove` reescribe cadena larga cada frame

- Contexto: Efecto spotlight donde `element.style.background = 'radial-gradient(... at X% Y% ...)'` se actualiza en cada `mousemove`.
- Causa probable: Reescribir la cadena completa del gradiente ~60 veces por segundo es trabajo de parseado innecesario.
- Pista: Definir el gradiente una sola vez con `var(--sx, 50%) var(--sy, 50%)` en el estilo base y actualizar solo las variables CSS con `setProperty('--sx', ...)` en el handler. `setProperty` es operación de compositor — el gradiente ya parsado solo cambia sus coordenadas. Los valores por defecto `50%` evitan un flash antes del primer `mousemove`.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] Warning React: conflicto entre shorthand `flex` y longhand `flexShrink`

- Contexto: Objeto `style` de React con `flex: isMobile ? 1 : undefined` y `flexShrink: 0` en el mismo elemento.
- Causa probable: `flex` es shorthand de `flexGrow` + `flexShrink` + `flexBasis`. React detecta el conflicto en re-renders y produce un warning. El comportamiento puede ser indefinido.
- Pista: Nunca combinar `flex` con ninguno de sus longhands en el mismo elemento. Elegir un enfoque: o el shorthand solo, o los tres longhands (`flexGrow`, `flexShrink`, `flexBasis`) explícitos. Buscar el warning "Updating a style property during rerender (flex) when a conflicting property is set" en la consola.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [layout] Overflow-x horizontal en móvil — el sitio se desplaza lateralmente

- Contexto: Móvil con swipe lateral revelando un margen blanco o el layout apareciendo cortado.
- Causa probable: Algún elemento supera el ancho del viewport (margen negativo, grilla con `backgroundAttachment:fixed`, capas absolutas de glow) causando overflow-x implícito.
- Pista: `overflow-x:hidden` en `html` Y `body` bloquea cualquier overflow lateral a nivel raíz. Poner solo en `body` puede no ser suficiente. Verificar que el fix no oculta síntomas de un elemento genuinamente desbordado que debería corregirse en origen.
- Confianza: confirmado
- ⚠ Validar contra código actual.
