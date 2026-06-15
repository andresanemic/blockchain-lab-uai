# lore/animation.md — GSAP / ScrollTrigger / CSS Animation

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [animation] Flash de elementos antes de que arranque GSAP (FOUC de animación)

- Contexto: Cualquier hero o componente con animación de entrada en GSAP + SSR (Next.js).
- Causa probable: React pinta el HTML antes de que JS corra. Si el CSS no oculta el elemento por defecto, el usuario ve el estado final por uno o dos frames antes de que GSAP lo lleve al estado inicial.
- Pista: Si el elemento empieza invisible o desplazado, asegurarse de que ese estado ya está en el markup (`style={{ opacity: 0 }}`, `style={{ transform: '...' }}`). GSAP debería confirmar ese estado con `fromTo`, nunca crearlo. Buscar usos de `gsap.from(...)` sobre elementos sin estado inicial en el HTML.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Marquee CSS reinicia con salto visible

- Contexto: Marquee infinito horizontal. Puede ocurrir con GSAP o CSS puro.
- Causa probable: Pocas copias del contenido o el porcentaje del keyframe no coincide con el número de copias. Con GSAP, la medición del DOM llega tarde → el elemento aparece en `x:0` un frame antes de saltar.
- Pista: Verificar número de copias (4 copias → keyframe a -25%; 2 copias → -50%). CSS puro es más confiable que GSAP para marquees porque no tiene la penalidad de la medición asíncrona del DOM. Si se usa GSAP, sospechar de `halfWidth` calculado tarde.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Barra de progreso con reflow en cada frame

- Contexto: Barra de progreso actualizada en `onUpdate` de ScrollTrigger (60fps).
- Causa probable: Implementación que cambia `width` en cada frame en vez de `transform`.
- Pista: `width` es propiedad de layout — recalcula geometría en cada frame. `scaleX` con `transformOrigin: 'left center'` es una operación de compositor puro. Buscar cualquier `element.style.width = ...` dentro de callbacks de 60fps.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Scroll horizontal pinned termina en posición incorrecta al redimensionar

- Contexto: Sección con `pin: true` + scroll horizontal animado (`gsap.to(track, { x: ... })`).
- Causa probable: El `end` y el valor de `x` se calculan una sola vez al montar. Al redimensionar, los valores quedan obsoletos.
- Pista: Convertir `x` y `end` en funciones `() => ...` para que se recalculen. Verificar que `invalidateOnRefresh: true` está activo en el ScrollTrigger. Sin esto el valor calculado en mount no responde a resize.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Columnas de scroll infinito vertical con salto en el loop

- Contexto: Columnas de cards que hacen scroll infinito vertical (similar al marquee horizontal pero vertical).
- Causa probable: Número de copias o porcentaje del keyframe incorrecto. Los fades con `linear-gradient` usan el color equivocado.
- Pista: 2 copias → keyframe a `-50%`. El fade superior/inferior debe coincidir exactamente con el color de fondo del contenedor. Si el color no es exacto, el fade se ve como un borde duro en la transición.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Jumping (salto) en timeline vertical scrubbed con GSAP pin

- Contexto: Timeline de N pasos donde cada paso se activa al hacer scroll dentro de una sección pinned.
- Causa probable: (A) `useState` para el paso activo → React re-renders mientras GSAP controla el pin → GSAP detecta cambio de geometría y recalcula spacer → salto. (B) Transición CSS en `maxHeight` o `height` durante `onUpdate` → reflow en cada frame → colisión con GSAP.
- Pista: Buscar `useState` para el índice de paso activo en componentes pinned. Sospechar de cualquier `transition: max-height ...` o `transition: height ...` dentro de un pin. El cambio de visibilidad de contenido debe ser instantáneo en `height`; solo `opacity` puede tener transición (compositor).
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Pasos intermedios se expanden brevemente al saltar a un paso no adyacente

- Contexto: Timeline de N pasos con click en dot para saltar pasos. El scroll programático cruza umbrales intermedios.
- Causa probable: `onUpdate` se dispara en cada frame del scroll programático y cruza los umbrales de pasos intermedios, activándolos. Un lock liberado por condición de umbral (`newStep >= target`) falla en scroll hacia atrás.
- Pista: El lock de click debe durar exactamente lo que dura el scroll programático. Buscar si el lock se libera por condición interna de `onUpdate` en lugar de en el callback `onComplete` del scroll. El lock liberado por condición puede fallar en dirección inversa.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Sección sube unos píxeles al activar el último paso de un timeline

- Contexto: Sección con `display:flex; align-items:center` o `translateY(-50%)` que contiene un timeline de pasos de altura variable.
- Causa probable: Cuando el contenido del paso activo crece, el método de centrado dinámico recalcula y reposiciona la sección. `align-items:center` redistribuye espacio libre; `translateY(-50%)` usa el alto propio del elemento que cambió.
- Pista: Sospechar de cualquier método de centrado que reaccione a cambios de altura del contenido. El síntoma es un desplazamiento vertical sutil pero visible al activar el último paso. Buscar `align-items:center` o `translateY(-50%)` en secciones con timeline de altura variable.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Transiciones CSS ausentes al hacer click en un punto del timeline

- Contexto: Click en dot/step del timeline activa un cambio instantáneo sin animación visible.
- Causa probable: El handler de click desactiva las CSS transitions antes de llamar a la función de activación (para evitar reflow durante scroll) y las re-habilita justo después — cuando el DOM ya está en el estado final y no hay nada que animar.
- Pista: Buscar el patrón "deshabilitar transitions → cambiar estado → setTimeout/RAF para re-habilitar". Si el lock de scroll (skipRef) ya bloquea `onUpdate`, ese patrón es innecesario y contraproducente.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Flash / línea blanca en el borde inferior de sección dark con pin rápido

- Contexto: Sección dark (`background: #080D2B`) con `pin: true`, fondo del body claro (cream).
- Causa probable: (A) Durante scroll rápido, GSAP activa el pin con un frame de retraso → el spacer/fondo del body asoma un instante. (B) El `.gsap-pin-spacer` hereda el fondo del body, que es cream, no dark.
- Pista: Verificar `anticipatePin: 1` en el ScrollTrigger de secciones dark pinned. Verificar que el `.gsap-pin-spacer` tiene el color de fondo correcto asignado vía CSS (`:has(#id)`), no solo vía JS. El CSS es más seguro porque aplica antes del primer paint.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Reveal de texto tipo "cortina que sube" (clip + blur)

- Contexto: H2 o título cuyas líneas deben aparecer subiendo desde debajo mientras se despejan.
- Causa probable: N/A (patrón de diseño, no un bug).
- Pista: Patrón: `overflow:hidden` por línea + `span` interior con `translateY(108%)` inline + `gsap.fromTo` con `blur`. El `108%` (no `100%`) garantiza que los descenders queden completamente ocultos. El `paddingBottom + marginBottom` compensa el clip en fuentes con descenders. El `filter:blur` añade dramatismo en fuentes grandes.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Texto scramble / decode efecto terminal

- Contexto: Subtítulo o párrafo que aparece como ruido aleatorio y se "decodifica" letra a letra.
- Causa probable: N/A (patrón de diseño).
- Pista: `setInterval` con caracteres aleatorios que revela el texto real de izquierda a derecha. Los espacios y guiones deben preservarse (no reemplazarlos con CHARS o el texto "baila" lateralmente). Disparar con `IntersectionObserver`, no con ScrollTrigger — es one-shot y no necesita sincronización con el scroll.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] GSAP apila tweens sobre el mismo elemento — vibración o comportamiento indeterminado

- Contexto: Manejadores de eventos (scroll, mousemove, resize) que llaman `gsap.to` repetidamente sobre el mismo elemento antes de que termine el tween anterior.
- Causa probable: Por defecto GSAP no cancela tweens anteriores sobre el mismo elemento. Múltiples tweens sobre la misma propiedad se ejecutan en paralelo con resultado indeterminado.
- Pista: Buscar `gsap.to(element, {...})` dentro de manejadores de eventos de alta frecuencia sin `overwrite`. `overwrite:'auto'` cancela solo las propiedades en conflicto, no el tween completo. Navbars con animación de scroll son candidatos frecuentes.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Estado React cambia durante una animación GSAP y el DOM salta

- Contexto: Componente con menú o modal animado con GSAP donde `setState` se llama al inicio de la función de cierre.
- Causa probable: `setState` dispara re-render en el siguiente frame. Si el componente renderiza condicionalmente con `isOpen`, el DOM cambia bajo los pies de GSAP a mitad de animación.
- Pista: Buscar `setState(false)` o `setState(null)` al inicio de funciones de cierre que también contienen tweens GSAP. El estado debería actualizarse en `onComplete` del timeline, no antes. Como alternativa, mantener el elemento siempre montado y controlarlo solo con transforms.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Items de menú desaparecen en orden incorrecto al cerrar

- Contexto: Menú con N items que entran con stagger de arriba hacia abajo y deben salir de abajo hacia arriba.
- Causa probable: El stagger de salida usa la misma dirección que el de entrada (desde el primer elemento al último).
- Pista: `stagger: { from: 'end' }` invierte el orden. Verificar que el `amount` del stagger de salida es más corto que el de entrada (el cierre debe sentirse más decisivo).
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Race condition entre guard síncrono (ref) y guard async (React state) en botones animados

- Contexto: Componente con navegación por pasos. Botones que parecen habilitados pero no responden al primer clic.
- Causa probable: `busyRef` (ref síncrona, se resetea inmediatamente en `onComplete`) y estado React `fading` (async, se procesa 1–2 frames después en modo concurrente) usados simultáneamente como guards. Durante la ventana de 1–2 frames, `busyRef` ya acepta clics pero el botón sigue `disabled={fading}`.
- Pista: Buscar componentes donde un `disabled` en el JSX depende de un estado React que se resetea en el mismo `onComplete` que un ref. El ref siempre va a ser más rápido. Si el patrón es "ref para bloquear la función + estado para deshabilitar el botón", hay riesgo de carrera.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] ScrollTrigger `onUpdate` pre-llena estado visual que debería empezar vacío

- Contexto: Elemento visual (barra, fill, indicador) cuyo estado inicial en el JSX difiere del valor que `onUpdate` calculará con `progress = 0`.
- Causa probable: El primer frame de `onUpdate` sobreescribe el estado inicial del JSX (ej. `scaleY(1)`) con el valor correcto para `progress=0` (ej. `scaleY(0)`). El usuario ve el flash del estado inicial incorrecto.
- Pista: El markup debe siempre reflejar el estado real con `progress=0` (generalmente `0`/vacío/oculto). `onUpdate` es la única fuente de verdad para cualquier valor que controle. Buscar elementos con estado inicial en JSX que también son actualizados por `onUpdate`.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] GSAP sobreescribe `display:none` de elementos que deben estar ocultos

- Contexto: Elemento con `display:none` vía CSS (Tailwind `hidden`, media query) que también tiene una animación GSAP de entrada.
- Causa probable: Cuando GSAP anima un elemento con `display:none`, asigna `display` inline para ejecutar la animación. Ese valor inline tiene mayor especificidad que la clase CSS y el elemento queda visible.
- Pista: Buscar animaciones GSAP sobre elementos que son ocultados en ciertos viewports (navbars desktop, elementos solo-desktop). El síntoma es el elemento visible en móvil aunque tenga clase `hidden`. Doble protección: guard por viewport en el `useEffect` + `display:none !important` en CSS para el viewport específico.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] GSAP `pin:true` en móvil — flash blanco, colapso y layout roto

- Contexto: Sección con `pin:true` y `height:100vh` que se muestra en columna única en móvil.
- Causa probable: GSAP crea un `pin-spacer` del doble o triple de la altura de la sección, desorganizando el flujo. En móvil el contenido es una columna sin suficiente altura para justificar el pin.
- Pista: Verificar si el pin está condicionado al viewport (`if (!isMobile)`). Si no lo está y la sección es columna única en móvil, es el candidato. Requiere `dependencies: [isMobile], revertOnUpdate: true` en `useGSAP` para que se limpie al cambiar el viewport.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Scroll triggers que se disparan tarde — el elemento ya está completamente visible

- Contexto: Animaciones de entrada en componentes visibles en pantalla antes de que dispare el trigger. Más frecuente en móvil (viewport más corto).
- Causa probable: `start: 'top 65–75%'` está calibrado para viewports altos de desktop. En móvil, ese porcentaje se alcanza cuando el elemento ya lleva tiempo visible.
- Pista: Triggers entre `top 88%` y `top 95%` son seguros para ambos breakpoints — disparan en cuanto el borde superior del elemento asoma en pantalla. Valores menores a `top 70%` son sospechosos en componentes responsive. Buscar triggers con porcentajes bajos en componentes que también se usan en móvil.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [animation] Animación GSAP de entrada sin bifurcación por ruta causa FOUC en páginas no-target

- Contexto: Componente compartido (navbar, header) con una animación `gsap.fromTo` de entrada que solo se desea en una ruta específica (ej. landing), pero que se importa en cada `page.tsx` sin guard de pathname.
- Causa probable: La animación corre en TODAS las rutas. En páginas no-target, el elemento permanece invisible durante el delay+duration completo (puede ser ~1.4s) antes de llegar a `opacity:1`.
- Pista: Bifurcar en el `useEffect` con `usePathname()`. En la ruta target: `gsap.fromTo(...)` completo. En el resto: `gsap.set(el, { opacity: 1, ... })` inmediato. El fallback SSR (`pathname === null`) debe tratarse igual que la ruta target para evitar flash de re-hydration. Añadir `hasAnimated.current` ref para evitar re-animación en resize mobile→desktop.
- Confianza: conjetura (primera aparición — INC-001)
- ⚠ Validar contra código actual.
