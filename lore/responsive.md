# lore/responsive.md — Responsive / Móvil

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [responsive] Cursor custom visible en táctil o posición errática

- Contexto: Cursor personalizado (dot que sigue al mouse) implementado con `mousemove`. En tablets/móviles flota en `0,0` o se mueve erráticamente.
- Causa probable: El cursor DOM existe independientemente del tipo de dispositivo. Los eventos de mouse en táctil son sintéticos e impredecibles. En iOS puede quedar visible sin que nadie toque.
- Pista: `window.matchMedia('(pointer: fine)').matches` distingue mouse/trackpad (fine) de táctil (coarse). Si no es `fine`, no montar el cursor. En CSS: ocultar el cursor nativo solo en `@media (pointer: fine)`. `pointer: fine` es más preciso que `navigator.maxTouchPoints` en laptops táctiles con trackpad.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [responsive] Texto MONO uppercase con `letter-spacing` elevado desborda en móvil

- Contexto: Párrafo o subtítulo en fuente monoespaciada uppercase con `letterSpacing` >= `0.12em` y un `<br/>` manual que define la longitud de la primera línea.
- Causa probable: MONO uppercase ya es más ancho que fuentes proporcionales. El letter-spacing acumula espacio extra en cada carácter. El `<br/>` manual fija una longitud de línea diseñada para desktop que en el viewport angosto de móvil supera el espacio disponible. `overflow:hidden` en algún ancestro clipea el desborde.
- Pista: Eliminar `<br/>` manuales en textos MONO uppercase con letter-spacing elevado. Reducir `letterSpacing` si la versión desktop queda demasiado apretada sin el salto manual. Añadir `wordBreak: 'break-word'` como safety net. El browser hace mejor word-wrap automático que un `<br/>` fijo.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [responsive] `<br/>` manual en H2 genera salto de línea incorrecto en móvil

- Contexto: H2 con `<br/>` manuales para controlar el layout en desktop. En móvil, el punto de quiebre natural difiere del impuesto por el `<br/>`, dejando palabras sueltas o líneas muy cortas.
- Causa probable: Los `<br/>` son fijos — no responden al viewport. Lo que queda bien partido en un H2 de `clamp(44px, 6.5vw, 88px)` en 1440px de ancho puede quedar desbalanceado en 390px.
- Pista: JSX condicional por `isMobile`: sin `<br/>` en móvil (el browser hace wrap automático), con `<br/>` en desktop. Revisar sistemáticamente todos los H2/H3 con saltos manuales al auditar la versión móvil — es un patrón que se repite en múltiples secciones.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [responsive] Padding uniforme `clamp()` genera demasiado espacio entre secciones en móvil

- Contexto: Secciones que usan `padding: clamp(96px, 14vh, 136px) ...` sin diferenciación por breakpoint.
- Causa probable: El mínimo del `clamp` (96px) representa ~25% de la altura del viewport en móvil. En columna única el contenido es mucho más corto que en grid desktop. La combinación produce secciones que parecen medio vacías.
- Pista: `clamp()` solo no es suficiente para adaptar el espaciado a móvil — el mínimo sigue siendo grande para pantallas pequeñas. Buscar secciones que no tienen ningún condicional `isMobile` en su padding. El valor estándar para móvil en este proyecto es `48px 24px`.
- Confianza: confirmado
- ⚠ Validar contra código actual.
