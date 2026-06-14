# Soluciones a problemas comunes de animación

Dos bugs resueltos en este proyecto que probablemente aparecerán en cualquier sitio con hero animado + marquee CSS.

---

## Problema 1: Flash de elementos antes de que carguen las animaciones (FOUC de animación)

### Síntoma
Al cargar la página, los elementos del hero y navbar aparecen en su estado final (visibles, en posición) por uno o dos fotogramas antes de que GSAP los lleve a su estado inicial y ejecute la animación de entrada. El resultado es un parpadeo molesto: los textos "saltan" desde su posición final a la inicial y vuelven.

### Causa
GSAP es JavaScript. React renderiza el HTML en el servidor (SSR) o en el primer paint del cliente, y el JS de GSAP corre después. Si el CSS del elemento no oculta el elemento por defecto, el usuario ve el HTML crudo antes de que GSAP lo tome.

### Solución: establecer el estado inicial en el HTML/CSS, no en GSAP

El truco es que el elemento ya tenga el estado inicial (`opacity: 0`, `transform: translateY(115%)`, etc.) **antes** de que GSAP lo toque. GSAP entonces solo hace el `to`, no el `fromTo`.

**Para elementos con clip-reveal (texto que sube desde debajo):**
```tsx
// El span interior ya tiene transform aplicado en el HTML
<span className="block overflow-hidden">
  <span
    className="hl-inner block"
    style={{ transform: 'translateY(115%)' }}  // ← estado inicial en el markup
  >
    {text}
  </span>
</span>
```
```ts
// GSAP solo anima hacia el estado final, no define el inicial
tl.fromTo(
  '.hl-inner',
  { y: '115%' },   // coincide con el inline style de arriba
  { y: '0%', duration: 0.88, ease: EASE_CHAR, stagger: { amount: 0.28 } }
)
```

**Para elementos con fade (subtítulos, secciones):**
```tsx
// opacity: 0 en el markup, GSAP lo lleva a 1
<div className="hero-sub" style={{ opacity: 0 }}>
  ...
</div>
```
```ts
tl.fromTo(
  '.hero-sub',
  { opacity: 0, y: 28 },
  { opacity: 1, y: 0, duration: 0.75 }
)
```

**Para ScrollReveal (componente genérico):** el wrapper no tiene `opacity: 0` en el markup porque eso rompería elementos fuera del viewport que nunca se animarían si JS falla. En su lugar, se usa `fromTo` y se acepta que la primera fracción de segundo pueda verse. La solución más robusta si el flash es visible es agregar `visibility: hidden` con CSS y quitarlo en el callback `onStart` de GSAP:

```ts
gsap.fromTo(ref.current,
  { opacity: 0, y: 48, visibility: 'hidden' },
  { opacity: 1, y: 0, visibility: 'visible', ... }
)
```

### Regla general
> Si un elemento empieza invisible o desplazado, pon ese estado directamente en el HTML con `style={{ opacity: 0 }}` o `style={{ transform: '...' }}`. GSAP debe confirmar ese estado con `fromTo`, no crearlo.

---

## Problema 2: El marquee se reinicia con un salto visible

### Síntoma
El marquee corre suavemente pero en un punto hace un "salto" o "flash" al reiniciarse: el contenido desaparece o salta bruscamente al inicio en lugar de hacer un loop imperceptible.

### Causa raíz: pocas copias del contenido

Un marquee infinito funciona duplicando el contenido y desplazándose exactamente el ancho de **un set** para que al llegar al final se vea idéntico al inicio. Si el porcentaje del keyframe no coincide con el número de copias, el loop no es seamless.

Con **2 copias** y el keyframe a `-50%` funciona en teoría, pero en la práctica si el ancho de un set se acerca al ancho del viewport, el hueco entre loops es visible (los elementos se "caen" fuera del borde).

**La versión rota (con GSAP) que teníamos antes:**
```ts
// GSAP mide scrollWidth de forma asíncrona → flash en el primer frame
gsap.fromTo(track, { x: 0 }, { x: -halfWidth, repeat: -1, ease: 'none' })
```
GSAP necesita medir el DOM para calcular `halfWidth`, y ese cálculo llega tarde → el elemento aparece en `x: 0` por un fotograma antes de saltar a la posición correcta.

### Solución: CSS puro con 4 copias y keyframes al 25%

**1. En `globals.css` — los keyframes:**
```css
@keyframes marquee-left {
  from { transform: translateX(0%); }
  to   { transform: translateX(-25%); }
}

@keyframes marquee-right {
  from { transform: translateX(-25%); }
  to   { transform: translateX(0%); }
}
```

El porcentaje es `100% / número_de_copias`. Con 4 copias → `25%`. El contenedor se desplaza exactamente el ancho de 1 set (= 25% del total de 4 sets), luego CSS lo reinicia al punto de partida — visualmente idéntico.

**2. En el componente React:**
```tsx
function MarqueeRow({ items, direction = 'left', duration = 38 }) {
  const [paused, setPaused] = useState(false)
  // 4 copias — crítico para que el loop sea seamless
  const doubled = [...items, ...items, ...items, ...items]

  return (
    <div className="relative flex overflow-hidden py-3">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          display: 'flex',
          width: 'max-content',
          flexShrink: 0,
          willChange: 'transform',
          animationName: direction === 'left' ? 'marquee-left' : 'marquee-right',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="whitespace-nowrap px-5">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
```

**Puntos clave:**
- `width: max-content` + `flexShrink: 0` — el contenedor no se comprime.
- `willChange: transform` — le avisa al navegador que este elemento va a animarse, activa compositing en GPU.
- `overflow-hidden` en el wrapper externo — oculta los sets fuera de pantalla.
- El `paused ? 'paused' : 'running'` permite pausar al hover sin JavaScript extra.
- **No usar `overflow-hidden` en el `<section>` padre** si tiene hijos que sobresalen verticalmente (ej. títulos con descenders). Poner el `overflow-hidden` solo en el div que contiene las filas del marquee.

### Degradados laterales (fade edges)

Para que los extremos del marquee se fundan con el fondo:
```tsx
<div className="relative">
  {/* fade izquierdo */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24"
    style={{ background: `linear-gradient(to right, ${fadeColor} 0%, transparent 100%)` }}
  />
  {/* fade derecho */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24"
    style={{ background: `linear-gradient(to left, ${fadeColor} 0%, transparent 100%)` }}
  />
  {/* filas del marquee */}
  <MarqueeRow ... />
</div>
```

`fadeColor` debe coincidir exactamente con el color de fondo de la sección. Si la sección usa un color diferente al predeterminado (ej. `bg-bg` en lugar de `bg-surface`), hay que pasar el valor hex correcto como prop.

---

---

## Problema 3: Lenis + GSAP ScrollTrigger desincronizados

### Síntoma
Con Lenis activo, las animaciones de ScrollTrigger se disparan en el momento incorrecto, se ven entrecortadas, o el scrub no coincide con la posición real del scroll. Al volver a una pestaña que estaba en segundo plano, hay un salto brusco.

### Causa
Lenis y GSAP corren sus propios loops de `requestAnimationFrame` independientes. ScrollTrigger lee `window.scrollY` directamente, pero Lenis interpola el scroll en su propio tick — si los ticks no están sincronizados, ScrollTrigger lee valores desactualizados.

El salto al volver al tab lo causa `gsap.ticker.lagSmoothing()` por defecto: cuando detecta que pasó mucho tiempo entre frames (tab en segundo plano), GSAP "compensa" saltando hacia adelante en el timeline, creando un jump visual.

### Solución: atar el RAF de Lenis al ticker de GSAP

```ts
// LenisProvider.tsx
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'

const lenis = new Lenis({ lerp: 0.07, smoothWheel: true })

// Lenis usa el mismo frame que GSAP → ScrollTrigger siempre lee valores actualizados
const update = (time: number) => lenis.raf(time * 1000)
gsap.ticker.add(update)

// Evita el salto al volver al tab
gsap.ticker.lagSmoothing(0)
```

**Por qué `time * 1000`**: el ticker de GSAP pasa el tiempo en segundos; `lenis.raf()` espera milisegundos.

**Por qué `lagSmoothing(0)`**: desactiva la compensación de lag. Sin esto, si la pestaña estuvo inactiva 2 segundos, GSAP avanza 2 segundos en el timeline al volver → salto.

---

## Problema 4: GSAP falla en SSR / build de Next.js

### Síntoma
El build de producción falla con `ReferenceError: window is not defined`, o el plugin de GSAP no funciona en el primer render.

### Causa
`ScrollTrigger`, `SplitText` y otros plugins de GSAP acceden a `window` en el momento del import. Next.js renderiza en el servidor donde `window` no existe.

### Solución: guard `typeof window !== 'undefined'`

```ts
// lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export { gsap, ScrollTrigger }
```

Centralizar todos los imports de GSAP en un solo archivo (`lib/gsap.ts`) y siempre importar desde ahí — nunca `import { gsap } from 'gsap'` directamente en los componentes. Así el guard se ejecuta una sola vez.

---

## Problema 5: `lenis.scrollTo()` no está disponible en componentes hijos

### Síntoma
Un componente profundo (ej. un botón de dot-click en el timeline) necesita llamar `lenis.scrollTo()` pero no tiene acceso a la instancia de Lenis, que vive en el Provider.

### Causa
Lenis se instancia en el Provider raíz. Pasarlo por props o Context implica boilerplate y re-renders innecesarios.

### Solución: exponer la instancia en `window.__lenis`

```ts
// LenisProvider.tsx — al crear la instancia:
;(window as any).__lenis = lenis

// Al destruir:
;(window as any).__lenis = null

// En cualquier componente hijo:
function handleDotClick(target: number) {
  const lenis = (window as any).__lenis
  if (lenis) {
    lenis.scrollTo(targetPx, { duration: 0.75 })
  } else {
    window.scrollTo({ top: targetPx, behavior: 'smooth' })
  }
}
```

El fallback a `window.scrollTo` garantiza que si Lenis no cargó (SSR, error), la navegación igual funciona.

---

## Problema 6: Las líneas de la grilla se desalinean entre secciones

### Síntoma
El sitio tiene una grilla de fondo visible (líneas cada 120px). Al hacer scroll, las líneas de una sección no continúan con las de la siguiente — hay un desfase visual al cruzar el borde entre secciones.

### Causa
`background-position` por defecto es relativo al bounding box del elemento. Cada sección empieza en `background-position: 0 0`, que es la esquina superior izquierda de ESA sección — no del viewport.

### Solución: `backgroundAttachment: 'fixed'`

```tsx
// GridGlowLayers.tsx
<div style={{
  position: 'absolute', inset: 0,
  backgroundImage: `
    linear-gradient(rgba(8,13,43,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8,13,43,0.022) 1px, transparent 1px)
  `,
  backgroundSize: '120px 120px',
  backgroundAttachment: 'fixed',  // ← relativo al viewport, no al elemento
}} />
```

Con `fixed`, el origen de la grilla es siempre la esquina del viewport. Todas las secciones comparten el mismo sistema de coordenadas → las líneas se alinean perfectamente entre secciones.

**Excepción**: no usar `backgroundAttachment: fixed` dentro de elementos con `transform`, `filter` o `will-change` — esos crean un nuevo stacking context y rompen el `fixed`. En esos casos, mover la grilla a un elemento raíz sin transforms.

---

## Problema 7: Efecto glow del cursor sin `position: fixed` ni repaints costosos

### Síntoma
Se quiere un glow radial que siga al cursor dentro de cada sección, iluminando la grilla de fondo. La implementación naive con `position: fixed` y `pointer-events: none` causa repaints en toda la página en cada `mousemove`.

### Solución: dos capas + `mask-image` radial en `onMouseMove`

La grilla iluminada (colored) siempre existe en el DOM, pero está oculta por una `mask-image: none`. En `mousemove` se actualiza solo la máscara — operación de compositor, sin repaint:

```tsx
// GridGlowLayers.tsx — tres capas:
// 1. Grilla base (siempre visible, dim)
// 2. Glow de fondo (radial gradient suave, actualizado en mousemove)
// 3. Grilla coloreada (igual que la base pero más azul, revelada por máscara)

<div ref={glowRef} style={{ position: 'absolute', inset: 0 }} />        // capa 2
<div ref={gridGlowRef} style={{ position: 'absolute', inset: 0,
  maskImage: 'none' }} />                                                 // capa 3
```

```ts
// useGridGlow.ts
const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
  const rect = sectionRef.current!.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // Glow suave de fondo
  glowRef.current!.style.background =
    `radial-gradient(circle 400px at ${x}px ${y}px, rgba(0,87,255,0.012), transparent 75%)`

  // Máscara que revela la grilla coloreada solo cerca del cursor
  const mask = `radial-gradient(circle 400px at ${x}px ${y}px, black 0%, black 30%, transparent 70%)`
  gridGlowRef.current!.style.maskImage = mask
  gridGlowRef.current!.style.setProperty('-webkit-mask-image', mask)
}
```

**Por qué funciona sin jank**: `mask-image` y `background` en capas absolutas con `pointer-events: none` son operaciones de compositor — el browser las delega a la GPU sin recalcular el layout ni repintar otros elementos.

**El glow se "congela" al salir**: al no limpiar el valor en `mouseleave`, el glow queda en la última posición conocida. Este efecto es intencional — da sensación de que la luz dejó una marca física.

---

## Problema 8: Barra de progreso con `scaleX` vs `width`

### Síntoma
La barra de progreso de las secciones pinned se implementa cambiando `width` en cada frame del scroll (`onUpdate`). Esto causa layout reflow en cada frame (60fps × duración del pin = miles de reflows).

### Solución: `transform: scaleX()` con `transformOrigin: 'left center'`

```tsx
// Estructura fija — el elemento siempre tiene width: 100%
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)' }}>
  <div ref={progressRef} style={{
    height: '100%',
    background: '#60A0FF',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',        // estado inicial
  }} />
</div>

// En onUpdate: una sola propiedad de transform → compositor, cero reflow
progressRef.current!.style.transform = `scaleX(${self.progress})`
```

`width: 0 → 100%` recalcula layout en cada frame. `scaleX(0 → 1)` es una transformación de compositor — la GPU escala el elemento sin que el browser recalcule nada.

---

## Problema 9: Scroll horizontal pinned (ProcessV2) — cálculo dinámico del end

### Síntoma
La sección de scroll horizontal (`pin: true`, `scrub`) con 5 cards termina antes o después del último card, dependiendo del ancho de ventana.

### Causa
Si se hardcodea el `end` (ej. `end: '+=2000'`), el valor no responde a cambios de viewport. Al redimensionar la ventana, las cards se cortan o sobran.

### Solución: funciones `() => ...` en `x` y `end` + `invalidateOnRefresh: true`

```ts
gsap.to(trackRef.current, {
  // x: función evaluada en cada refresh — siempre el ancho real
  x: () => -(track.scrollWidth - section.offsetWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    pin: true,
    scrub: 1.4,
    start: 'top top',
    // end: función — distancia de scroll = ancho que hay que recorrer
    end: () => `+=${track.scrollWidth - section.offsetWidth}`,
    invalidateOnRefresh: true,  // re-evalúa las funciones en cada resize
  },
})
```

`invalidateOnRefresh: true` le dice a ScrollTrigger que re-ejecute las funciones `() => ...` cuando el viewport cambia. Sin esto, los valores se calculan una sola vez al montar.

---

## Problema 10: Columnas de scroll infinito vertical (Hero)

Similar al marquee horizontal (Problema 2), pero vertical. La solución difiere porque el contenido scroll infinito vertical puede ser más corto.

### Solución: 2 copias + `-50%` en keyframe vertical

```css
@keyframes heroScrollUp {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}
@keyframes heroScrollDown {
  from { transform: translateY(-50%); }
  to   { transform: translateY(0); }
}
```

```tsx
function InfiniteColumn({ items, dir }: { items: Item[]; dir: 'up' | 'down' }) {
  const doubled = [...items, ...items]  // 2 copias → keyframe a -50%

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Fade superior e inferior con gradient sobre el color de fondo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '48px',
        background: `linear-gradient(to bottom, ${bg}, transparent)`, zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
        background: `linear-gradient(to top, ${bg}, transparent)`, zIndex: 2 }} />

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '7px',
        animation: `${dir === 'up' ? 'heroScrollUp' : 'heroScrollDown'} 28s linear infinite`,
      }}>
        {doubled.map((item, i) => <Card key={i} item={item} />)}
      </div>
    </div>
  )
}
```

**2 copias con `-50%`** (en lugar de 4 con `-25%`) funciona para columnas verticales porque su altura total ya es suficiente para ocultar el loop. El fade con `linear-gradient` sobre el color exacto del fondo es crítico — si el color no coincide exactamente, el fade se ve como un borde duro.

---

## Problema 11: Timeline scrubbed con GSAP pin — múltiples bugs en un solo componente

Componente de referencia: `components/v2/BlockchainV2.tsx`.  
Un timeline vertical de 4 pasos, donde cada paso se activa al hacer scroll dentro de una sección pinned (`pin: true`, `scrub`). Los bugs son clásicos de este patrón y volverán en cualquier proyecto similar.

---

### Bug 11a: Saltos al cambiar de paso ("jumping")

#### Síntoma
Al hacer scroll dentro del pin, al cruzar el umbral entre pasos la sección entera salta unos píxeles. Con `useState` el salto es severo; incluso con DOM refs el salto persiste si se usan transiciones CSS en propiedades de layout.

#### Causa
Dos fuentes, en orden de gravedad:

1. **`useState` en un componente con GSAP pin** — cada cambio de estado dispara un re-render de React. React modifica el DOM, GSAP detecta el cambio de geometría y recalcula el pin spacer → salto.

2. **Transición CSS en `maxHeight` o `height`** — aunque no haya `useState`, animar `maxHeight: 0 → 260px` con `transition: max-height 0.65s` genera reflow en cada frame de la transición (650ms × 60fps = ~39 recálculos de layout). Si `onUpdate` del ScrollTrigger dispara en esos mismos frames, GSAP y el browser se pisan → salto.

#### Solución

**Regla 1 — Nunca usar `useState` para manejar el paso activo en un componente con GSAP pin.** Toda la lógica de activación va directo al DOM vía refs:

```ts
const dotRefs     = useRef<(HTMLDivElement | null)[]>([])
const titleRefs   = useRef<(HTMLHeadingElement | null)[]>([])
const contentRefs = useRef<(HTMLDivElement | null)[]>([])

function activateStep(s: number) {
  STEPS.forEach((_, i) => {
    const isActive = i === s
    // cambios directos al DOM, sin setState
    dotRefs.current[i]!.style.background = isActive ? '#60A0FF' : 'transparent'
    titleRefs.current[i]!.style.fontSize = isActive ? '26px' : '16px'
    contentRefs.current[i]!.style.height  = isActive ? 'auto' : '0'
    contentRefs.current[i]!.style.opacity = isActive ? '1' : '0'
  })
}
```

**Regla 2 — El cambio de `height`/`maxHeight` debe ser instantáneo, sin CSS transition.** La transición suave va solo en `opacity` (operación de compositor, sin reflow):

```tsx
// ✅ Correcto
<div style={{
  overflow:   'hidden',
  height:     isFirst ? 'auto' : '0',   // instant — sin transition en height
  opacity:    isFirst ? 1 : 0,
  transition: 'opacity 0.65s cubic-bezier(0.33,1,0.68,1)',  // solo opacity
}} />

// ❌ Incorrecto — 650ms de reflow continuo
<div style={{
  overflow:    'hidden',
  maxHeight:   isFirst ? '260px' : '0',
  transition:  'max-height 0.65s ease',  // ← reflow en cada frame
}} />
```

---

### Bug 11b: Al hacer click en un punto no adyacente, los pasos intermedios se expanden brevemente

#### Síntoma
Click en "Descentralizada" estando en "Segura" → los pasos "Transparente" e "Inmutable" se expanden y se contraen visiblemente mientras el scroll viaja hacia el destino.

#### Causa raíz (doble)

**Causa 1 — `onUpdate` cruza umbrales intermedios durante el scroll programático.**
`onUpdate` se dispara en cada frame de Lenis. Mientras el scroll viaja de paso 0 a paso 3, cruza los umbrales de los pasos 1 y 2, que `activateStep` activa momentáneamente.

**Causa 2 — el desbloqueo del `skipRef` dentro de `onUpdate` falla en scroll hacia atrás.**
Una primera implementación liberaba el lock cuando `newStep >= targetStepRef.current`. Esto falla para navegación inversa (ej. paso 3 → paso 0): el `newStep` inicial ya es 3, que cumple `3 >= 0` inmediatamente, y `skipRef` se libera en el primer frame, permitiendo que `activateStep` se ejecute durante todo el scroll descendente.

#### Solución — `skipRef` liberado solo en `onComplete` de Lenis

El lock debe durar exactamente lo que dura el scroll, no liberarse cuando se cruza un umbral. Lenis soporta un callback `onComplete` en `scrollTo`:

```ts
const skipRef       = useRef(false)
const targetStepRef = useRef<number | null>(null)

function handleDotClick(idx: number) {
  activateStep(idx)  // estado visual correcto inmediatamente (con transiciones)

  skipRef.current       = true
  targetStepRef.current = idx

  const unlock   = () => { skipRef.current = false; targetStepRef.current = null }
  const fallback = setTimeout(unlock, 2000)  // safety net si onComplete no dispara

  lenis.scrollTo(target, {
    duration: 0.75,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    onComplete: () => { clearTimeout(fallback); unlock() },  // liberar SOLO al terminar
  })
}

// En onUpdate — sin lógica de desbloqueo intermedio:
onUpdate(self) {
  // Líneas siempre actualizan (fuera del bloqueo)
  for (let i = 0; i < STEPS.length - 1; i++) {
    const fill = Math.max(0, Math.min(1, self.progress * STEPS.length - i))
    lineFillRefs.current[i]!.style.transform = `scaleY(${fill})`
  }
  if (skipRef.current) return  // bloqueo simple — sin condiciones de desbloqueo aquí
  const newStep = Math.min(Math.floor(self.progress * STEPS.length), STEPS.length - 1)
  activateStep(newStep)
}
```

**Por qué `onComplete` y no `setTimeout`**: `setTimeout(fn, 1500)` libera el lock después de un tiempo fijo, independientemente de si el scroll terminó. Si el scroll tarda menos, hay una ventana donde `onUpdate` puede activar el paso incorrecto. Si tarda más, el lock se libera antes de tiempo. `onComplete` es exacto: dispara cuando Lenis confirma que llegó al destino.

**Por qué el `fallback` de 2000ms sigue siendo necesario**: si `(window as any).__lenis` no está disponible y se usa `window.scrollTo`, no hay `onComplete`. El timeout asegura que el lock se libere siempre.

---

### Bug 11d: Al hacer click en un punto, no se ven las transiciones de cambio de paso

#### Síntoma
Al hacer click en cualquier punto del timeline, el estado cambia instantáneamente: el dot ya está en su tamaño final, el título ya tiene el tamaño correcto, y el contenido aparece sin fade. No hay animación de transición.

#### Causa
El `handleDotClick` original desactivaba las CSS transitions antes de llamar `activateStep`, y las re-habilitaba dos frames después con `requestAnimationFrame(() => requestAnimationFrame(...))`. Resultado: el estado visual cambia mientras `transition: 'none'` está activo, y cuando las transiciones se re-habilitan no hay nada que animar (el DOM ya está en el estado final).

El patrón "deshabilitar → cambiar → re-habilitar" surgió para evitar que las transiciones causaran reflow durante el scroll pinned. Pero con el fix del Bug 11b (skipRef + onComplete), `onUpdate` queda bloqueado durante el click, haciendo innecesario ese patrón.

#### Solución — dejar las transiciones activas y llamar `activateStep` directamente

```ts
function handleDotClick(idx: number) {
  // Las transiciones CSS ya están definidas en los elementos (en el JSX).
  // Llamar activateStep con ellas activas → dot crece, título expande, contenido fadea.
  activateStep(idx)

  // Líneas: snap instantáneo (sin transición en scaleY)
  for (let i = 0; i < STEPS.length - 1; i++) {
    const fill = Math.max(0, Math.min(1, idx - i))
    lineFillRefs.current[i]!.style.transform = `scaleY(${fill})`
  }

  // Lock + scroll programático
  skipRef.current = true
  const unlock   = () => { skipRef.current = false }
  const fallback = setTimeout(unlock, 2000)
  lenis.scrollTo(target, { duration: 0.75, onComplete: () => { clearTimeout(fallback); unlock() } })
}
```

**¿Por qué esto no causa jumping ahora?** Las transiciones de `opacity` y `font-size` en los steps no causan reflow durante el scroll porque `skipRef` bloquea `onUpdate` mientras la animación está en progreso. El pin de GSAP no recibe señales de cambio de geometría mientras `activateStep` no es llamado desde `onUpdate`.

---

### Bug 11c: La sección se desplaza verticalmente al llegar al último paso

#### Síntoma
Al activar "Descentralizada" (el último paso), toda la sección sube 2–4 píxeles. Sutil pero muy visible en un sitio premium.

#### Causa
La sección usa `display: flex; align-items: center` (o `position: absolute; top: 50%; transform: translateY(-50%)`). Cuando el contenido del último paso aparece y el timeline crece, **el método de centrado recalcula y reposiciona el grid**:

- Con `align-items: center`: flex redistribuye el espacio libre → el grid sube.
- Con `translateY(-50%)`: el `-50%` se refiere al alto **propio** del elemento. Si el elemento crece, la compensación cambia → el grid sube.

#### Solución — `paddingTop` fijo en la sección

Reemplazar cualquier centrado dinámico por un `paddingTop` calculado de forma fija. El `paddingTop` no depende del alto del contenido: es un valor constante derivado del alto del viewport.

```tsx
<section style={{
  position:   'relative',
  height:     '100vh',
  overflow:   'hidden',
  /* paddingTop fijo: aproxima el centro visual para cualquier viewport
     sin reaccionar a cambios de altura del contenido interno */
  paddingTop: 'clamp(80px, calc(50vh - 230px), 360px)',
}}>
  <div style={{
    /* grid en flujo normal — sin position absolute, sin transform */
    maxWidth: '1280px',
    margin:   '0 auto',
    display:  'grid',
    ...
  }}>
```

El valor `calc(50vh - 230px)` centra un grid de ~460px de alto para viewports típicos (1080px → 310px top, 768px → 154px top). El `overflow: hidden` de la sección absorbe cualquier contenido que sobresalga por abajo.

**Por qué NO usar `translateY(-50%)` aquí:**
```
position: absolute; top: 50%; transform: translateY(-50%)
```
`translateY(-50%)` = 50% del alto **propio** del elemento, no del padre. Cuando el elemento crece, `-50%` se vuelve un número mayor en píxeles → el elemento sube. Es un anti-patrón para contenido de altura variable.

---

### Patrón: barra de progreso dentro de cada línea del timeline

Para que las líneas conectoras entre puntos actúen como barras de progreso continuas (se llenan a medida que scrolleas dentro de cada paso):

```tsx
{/* Línea: track fijo + fill interior */}
<div style={{
  flex: '1', width: '1.5px', minHeight: '48px',
  background: 'rgba(255,255,255,0.10)',  // track siempre visible
  position: 'relative', overflow: 'hidden',
}}>
  <div
    ref={el => { lineFillRefs.current[i] = el }}
    style={{
      position: 'absolute', inset: 0,
      background: '#60A0FF',
      transformOrigin: 'top center',
      transform: 'scaleY(0)',   // estado inicial
    }}
  />
</div>
```

En `onUpdate`, calcular el fill de cada línea continuamente — fuera del bloque `skipRef` para que la barra se actualice incluso durante scrolls programáticos:

```ts
onUpdate(self) {
  // Líneas: siempre actualizar (no bloqueado por skipRef)
  for (let i = 0; i < STEPS.length - 1; i++) {
    // fill(i) = cuánto progresé dentro del paso i
    const fill = Math.max(0, Math.min(1, self.progress * STEPS.length - i))
    lineFillRefs.current[i]!.style.transform = `scaleY(${fill})`
  }
  // Resto del onUpdate...
}
```

La fórmula `progress × N - i` (clamped a 0–1) da exactamente el progreso dentro del segmento `i`:
- Línea 0 se llena mientras `progress` va de 0 → 0.25
- Línea 1 se llena mientras `progress` va de 0.25 → 0.5
- etc.

En el click handler, actualizar las líneas inmediatamente al saltar:
```ts
for (let i = 0; i < STEPS.length - 1; i++) {
  const fill = Math.max(0, Math.min(1, idx - i))  // 1 si ya pasó, 0 si es futuro
  lineFillRefs.current[i]!.style.transform = `scaleY(${fill})`
}
```

---

### Bug 11e: Línea blanca horizontal en el borde inferior de la sección al hacer scroll rápido

#### Síntoma
Al navegar rápido hacia la sección blockchain (o cualquier sección dark con `pin: true`), aparece por un instante una línea o franja blanca/crema en el borde inferior de la sección. El efecto es más pronunciado cuanto más rápido sea el scroll.

#### Causa (doble)

**Causa A — frame sin pin durante scroll rápido.**
GSAP activa el pin (`position: fixed`) en respuesta a eventos de scroll. Con Lenis smooth scroll, el scroll virtual puede avanzar más rápido que el ciclo de actualización de ScrollTrigger. En ese frame de retraso, la sección aún no está fijada y el viewport muestra brevemente lo que hay detrás de ella (el fondo del body o del pin spacer).

**Causa B — el `.gsap-pin-spacer` hereda el fondo del body.**
Cuando GSAP crea el pin, envuelve la sección en `<div class="gsap-pin-spacer">`. Este div no tiene `background` definido, por lo que hereda el del body. En este proyecto el body es `#F8F8F4` (cream). Si el spacer se hace visible en cualquier momento (frame de retraso, sub-pixel gap), aparece como una línea crema/blanca sobre el fondo dark de la sección.

#### Solución — dos capas de protección

**1. `anticipatePin: 1` en el ScrollTrigger** (resuelve Causa A):

```ts
gsap.to({}, {
  scrollTrigger: {
    trigger: sectionRef.current,
    pin:           true,
    anticipatePin: 1,        // ← GSAP empieza a preparar el pin antes de que llegue el scroll
    start: 'top top',
    end:   () => `+=${window.innerHeight * PIN_MULT}`,
    invalidateOnRefresh: true,
    ...
  },
})
```

`anticipatePin: 1` hace que ScrollTrigger calcule y active el pin ligeramente antes de que el scroll llegue al trigger point. Elimina el frame donde la sección no está fijada durante scroll rápido.

**2. CSS con `:has()` sobre el pin spacer** (resuelve Causa B):

```css
/* globals.css — asignar background a los spacers de secciones dark */
.gsap-pin-spacer:has(#blockchain) { background: #080D2B; }
.gsap-pin-spacer:has(#proceso)    { background: #080D2B; }
```

Esto garantiza que el spacer tenga el color correcto independientemente de cualquier timing de JS. El selector `:has()` es soportado en Chrome 105+, Firefox 121+, Safari 15.4+.

**Por qué no basta solo con `onRefresh` para el spacer**: `onRefresh` sí puede asignar el background correctamente en la mayoría de los casos, pero hay una ventana breve entre que GSAP crea el spacer y que `onRefresh` dispara donde el spacer podría ser visible. CSS no tiene esa ventana — aplica antes del primer paint.

**Regla general**: toda sección con `pin: true` y fondo diferente al del body debe tener su pin spacer coloreado vía CSS (`:has()`) Y usar `anticipatePin: 1`. Aplicar ambas a secciones dark (`#proceso`, `#blockchain`) si el body es light, y viceversa.

---

## Patrón: Reveal de texto con clip + blur (efecto "cortina que sube")

Usado en `FooterV2` para el H2 principal. Efecto: cada línea sube desde debajo mientras se desvela — como una cortina que se levanta.

### Estructura: `overflow: hidden` por línea + `span` interior desplazado

```tsx
const LINES = [
  { text: 'Construyamos',          color: '#080D2B' },
  { text: 'confianza verificable', color: '#0057FF' },
  { text: 'juntos.',               color: '#080D2B' },
]

<h2>
  {LINES.map(({ text, color }, i) => (
    <div key={i} style={{
      overflow: 'hidden',
      lineHeight: 1.04,
      paddingBottom: '0.12em',   // espacio para descenders
      marginBottom: '-0.12em',   // compensa el padding para que no afecte el layout
    }}>
      <span
        className="footer-cta-line"
        style={{ display: 'block', color, transform: 'translateY(108%)', opacity: 0 }}
      >
        {text}
      </span>
    </div>
  ))}
</h2>
```

### Animación con GSAP

```ts
gsap.fromTo('.footer-cta-line',
  { y: '108%', opacity: 0, filter: 'blur(12px)' },
  {
    y: '0%', opacity: 1, filter: 'blur(0px)',
    duration: 1.25, ease: 'expo.out', stagger: 0.10,
    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
  }
)
```

**Por qué `108%` y no `100%`**: el 100% lleva el span exactamente al borde del clip. Con `108%` queda completamente oculto — útil si la fuente tiene descenders que sobresalen del bounding box.

**Por qué `filter: blur(12px)`**: añadir blur al estado inicial hace el reveal más dramático — el texto emerge nítido desde la niebla. En fuentes grandes (`clamp(48px, 7vw, 100px)`) el efecto es muy notorio.

**Por qué `paddingBottom + marginBottom`**: sin padding, los descenders de la línea siguiente (`j`, `g`, `p`) se cortan con el `overflow: hidden`. Sin el `marginBottom` compensatorio, el `paddingBottom` agregaría espacio extra entre líneas.

---

## Patrón: Texto scramble / decode (efecto terminal)

Usado en `FooterV2` para el subtítulo. El texto empieza como caracteres aleatorios y se "decodifica" letra por letra hacia el texto real — evoca una terminal desencriptando un mensaje.

```ts
const SUBTITLE = 'Empresas, fundaciones e instituciones...'
const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#@&%'

function runScramble(el: HTMLElement) {
  let step = 0
  const totalSteps = 44   // controla la velocidad total del decode

  el.textContent = ''
  const timerId = setInterval(() => {
    el.textContent = SUBTITLE.split('').map((ch, i) => {
      if (ch === ' ' || ch === '—') return ch   // preservar espacios/dashes
      if (i < (step / totalSteps) * SUBTITLE.length) return SUBTITLE[i]   // ya decodificado
      return CHARS[Math.floor(Math.random() * CHARS.length)]               // aún aleatorio
    }).join('')

    step++
    if (step > totalSteps) {
      clearInterval(timerId)
      el.textContent = SUBTITLE   // limpiar al texto final exacto
    }
  }, 42)   // 42ms por step × 44 steps = ~1.8s total
}
```

**Disparar con `IntersectionObserver`** (no con ScrollTrigger — el scramble es one-shot, no tiene que sincronizarse con el scroll):

```ts
useEffect(() => {
  const el  = subtitleRef.current
  const sec = sectionRef.current
  if (!el || !sec) return
  let started = false

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !started) {
      started = true
      setTimeout(run, 720)   // delay tras el reveal del H2
    }
  }, { threshold: 0.1 })

  observer.observe(sec)
  return () => { observer.disconnect(); clearInterval(timerId) }
}, [])
```

**Puntos clave:**
- `started = true` evita que el scramble se repita si la sección sale y vuelve a entrar al viewport.
- El `setTimeout(run, 720)` sincroniza el decode con el final de la animación del H2 — si empieza simultáneamente, compiten visualmente.
- `ch === ' ' || ch === '—'` — preservar espacios es crítico. Si se reemplazan con `CHARS`, el layout del texto cambia en cada frame (el texto "baila" lateralmente).
- `totalSteps` controla velocidad: más steps = decode más lento y suave; menos = más rápido y dramático. `42ms × 44` = 1.85s es un buen balance para frases de ~60 caracteres.
- El `minHeight: '2em'` en el elemento evita que la sección salte al aparecer el texto.

---

---

## Problema 12: Hydration mismatch en componentes con estado dependiente del tiempo

### Síntoma
Un componente que muestra tiempo real (cuenta regresiva, reloj, fecha calculada) lanza un error de hydration en Next.js App Router:

```
Error: Hydration failed because the server rendered HTML didn't match the client.
```

O bien no hay error explícito, pero el componente parpadea al cargarse porque el valor SSR y el valor cliente no coinciden.

### Causa
Next.js renderiza el componente en el servidor para generar el HTML inicial. El servidor no tiene acceso a `Date.now()` en el mismo instante que el cliente, así que los valores de tiempo divergen inevitablemente entre el HTML del servidor y el primer render del cliente.

### Solución: estado inicial `null` en SSR, valor real solo en `useEffect`

```tsx
'use client'
import { useState, useEffect } from 'react'

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  // null en SSR → el servidor renderiza vacío → sin mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    // Solo corre en el cliente, después de la hydration
    const update = () => setTimeLeft(calcTimeLeft(targetDate))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  // Durante SSR (y primer frame cliente) no renderizar nada
  if (!timeLeft) return null

  return (
    <div>
      <span>{timeLeft.days}d</span>
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  )
}
```

**Por qué funciona**: el servidor renderiza `null` (HTML vacío). El cliente hidrata sobre HTML vacío → sin conflicto. `useEffect` corre solo en el cliente, asigna el valor real y React actualiza el DOM limpiamente.

**Variación — mostrar skeleton en SSR** para evitar el "salto" de altura cuando el componente aparece:

```tsx
if (!timeLeft) return <div className="countdown-skeleton" aria-hidden="true" />
```

Con un skeleton que tenga las mismas dimensiones que el timer real, el layout no cambia al montar el componente.

**Regla general**: cualquier valor que dependa de `Date`, `Math.random()`, `window`, `navigator` o `localStorage` debe inicializarse con `null` y asignarse en `useEffect`.

---

## Problema 13: Cursor custom visible en dispositivos táctiles

### Síntoma
El cursor personalizado (dot que sigue al mouse) aparece en tablets y móviles, flotando en la esquina superior izquierda (posición `0,0`) o moviéndose de forma errática con los eventos de touch. En iOS el elemento queda visible incluso sin que nadie toque la pantalla.

### Causa
El cursor custom escucha `mousemove` para posicionarse. En dispositivos táctiles, los eventos de mouse pueden dispararse de forma sintética e impredecible. Además, el cursor DOM siempre existe en el HTML independientemente del tipo de dispositivo.

### Solución: detectar `pointer: fine` antes de montar el componente

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  // false en SSR — undefined se evita usando false directamente
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Solo activar en dispositivos con puntero preciso (mouse/trackpad)
    // pointer: coarse = táctil; pointer: fine = mouse
    if (!window.matchMedia('(pointer: fine)').matches) return

    setActive(true)

    const handleMove = (e: MouseEvent) => {
      if (!dotRef.current) return
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    return () => document.removeEventListener('mousemove', handleMove)
  }, [])

  if (!active) return null  // no renderizar nada en táctil

  return (
    <div
      ref={dotRef}
      className="custom-cursor__dot"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}
```

Y en `globals.css`, ocultar el cursor nativo solo cuando el cursor custom esté activo:

```css
/* Solo ocultar el cursor nativo en dispositivos con puntero fino */
@media (pointer: fine) {
  body { cursor: none; }
  a, button, [role="button"] { cursor: none; }
}
```

**Por qué `matchMedia` y no `navigator.maxTouchPoints`**: `maxTouchPoints > 0` es positivo en laptops con pantalla táctil que también tienen trackpad — en esos casos sí se quiere el cursor custom. `pointer: fine` es más preciso: es `true` si el dispositivo primario de puntero es preciso (mouse/trackpad), independientemente de si también tiene touch.

---

## Problema 14: `line-height: 1` recorta letras en fuentes display

### Síntoma
En un marquee o heading con `lineHeight: 1` (o `leading-none` en Tailwind), las letras con descenders (`g`, `j`, `p`, `y`) y los trazos inferiores de la fuente se recortan visualmente. En Space Grotesk y muchas fuentes display, incluso letras como `S` o `B` pueden perder píxeles en el borde inferior.

El síntoma se amplifica cuando el elemento padre tiene `overflow: hidden` (como el wrapper de un marquee), porque el clip es literal.

### Causa
`line-height: 1` hace que el line-box tenga exactamente la altura del `font-size`. Pero las fuentes display están diseñadas con un box de métricas que sobresale del `em-square` — los descenders y el ink overflow quedan fuera del line-box y son recortados por `overflow: hidden`.

### Solución: `lineHeight: 1.1` mínimo, `paddingBottom` para descenders

```tsx
// ❌ Texto recortado
<h2 style={{ lineHeight: 1, overflow: 'hidden' }}>
  Sectores afectados
</h2>

// ✅ Sin recorte
<h2 style={{ lineHeight: 1.1 }}>
  Sectores afectados
</h2>
```

Cuando el padre tiene `overflow: hidden` y no se puede cambiar (ej. el wrapper del marquee), añadir padding compensatorio en el elemento de texto:

```tsx
<h2 style={{
  lineHeight: 1.05,
  paddingBottom: '0.12em',   // espacio para descenders
  marginBottom: '-0.12em',   // compensa el padding para no alterar el layout
}}>
```

**Regla práctica**: `line-height: 1` solo es seguro en fuentes con métricas muy conservadoras (ej. fuentes sans-serif diseñadas para UI como Inter en caps). Para fuentes display (Space Grotesk, Archivo, etc.), usar mínimo `1.08`–`1.12`.

---

## Problema 15: `overflow-hidden` en `<section>` padre recorta el título del marquee

### Síntoma
Al añadir `overflow-hidden` en el `<section>` que contiene el marquee (para que las filas animadas no sobresalgan lateralmente), el título `<h2>` que está encima del marquee se recorta verticalmente — sus letras con ascenders (`h`, `l`, `d`) o el propio ink overflow de la fuente quedan cortados.

### Causa
`overflow: hidden` en el `<section>` establece un nuevo contexto de formato que recorta **todo** el contenido visual que sobresale, incluido el ink overflow del `<h2>`. Si el `<h2>` tiene `lineHeight` ajustado o la fuente tiene un cap-height alto, el recorte es inmediato.

### Solución: mover `overflow-hidden` al div que contiene las filas del marquee, no al `<section>`

```tsx
// ❌ Recorta el h2
<section className="overflow-hidden">
  <h2>Sectores afectados</h2>
  <div>  {/* filas del marquee */}
    <MarqueeRow ... />
    <MarqueeRow ... />
  </div>
</section>

// ✅ El h2 respira; las filas del marquee se recortan localmente
<section>
  <h2>Sectores afectados</h2>
  <div className="overflow-hidden">  {/* ← overflow-hidden solo aquí */}
    <MarqueeRow ... />
    <MarqueeRow ... />
  </div>
</section>
```

El `overflow-hidden` en el div interior basta para contener la animación del marquee. El `<section>` sin overflow permite que el `<h2>` y otros elementos del bloque respiren.

---

## Problema 16: Next.js 16 — `params` es una Promise (breaking change)

### Síntoma
En páginas y layouts del App Router con rutas dinámicas (ej. `/[slug]/page.tsx`), TypeScript lanza un error:

```
Type 'Promise<{ slug: string }>' has no property 'slug'.
```

O en runtime: la página se renderiza sin el parámetro de ruta (slug es `undefined`).

### Causa
Next.js 16 cambió `params` (y `searchParams`) de un objeto síncrono a una **Promise**. En versiones anteriores era `params: { slug: string }`. En v16 es `params: Promise<{ slug: string }>`.

### Solución: `await params` en la función de la página

```tsx
// ❌ Next.js 15 y anteriores — NO funciona en v16
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params  // undefined en v16
  ...
}

// ✅ Next.js 16 — await es obligatorio
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // correcto
  ...
}
```

**Para `searchParams` (query string) aplica lo mismo:**

```tsx
// ✅ Correcto en v16
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  ...
}
```

**En layouts** (que reciben `params` pero no `searchParams`):

```tsx
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  ...
}
```

---

## Problema 17: Tailwind CSS v4 — setup completamente diferente a v3

### Síntoma
Al instalar `tailwindcss@^4` en un proyecto nuevo y seguir la documentación de Tailwind v3 (o del generador de proyectos de Next.js), las clases no funcionan, los colores custom no se aplican, o el build falla con errores de configuración.

### Causa
Tailwind v4 eliminó `tailwind.config.ts` como método principal de configuración y cambió el sistema de imports. Cualquier tutorial o snippet de Tailwind v3 es incompatible.

### Diferencias clave v3 → v4

**Imports en CSS:**
```css
/* ❌ v3 — NO funciona en v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ v4 */
@import 'tailwindcss';
```

**Colores y tokens custom:**
```css
/* ❌ v3 — tailwind.config.ts */
// tailwind.config.ts
module.exports = { theme: { extend: { colors: { accent: '#ff1b00' } } } }

/* ✅ v4 — @theme en globals.css, sin archivo de config */
@import 'tailwindcss';

@theme {
  --color-accent: #ff1b00;       /* → clase bg-accent, text-accent */
  --color-surface: #d0cec9;      /* → clase bg-surface */
  --font-display: 'Space Grotesk', sans-serif;  /* → clase font-display */
  --ease-snap-out: cubic-bezier(0.2, 0.88, 0.12, 1);
}
```

**Uso de tokens en JSX:**
```tsx
// ✅ Los tokens de @theme se usan como clases de Tailwind normales
<div className="bg-surface text-accent font-display">
```

**Gradientes con colores custom** — en v4 se usa la variable CSS directamente:
```tsx
// ✅ v4 — referenciar la variable CSS del token
<div className="bg-gradient-to-r from-[var(--color-accent)] to-transparent">
```

**No existe `tailwind.config.ts` para colores en v4.** Si el proyecto lo tiene por defecto (generado con `create-next-app`), se puede dejar para plugins de terceros, pero los colores custom van en `@theme`.

---

---

## Problema 18: CSS custom properties para efectos dinámicos en `mousemove`

### Síntoma
Un efecto spotlight (gradiente radial que sigue al cursor) se implementa actualizando `element.style.background` en cada evento `mousemove`. La cadena del gradiente es larga y se reescribe completa ~60 veces por segundo, lo que en perfiles de DevTools aparece como trabajo de pintura innecesario.

### Causa
`style.background = 'radial-gradient(circle at 47% 32%, ...)'` reescribe la propiedad CSS entera en cada frame. El navegador debe parsear la cadena, calcular el gradiente y compositar.

### Solución: actualizar solo variables CSS, referenciarlas en el estilo base

El gradiente se define **una sola vez** en el markup usando `var()`. En `mousemove` solo se actualizan las variables, no el gradiente entero:

```tsx
// Markup — el gradiente existe desde el render inicial
<div
  ref={spotRef}
  style={{
    background: 'radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), rgba(255,27,0,0.14) 0%, transparent 60%)',
    opacity: 0,
  } as React.CSSProperties}
/>
```

```tsx
// mousemove — solo actualizar las variables, O(1) por frame
const onMove = (e: React.MouseEvent<HTMLElement>) => {
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  spotRef.current!.style.setProperty('--sx', `${(x / rect.width)  * 100}%`)
  spotRef.current!.style.setProperty('--sy', `${(y / rect.height) * 100}%`)
  spotRef.current!.style.opacity = '1'
}
```

**Por qué funciona**: `setProperty` actualiza una variable CSS en el elemento — operación de compositor, sin reparsear el gradiente. El navegador ya sabe cómo renderizar ese `radial-gradient`; solo cambia los valores de posición.

**El `as React.CSSProperties`** es necesario porque TypeScript no reconoce variables CSS custom (`--sx`) en el tipo `CSSProperties`. El cast silencia el error sin perder type-checking en el resto del objeto.

**Los valores por defecto `var(--sx, 50%)`** garantizan que el gradiente esté centrado antes del primer `mousemove` — útil si el elemento se renderiza en viewport sin que el usuario haya movido el mouse todavía.

---

## Problema 19: GSAP anima el mismo elemento desde múltiples fuentes simultáneamente

### Síntoma
Un navbar "smart" esconde/muestra el header con GSAP al hacer scroll. Si el usuario hace scroll rápido, dispara múltiples llamadas a `gsap.to(header, { y: '-110%' })` antes de que termine la animación anterior. El header vibra o salta porque múltiples tweens intentan controlar `y` simultáneamente.

### Causa
Por defecto GSAP apila tweens sobre el mismo elemento. Si llamas `gsap.to(el, { opacity: 1 })` y 100ms después `gsap.to(el, { opacity: 0 })`, ambos tweens corren en paralelo y el resultado es indeterminado.

### Solución: `overwrite: 'auto'`

```ts
const updateBg = (y: number) =>
  gsap.to(bgRef.current, {
    opacity: y > 20 ? 1 : 0,
    duration: 0.35,
    ease: 'none',
    overwrite: 'auto',  // ← mata solo los tweens que compiten por 'opacity'
  })
```

`overwrite: 'auto'` analiza qué propiedades va a animar el nuevo tween y cancela solo esas propiedades en tweens anteriores — no los mata completos. Así si un tween animaba `opacity` y `y` simultáneamente, y el nuevo solo anima `opacity`, el `y` del anterior sigue corriendo.

**Alternativas y cuándo usarlas:**
- `overwrite: true` — mata todos los tweens anteriores sobre el elemento, sin importar qué propiedades animen. Más agresivo, útil cuando el tween nuevo "lo sabe todo".
- `overwrite: false` (default) — no cancela nada. Los tweens se apilan. Solo válido cuando sabes que no hay conflicto.
- `overwrite: 'auto'` — la opción correcta para la mayoría de manejadores de eventos (scroll, mousemove, resize) donde múltiples llamadas son esperadas.

---

## Problema 20: Estado React cambia durante una animación GSAP y causa salto visual

### Síntoma
Al cerrar un menú mobile animado con GSAP (`scaleY: 0`, items que salen), si se llama `setIsOpen(false)` al inicio de la función de cierre, React re-renderiza el componente a mitad de la animación. El DOM cambia bajo los pies de GSAP — los elementos desaparecen abruptamente o el layout salta antes de que termine la animación.

### Causa
`setIsOpen(false)` dispara un re-render de React en el siguiente frame. Si el componente renderiza condicionalmente basado en `isOpen`, el overlay puede desmontarse o cambiar estructura mientras GSAP lo está animando.

### Solución: cambiar estado en `onComplete`, no antes de la animación

```ts
const closeMenu = () => {
  const overlay = overlayRef.current
  if (!overlay) return

  // ✅ setState va en onComplete — corre DESPUÉS de que terminó la animación
  const tl = gsap.timeline({ onComplete: () => setIsOpen(false) })

  tl.to(overlay.querySelectorAll('.mob-item-inner'), {
    y: '-110%', duration: 0.2, stagger: { amount: 0.1, from: 'end' },
  }, 0)
  tl.to(overlay, { scaleY: 0, duration: 0.4, ease: 'power3.inOut' }, 0.15)
}
```

```ts
// ❌ Incorrecto — estado cambia antes de que la animación haya corrido
const closeMenu = () => {
  setIsOpen(false)  // React re-renderiza → DOM cambia → GSAP pierde referencias
  gsap.to(overlay, { scaleY: 0, duration: 0.4 })
}
```

**Variación — si el componente puede desmontarse**: cuando `isOpen: false` provoca que el overlay se elimine del DOM con un `{isOpen && <Overlay />}`, GSAP pierde el ref antes de completar la animación. La solución es mantener el elemento en el DOM siempre y controlarlo solo con transforms:

```tsx
{/* ✅ Siempre montado — GSAP lo controla con transform, no se desmonta */}
<div
  ref={overlayRef}
  style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
  aria-hidden={!isOpen}
/>
```

---

## Problema 21: GSAP stagger inverso al cerrar (items desaparecen en orden incorrecto)

### Síntoma
Al abrir un menú, los items aparecen de arriba hacia abajo (stagger normal). Al cerrar, si se usa el mismo stagger, los items desaparecen también de arriba hacia abajo — pero visualmente debería ser al revés para que el cierre se sienta "como si el primero en entrar fuera el último en salir".

### Causa
El stagger de GSAP itera el array en el orden que se le pasa. Sin especificar dirección, siempre va del primer elemento al último.

### Solución: `stagger: { amount: 0.1, from: 'end' }`

```ts
// Abrir — items de arriba hacia abajo
tl.to(items, {
  y: '0%',
  duration: 0.7,
  ease: EASE_CHAR,
  stagger: { amount: 0.3 },           // default: from: 'start'
}, 0.25)

// Cerrar — items de abajo hacia arriba
tl.to(items, {
  y: '-110%',
  duration: 0.2,
  ease: 'power2.in',
  stagger: { amount: 0.1, from: 'end' },  // ← invierte el orden
}, 0)
```

**Opciones de `from` en GSAP stagger:**
- `'start'` (default) — primer elemento al último
- `'end'` — último elemento al primero
- `'center'` — desde el centro hacia los extremos
- `'edges'` — desde los extremos hacia el centro
- `number` — índice específico como origen de la ola

**Por qué `amount` más pequeño al cerrar (0.1 vs 0.3)**: el cierre debe sentirse más rápido que la apertura. Una duración total de stagger de 100ms hace el cierre decisivo; 300ms en la apertura le da más "espectáculo".

---

## Problema 22: `document.body.style.overflow = 'auto'` genera scrollbar flash

### Síntoma
Al cerrar un menú mobile que bloqueaba el scroll del body con `overflow: hidden`, restaurar con `overflow: 'auto'` provoca un flash: el scrollbar aparece y desaparece brevemente, causando un salto horizontal de ~15px en el contenido.

### Causa
`overflow: 'auto'` fuerza el valor explícito `auto` sobre el elemento. Si el CSS original del body no tenía `overflow` definido (o usaba `overflow: visible`), la diferencia entre el estado bloqueado y el restaurado es perceptible mientras el browser recalcula si necesita scrollbar.

### Solución: string vacío `''` para restaurar al valor CSS original

```ts
useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  //                                                  ^^
  //                                        '' = quita el inline style
  //                                        el CSS de la hoja de estilos vuelve a mandar

  return () => {
    document.body.style.overflow = ''  // cleanup si el componente desmonta con menú abierto
  }
}, [isOpen])
```

`''` (string vacío) elimina la propiedad del `style` inline del elemento, devolviendo el control al CSS. Si el CSS no define `overflow` en el body, el browser usa su valor por defecto (`visible` o lo que defina el user-agent stylesheet) — exactamente lo que había antes de bloquear.

`'auto'` fuerza un valor que puede no coincidir con el estado anterior, generando el flash.

---

## Problema 23: OG image en Next.js no puede usar Google Fonts

### Síntoma
Al generar la imagen Open Graph con `opengraph-image.tsx`, la fuente del sitio (Space Grotesk, cargada via `next/font/google`) no se aplica. La imagen usa una fuente genérica fallback (serif o sans-serif del sistema).

O peor: el build falla con un error relacionado con fonts cuando se despliega en Vercel.

### Causa
`opengraph-image.tsx` usa Satori (internamente en `next/og`) para renderizar JSX como imagen PNG en el servidor. Satori no tiene acceso a Google Fonts en tiempo de build — no puede hacer requests HTTP externos durante la generación estática. El `next/font/google` que funciona para el sitio tampoco está disponible en este contexto.

### Solución: leer el archivo de fuente desde el filesystem y pasarlo a `ImageResponse`

```
// 1. Descargar el archivo .ttf y guardarlo en el proyecto
nextapp/assets/SpaceGrotesk-Bold.ttf
```

```tsx
// opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default async function Image() {
  // Lee la fuente desde el filesystem en build time
  const spaceGrotesk = await readFile(
    join(process.cwd(), 'assets/SpaceGrotesk-Bold.ttf')
  )

  return new ImageResponse(
    (
      <div style={{ fontFamily: 'Space Grotesk' }}>
        {/* JSX de la imagen */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Space Grotesk',   // debe coincidir con fontFamily del JSX
          data: spaceGrotesk,       // Buffer con el contenido del .ttf
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
```

**Puntos clave:**
- El archivo `.ttf` debe estar en `assets/` en la raíz del proyecto (`process.cwd()` apunta ahí en Vercel).
- Solo incluir los pesos que se necesitan — cada fuente cargada aumenta el tiempo de generación de la imagen.
- `name` en el objeto `fonts` debe ser exactamente igual al `fontFamily` en el JSX.
- Descargar el archivo de [Google Fonts](https://fonts.google.com/) → "Download family" → descomprimir y tomar el `.ttf` del peso deseado.

---

## Problema 24: `metadata.title.absolute` vs template en Next.js App Router

### Síntoma
En `layout.tsx` se define un `title.template: '%s | Nombre del Sitio'` para que todas las páginas sigan el formato "Título de Página | Nombre del Sitio". Pero la página de inicio debería tener un título propio y específico, no seguir el template — el resultado con el template sería algo como `" | Nuevas Reglas Chile"` (prefijo vacío) o un título muy largo si se añade.

### Causa
En Next.js App Router, cuando una página exporta `title: 'Mi título'`, ese valor se inserta en el `%s` del template del layout padre. No hay forma de "saltarse" el template usando el campo `title` normal.

### Solución: `title: { absolute: '...' }` en la página específica

```tsx
// layout.tsx — template para todas las páginas
export const metadata: Metadata = {
  title: {
    default: 'Nombre del Sitio — Descripción genérica',
    template: '%s | Nombre del Sitio',   // páginas usan esto
  },
}

// page.tsx (página de inicio) — ignora el template completamente
export const metadata: Metadata = {
  title: { absolute: 'Chile tiene nuevas reglas — Datos e Interoperabilidad 2026' },
  //       ^^^^^^^^
  //       Este título se usa tal cual, sin pasar por el template del layout
}

// /ley-proteccion-datos/page.tsx — usa el template normalmente
export const metadata: Metadata = {
  title: 'Ley 21.719: Protección de Datos Personales',
  // → resultado final: "Ley 21.719: Protección de Datos Personales | Nombre del Sitio"
}
```

**Cuándo usar `absolute`**: landing pages, homepages, páginas de error (404, 500) donde el nombre del sitio ya está incluido en el título o donde el formato del template no aplica.

**`default` vs `template` en el layout:**
- `default` — título que se usa si la página no exporta `metadata.title` en absoluto.
- `template` — formato que se aplica a títulos de páginas hijas (reemplaza `%s`).
- `absolute` en página hija — ignora ambos, usa el string tal cual.

---

## Problema 25: Botones de navegación requieren dos clics — race condition `busyRef` vs estado React

### Síntoma
En un componente con navegación por pasos animada con GSAP, los botones de avance/retroceso a veces requieren dos clics para funcionar. El primer clic aparentemente no se registra. Ocurre de forma intermitente, no siempre.

### Causa
Race condition entre dos mecanismos de bloqueo que se desincronizán:

1. **`busyRef` (ref síncrona):** se pone en `true` al iniciar la animación, se resetea en `false` síncronamente en el `onComplete` de GSAP.
2. **Estado `fading` (React state, async):** se pone en `true` al iniciar, se pone en `false` con `setFading(false)` en el mismo `onComplete`. Pero en React 18/19 con modo concurrente, las actualizaciones de estado desde callbacks no-React (como GSAP) se procesan de forma diferida — puede tardar 1–2 frames.

El resultado: cuando la animación termina, `busyRef` ya es `false` (acepta nuevos clics), pero `fading` sigue siendo `true` (los botones están `disabled={fading}`). Durante esa ventana de 1–2 frames, el usuario hace clic sobre un botón aparentemente habilitado que internamente está `disabled`. El clic cae en el vacío. El segundo clic (cuando React finalmente procesa el update) sí funciona.

### Solución — dos cambios

**1. Eliminar `fading` como guard de los botones.** Usar `busyRef` como único mecanismo de bloqueo, que es síncrono y no tiene ventanas async:

```tsx
// ❌ Race condition — fading puede estar desactualizado respecto a busyRef
<button disabled={displayed === 0 || fading} onClick={() => goTo(displayed - 1)}>←</button>

// ✅ Solo posición extrema deshabilita el botón; busyRef bloquea en goTo
<button disabled={displayed === 0} onClick={() => goTo(displayed - 1)}>←</button>
```

**2. Encolar clics durante la animación con `queueRef`.** En lugar de descartar silenciosamente los clics que llegan mientras `busyRef` es `true`, guardar el último destino y ejecutarlo automáticamente al terminar:

```ts
const busyRef  = useRef(false)
const queueRef = useRef<number | null>(null)

const goTo = (next: number) => {
  if (next < 0 || next >= steps.length) return

  if (busyRef.current) {
    queueRef.current = next   // encolar — se ejecuta al terminar la animación actual
    return
  }

  busyRef.current = true
  queueRef.current = null

  // ... exit animation ...
  gsap.to(targets, {
    ...,
    onComplete: () => {
      // ... enter animation ...
      gsap.to(targets, {
        ...,
        onComplete: () => {
          busyRef.current = false
          const queued = queueRef.current
          queueRef.current = null
          if (queued !== null) goTo(queued)   // ejecutar el clic encolado
        },
      })
    },
  })
}
```

**Por qué `queueRef` y no `queueState`**: un ref actualiza inmediata y síncronamente — si el usuario hace clic 3 veces durante la animación, `queueRef` guarda siempre el último destino deseado sin re-renders intermedios. Un estado dispararía re-renders innecesarios y podría crear otra race condition.

**Por qué guardar solo el último y no una cola FIFO**: el usuario quiere llegar al último paso que clicó, no reproducir todos los clics intermedios. Si clicó 3 → 5 → 2, quiere estar en 2, no pasar por 3, 5 y 2 secuencialmente.

**El beneficio adicional**: eliminar `setFading` del `onComplete` (ya que `fading` no se usa más) simplifica el flujo y elimina el setStateque podría causar re-renders en el momento más delicado del ciclo de animación.

### Regla general
> Nunca mezclar un guard síncrono (ref) con un guard async (React state) para controlar la habilitación de elementos interactivos. Si los dos deben coincidir, usar solo el ref como guard en la función + encolar con otro ref — sin estado React en el camino crítico.

---

## Problema 26: Línea de progreso del timeline aparece pre-llenada al entrar la sección

### Síntoma
En un timeline vertical con líneas de progreso entre dots (sección BlockchainV2), la primera línea (entre el paso 0 y el paso 1) aparece completamente llena en azul al hacer scroll hasta la sección. Después de un instante visible se "resetea" a vacío y comienza a llenarse correctamente con el scroll.

### Causa
El estado inicial de los fills se definía en el JSX con lógica condicional:

```tsx
transform: isFirst ? 'scaleY(1)' : 'scaleY(0)',
```

La intención era mostrar el primer paso como "activo" desde el inicio. Pero el `onUpdate` del ScrollTrigger siempre calcula el fill correcto para el progreso actual. Al entrar a la sección con `progress = 0`:

```ts
const fill = Math.max(0, Math.min(1, 0 * STEPS.length - 0))  // → 0
inner.style.transform = 'scaleY(0)'
```

El primer frame del pin dispara `onUpdate` con `progress = 0`, que sobreescribe el `scaleY(1)` del markup con `scaleY(0)`. El usuario ve el fill lleno brevemente y luego ve cómo se vacía — exactamente al revés de lo que se quiere.

### Solución

Inicializar **todos** los line fills a `scaleY(0)` en el JSX. El `onUpdate` es la única fuente de verdad:

```tsx
// ❌ El primer fill nace lleno — entra en conflicto con onUpdate al inicio
<div style={{
  transform: isFirst ? 'scaleY(1)' : 'scaleY(0)',
  ...
}} />

// ✅ Todos los fills nacen vacíos — onUpdate los llena exclusivamente con scroll
<div style={{
  transform: 'scaleY(0)',
  ...
}} />
```

El `onUpdate` ya maneja correctamente todos los estados (0 a 1 por línea) en función del progreso del scroll:

```ts
onUpdate(self) {
  for (let i = 0; i < STEPS.length - 1; i++) {
    const fill = Math.max(0, Math.min(1, self.progress * STEPS.length - i))
    lineFillRefs.current[i]!.style.transform = `scaleY(${fill})`
  }
}
```

### Regla general
> Nunca inicializar en el JSX un estado visual que será sobreescrito por `onUpdate` de un ScrollTrigger. El markup debe reflejar el estado inicial real (generalmente `0` / vacío / oculto); el ScrollTrigger lo lleva al estado correcto desde el primer frame. Cualquier valor "inicial" en el JSX que difiera del valor que `onUpdate` calculará con `progress = 0` producirá un flash o reset visible.

---

## Problema 27: GSAP sobreescribe `display: none` del nav desktop en móvil

### Síntoma
En móvil, la barra de navegación desktop (pill flotante) aparece superpuesta al nav
móvil. El elemento tiene `className="hidden md:flex"` — debería estar oculto en pantallas
< 768px — pero es visible de todas formas.

### Causa
El `useEffect` de entrada del nav ejecuta `gsap.fromTo(navRef.current, { opacity: 0, top: '-34px' }, { opacity: 1, top: '14px' })`.
Cuando GSAP anima un elemento con `display: none`, sobreescribe el `display` inline
para poder ejecutar la animación — aunque el elemento tenga `opacity: 1` al finalizar,
ya no está oculto. La clase `hidden` de Tailwind genera `display: none` como regla CSS,
pero un `display` inline (puesto por GSAP) tiene mayor especificidad y gana.

### Solución: doble protección

**1. Guard en el `useEffect` — no animar si el viewport es móvil:**
```tsx
useEffect(() => {
  // Solo animar en desktop; en móvil GSAP no debe tocar el elemento hidden
  if (navRef.current && window.innerWidth >= 768) {
    gsap.fromTo(navRef.current,
      { opacity: 0, top: '-34px' },
      { opacity: 1, top: '14px', duration: 1.1, ease: 'expo.out', delay: 0.3 }
    )
  }
}, [])
```

**2. CSS `!important` como red de seguridad:**
```css
/* globals.css */
@media (max-width: 767px) {
  nav.hidden { display: none !important; }
}
```

El `!important` gana sobre cualquier `display` inline que GSAP pueda poner en el futuro
(ej. si se añade otra animación GSAP sobre el mismo elemento).

### Regla general
> Si un elemento tiene `display: none` vía CSS (Tailwind `hidden`, media query, etc.)
> y GSAP lo anima con `fromTo` o `from`, GSAP sobreescribe el `display`. Siempre
> guardar la animación con una comprobación de viewport + añadir `!important` en CSS
> como fallback. Aplica a cualquier elemento que deba estar oculto en ciertas
> condiciones pero visible en otras.

---

## Problema 28: Texto MONO uppercase con `letter-spacing` se desborda en móvil

### Síntoma
Un párrafo de subtítulo en MONO uppercase con `letterSpacing: '0.16em'` y un `<br/>`
manual que parte la primera línea muestra el texto cortado en el borde derecho de la
pantalla en móvil. La sección tiene `overflow: hidden` que clipa el texto desbordante.

### Causa
El `<br/>` fuerza una primera línea de longitud fija (la determinada por el autor para
desktop). En móvil, esa misma línea — en MONO uppercase, que ya es más ancho que
Inter por ser monoespaciada, más el `0.16em` de letter-spacing extra — puede superar
el ancho disponible (`100vw − padding`). El browser no puede romper dentro de la línea
forzada, así que el texto desborda y `overflow: hidden` lo clipa.

Ejemplo concreto en `HeroV2`: la línea
`"TRANSFORMAMOS DESAFÍOS REALES EN SOLUCIONES BLOCKCHAIN"`
a 11px MONO + `0.16em` letter-spacing en un viewport de ~390px disponibles (~350px
netos) mide aprox. 490px — 140px más ancho que el contenedor.

### Solución

Eliminar el `<br/>` manual y dejar que el browser haga el word-wrap automático.
Reducir `letterSpacing` de `0.16em` a `0.12em` para que el texto respire sin
desbordarse en pantallas angostas. Añadir `wordBreak: 'break-word'` y `maxWidth: '100%'`
como safety net:

```tsx
// ❌ Desborda en móvil — línea manual demasiado larga
<p style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
  Transformamos desafíos reales en soluciones blockchain<br/>
  para organizaciones públicas y privadas de Chile.
</p>

// ✅ Wrap natural — el browser decide dónde cortar
<p style={{
  letterSpacing: '0.12em', textTransform: 'uppercase',
  wordBreak: 'break-word', maxWidth: '100%',
}}>
  Transformamos desafíos reales en soluciones blockchain para organizaciones públicas y privadas de Chile.
</p>
```

### Regla general
> Nunca usar `<br/>` manual en textos MONO uppercase con letter-spacing elevado
> si el mismo componente se muestra en móvil. El letter-spacing acumula espacio extra
> en cada carácter — 50 chars × 0.16em a 11px = +88px extra solo de spacing.
> Dejar siempre que el browser haga el word-wrap automático y ajustar el `letterSpacing`
> si el texto queda demasiado comprimido en la versión desktop.

---

## Problema 29: Secciones con padding uniforme generan demasiado espacio en móvil

### Síntoma
Al ver el sitio en un teléfono, hay grandes bloques de espacio vacío entre secciones.
El contenido parece flotando en el centro de la pantalla, con márgenes superiores e
inferiores desproporcionados. El problema se hace especialmente visible cuando dos
secciones del mismo color (ambas cream o ambas dark) se tocan — el espacio acumulado
entre ellas duplica visualmente el gap.

### Causa
Los valores `clamp(96px, 14vh, 136px)` diseñados para desktop son correctos en una
pantalla de 1440px donde el contenido tiene altura suficiente para justificar el respiro.
En móvil (390px de ancho), ese mismo `96px` mínimo representa ~25% de la altura del
viewport, y el contenido de la sección es mucho más corto (columna única en lugar de
grid). La combinación produce secciones que parecen medio vacías.

Adicionalmente, si el componente no tiene variante móvil explícita, el valor del `clamp`
se aplica igual en todos los breakpoints — no hay CSS media query ni lógica condicional
que lo reduzca.

### Solución: patrón `isMobile` en cada sección

Importar `useIsMobile` y aplicar un padding reducido en móvil. El valor estándar del
proyecto es **48px arriba / 40px abajo** en móvil vs `clamp(96px, 14vh, 136px)` en desktop:

```tsx
import { useIsMobile } from '@/lib/useIsMobile'

export default function MiSeccion() {
  const isMobile = useIsMobile()

  return (
    <section style={{
      padding: isMobile
        ? '48px 24px'                                           // móvil
        : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)',   // desktop
    }}>
      ...
    </section>
  )
}
```

Si la sección tiene más respiración abajo (como About o Contact):
```tsx
padding: isMobile
  ? '48px 24px 40px'
  : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px) clamp(160px, 28vh, 280px)'
```

Para elementos de espaciado explícito (divs `height` al final de sección):
```tsx
<div style={{ height: isMobile ? '40px' : 'clamp(72px, 10vh, 108px)' }} />
```

### Regla general
> **Toda sección nueva debe tener padding diferenciado para móvil desde el primer
> commit.** No se puede confiar en `clamp()` para adaptar el espaciado — el mínimo
> del clamp sigue siendo grande para móvil. Ver la tabla de valores canónicos en
> CLAUDE.md (sección "Sistema de espaciado por sección — desktop vs móvil").

---

## Problema 30: Overlay de transición no se ve — LenisProvider scrollea en paralelo

### Síntoma
Al hacer click en un link interno (`<a href="#seccion">`), se crea un overlay GSAP
(div con `position:fixed; z-index:9999`) que debería cubrir la pantalla antes de que
el scroll salte. Sin embargo, el usuario ve el scroll suceder de inmediato sin percibir
ninguna transición. El overlay existe en el DOM y GSAP lo anima correctamente, pero
la página ya se está moviendo mientras el overlay apenas empieza a aparecer.

### Causa
`LenisProvider` registra un listener global en `document` que intercepta **todos**
los clicks en `a[href^="#"]`:

```tsx
document.addEventListener('click', handleAnchorClick)
// handleAnchorClick llama lenis.scrollTo(target, { duration: 1.6, easing: ... })
```

Cuando el componente llama `e.preventDefault()` en su `onClick` de React, eso previene
el comportamiento nativo del navegador (navegar al ancla), pero **no** cancela los
listeners de JavaScript registrados en `document`. El event listener de Lenis recibe el
mismo evento y lanza su scroll suave de 1.6s en paralelo con el overlay. Resultado:
el overlay se crea pero la página ya está animándose debajo de él.

El segundo problema detectado: el overlay usaba `background: #F8F8F4` (cream), idéntico
al fondo del Hero. Aunque la animación funcionara, el overlay era visualmente
imperceptible porque no cambiaba el color de fondo.

### Solución

**Parte 1 — Evitar el scroll paralelo de Lenis:** en `LenisProvider.tsx`, añadir un
guard que respete `defaultPrevented`. React ejecuta los handlers sintéticos antes de
que el evento llegue a `document`, por lo que `e.defaultPrevented` ya será `true`
cuando Lenis lo vea:

```tsx
const handleAnchorClick = (e: MouseEvent) => {
  if (e.defaultPrevented) return  // ← el componente ya manejó este click
  const link = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!link) return
  // ...resto del handler
}
```

**Parte 2 — Overlay perceptible:** usar `background: #FFFFFF` (blanco puro) en lugar
del color cream del fondo. El contraste blanco sobre el contenido cream/navy del Hero
hace el fade-in claramente visible. Duración mínima recomendada: 400ms fade-in,
550ms fade-out.

```tsx
overlay.style.cssText = [
  'position:fixed', 'inset:0', 'background:#FFFFFF',
  'z-index:9999', 'opacity:0', 'pointer-events:auto',
].join(';')
document.body.appendChild(overlay)

gsap.to(overlay, {
  opacity: 1, duration: 0.40, ease: 'power2.inOut',
  onComplete: () => {
    lenis.scrollTo(target, { immediate: true, force: true })
    gsap.to(overlay, {
      opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.05,
      onComplete: () => document.body.removeChild(overlay),
    })
  },
})
```

### Regla general
> Cualquier componente que maneje sus propios links internos con lógica custom debe
> llamar `e.preventDefault()` para señalizar al `LenisProvider` que no intervenga.
> El guard `if (e.defaultPrevented) return` en `LenisProvider` es el contrato entre
> ambas partes.

---

## Problema 31: Deriva horizontal — el sitio se desplaza lateralmente en móvil

### Síntoma
En dispositivos móviles, el sitio tiene un pequeño scroll horizontal. Al hacer swipe lateral con el dedo, el contenido se desplaza unos píxeles a la derecha revelando un margen blanco, y al soltar vuelve. En algunos casos el desplazamiento queda "fijo" y el layout aparece cortado.

### Causa
Algún elemento tiene un ancho ligeramente superior al viewport o un `margin` / `padding` negativo que empuja el contenido fuera de los límites. En este proyecto la fuente principal es la grilla de fondo con `backgroundAttachment: fixed` más los gradients de glow que se calculan respecto al viewport — en ciertos viewpoints móviles el elemento con `position: absolute; inset: 0` puede provocar un overflow implícito de 1–2px.

### Solución: `overflow-x: hidden` en `html` y `body`

```css
/* globals.css */
html {
  overflow-x: hidden;
}
body {
  overflow-x: hidden;
}
```

**Por qué en ambos**: si solo se aplica en `body`, el scroll horizontal puede seguir siendo gestionable en el `html`. Poner ambos garantiza que cualquier overflow lateral quede bloqueado a nivel de raíz, independientemente de qué elemento lo cause.

**Efectos secundarios**: ninguno en este proyecto. `overflow-x: hidden` en `html`/`body` no afecta el scroll vertical ni el smooth scroll de Lenis.

---

## Problema 32: GSAP pin en móvil — flash blanco, colapso de sección y layout roto (BlockchainV2)

### Síntoma
En móvil, la sección `BlockchainV2` muestra tres bugs simultáneos:
1. **Flash blanco** al hacer scroll rápido hacia la sección — una franja blanca aparece durante ~150ms antes de que la sección se estabilice.
2. **Sección "aplastada"** — al terminar el pin, la sección aparece colapsada a ~0px de altura y desaparece del flujo.
3. **Layout inclinado** — el contenido se desalinea verticalmente y aparece fuera de su posición natural durante el scroll.

### Causa
`pin: true` de GSAP ScrollTrigger crea un `<div class="gsap-pin-spacer">` para reservar el espacio de la sección mientras está fijada. En móvil, donde la sección tiene `height: 100vh` y el pin dura `2 × 100vh`, el spacer crea 200vh de espacio extra en el flujo — el triple de lo que el usuario espera ver. Al terminar el pin, GSAP intenta restablecer el layout y el espaciado queda inconsistente, produciendo el "aplastamiento". El flash surge porque el spacer hereda el fondo del body (cream) durante el frame de transición al modo pin.

### Solución: deshabilitar el pin completamente en móvil

```tsx
// BlockchainV2.tsx — dentro de useGSAP
useGSAP(() => {
  const triggerStart = isMobile ? 'top 88%' : 'top 80%'

  // El pin solo se activa en desktop
  if (!isMobile) {
    gsap.to({}, {
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        anticipatePin: 1,
        start: 'top top',
        end: () => `+=${window.innerHeight * PIN_MULT}`,
        scrub: 1.2,
        onUpdate: (self) => { /* timeline scrub logic */ },
      },
    })
  }

  // Animaciones de entrada — independientes del pin
  gsap.fromTo('.bc-h2-line', ...)
}, { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true })
```

Y en el JSX de la sección:
```tsx
<section style={{
  height: isMobile ? 'auto' : '100vh',
  minHeight: isMobile ? '100svh' : '600px',
  paddingBottom: isMobile ? '56px' : undefined,
}}>
```

En móvil la sección fluye normalmente como `height: auto`. Los dots del timeline siguen siendo clickeables pero llaman `activateStep(idx)` directamente sin `lenis.scrollTo` (no hay posición de scroll que calcular en un layout de flujo).

### Regla general
> Nunca mantener `pin: true` en secciones que muestran contenido en una sola columna en móvil. El pin asume que la sección tiene suficiente anchura y altura para que el efecto tenga sentido — en móvil esto rara vez se cumple. Desactivar con `if (!isMobile)` y asegurarse de que `useGSAP` tiene `dependencies: [isMobile], revertOnUpdate: true`.

---

## Problema 33: Descripción de área en AreasV2 se superpone al contenido en móvil

### Síntoma
Al tocar una fila en AreasV2 (móvil), la descripción aparece pero se superpone sobre las filas siguientes, tapándolas. El layout se ve como si la descripción "flotara" encima del contenido en lugar de empujar las filas hacia abajo.

### Causa
La descripción usa `position: absolute` con `left` calculado en función de las columnas del grid desktop (`calc(clamp(24px, 5vw, 64px) + 96px)`). En móvil, ese cálculo produce un `left` que coloca la descripción fuera del flujo normal. Al estar `absolute`, no empuja a las filas vecinas — las superpone.

### Solución: descripción inline en móvil (accordion), absoluta solo en desktop

```tsx
// AreasV2.tsx — descripción condicional según isMobile
{/* Mobile: inline accordion con maxHeight transition */}
{isMobile && hovered === i && (
  <div style={{
    maxHeight: hovered === i ? '200px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
    paddingBottom: hovered === i ? '12px' : '0',
  }}>
    <p style={{ fontSize: '13px', color: 'rgba(248,248,244,0.62)', lineHeight: 1.6 }}>
      {step.desc}
    </p>
  </div>
)}

{/* Desktop: absolute fuera del flujo */}
{!isMobile && hovered === i && (
  <p style={{
    position: 'absolute',
    left: 'calc(clamp(24px, 5vw, 64px) + 96px)',
    top: '50%', transform: 'translateY(-50%)',
    ...
  }}>
    {step.desc}
  </p>
)}
```

La fila en móvil también usa `onClick` para toggle en lugar de `onMouseEnter`:
```tsx
onClick={() => isMobile && setHovered(prev => prev === i ? null : i)}
onMouseEnter={() => !isMobile && setHovered(i)}
onMouseLeave={() => !isMobile && setHovered(null)}
```

---

## Problema 34: H2 de ProcessV2 rompe mal en móvil — "producción." queda sola en una línea

### Síntoma
El H2 de `ProcessV2` ("Cómo llevamos tu / idea a / producción.") usa `<br/>` manuales para controlar los saltos de línea en desktop. En móvil, la primera línea ("Cómo llevamos tu") ya es suficientemente larga para llenar el viewport, haciendo que "producción." quede sola en una cuarta línea — visualmente desbalanceado.

### Causa
Los `<br/>` manuales son fijos: no responden al viewport. En desktop el H2 es `clamp(44px, 6.5vw, 88px)` en una columna amplia. En móvil el mismo texto en una sola columna angosta genera líneas de distinta longitud.

### Solución: JSX condicional con isMobile

```tsx
<h2>
  {isMobile ? (
    <>Cómo llevamos tu idea a <span>producción.</span></>
  ) : (
    <>Cómo llevamos tu<br />idea a <span>producción.</span></>
  )}
</h2>
```

En móvil el browser hace el word-wrap automáticamente según el ancho disponible, produciendo siempre un resultado visualmente balanceado.

---

## Problema 35: Artefacto de ProcessV2 transparente en la parte inferior + botones no al fondo

### Síntoma (dos bugs juntos)
1. El artefacto del procesador de pasos tiene la parte inferior transparente en móvil — el fondo cream de la sección se ve a través del panel izquierdo.
2. Los botones de navegación (← →) no están pegados al fondo del artefacto — flotan en el medio del panel.

### Causa
Dos causas independientes que se manifiestan juntas:

**Causa A (transparencia):** El artefacto (`display: flex; flexDirection: column`) no tenía `background` definido — heredaba `transparent`. El panel izquierdo (`flexGrow: 0`) solo tenía el alto de su contenido, dejando el espacio restante vacío y transparente.

**Causa B (botones flotantes):** El spacer flex (`flex: 1`) entre la descripción del paso y los botones necesita un contenedor padre con altura definida para expandirse. Sin `flexGrow` en el panel izquierdo, el spacer no tiene referencia de altura y no empuja los botones al fondo.

### Solución

```tsx
// 1. Background en el artefacto
<div style={{
  background: '#FFFFFF',    // ← evita que el fondo cream traspase
  display: 'flex',
  flexDirection: 'column',
  height: isMobile ? '400px' : 'clamp(480px, 60vh, 600px)',
  borderRadius: '20px',
  overflow: 'hidden',
}}>

// 2. Panel izquierdo con flexGrow en móvil
<div style={{
  flexGrow: isMobile ? 1 : 0,   // ← en móvil, ocupa toda la altura disponible
  flexShrink: 0,                // ← NO usar shorthand 'flex' (ver Problema 36)
  display: 'flex',
  flexDirection: 'column',
}}>
  {/* Contenido + spacer + botones */}
  <div style={{ flex: 1 }} />   {/* spacer que empuja botones al fondo */}
  <div>{/* botones ← → */}</div>
</div>
```

---

## Problema 36: Conflicto React entre propiedad shorthand `flex` y longhand `flexShrink`

### Síntoma
En la consola del navegador aparece:

```
Warning: Updating a style property during rerender (flex) when a conflicting property is
set (flexShrink) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand
properties for the same value; instead, replace the shorthand with separate values.
```

El componente que causa el warning mezcla en el mismo elemento:
```tsx
style={{
  flex: isMobile ? 1 : undefined,  // shorthand
  flexShrink: 0,                    // longhand del mismo shorthand
}}
```

### Causa
`flex` es un shorthand que engloba `flexGrow`, `flexShrink` y `flexBasis`. Cuando React reconcilia el style durante un re-render, detecta que `flex` y `flexShrink` controlan la misma propiedad y genera el warning — el comportamiento puede ser indefinido dependiendo del orden de aplicación.

### Solución: usar solo longhands, nunca mezclar

```tsx
// ❌ Mezcla shorthand + longhand → warning de React
style={{
  flex: isMobile ? 1 : undefined,
  flexShrink: 0,
}}

// ✅ Solo longhands — sin conflicto
style={{
  flexGrow: isMobile ? 1 : 0,   // equivalente a flex: 1 / flex: 0
  flexShrink: 0,
  flexBasis: 'auto',             // si se necesita
}}
```

### Regla general
> En objetos `style` de React, nunca combinar `flex` (shorthand) con `flexGrow`, `flexShrink` o `flexBasis` (longhands) en el mismo elemento. Usar siempre los tres longhands o el shorthand solo, nunca los dos.

---

## Problema 37: Card "feature" (TIM) tiene ícono y tipografía más grandes que las otras cards en móvil

### Síntoma
En la rejilla de proyectos (`ProjectsV2`), la card de TIM tiene un ícono de 180px mientras las otras tienen 40px. En desktop esto es intencional — TIM es la feature card. En móvil las cards están apiladas en columna con la misma altura y el ícono gigante ocupa casi toda la card, empujando el texto hacia el borde inferior.

### Causa
El tamaño del ícono, la tipografía y el layout se determinaban con la flag `feature` (booleano estático del prop). Esta flag es `true` para TIM independientemente del viewport.

```tsx
// ❌ Antes — ícono siempre 180px para la feature card
const iconSz = feature ? 180 : 40
```

### Solución: patrón `isFeatureLayout`

```tsx
// ✅ Solo es "feature layout" en desktop
const isFeatureLayout = feature && !isMobile

const iconSz    = isFeatureLayout ? 180 : 40
const titleSz   = isFeatureLayout ? 'clamp(22px, 2.4vw, 34px)' : '17px'
const pad       = isFeatureLayout ? '32px 36px' : '20px 24px'
const gap       = isFeatureLayout ? '24px' : '12px'
const justify   = isFeatureLayout ? 'flex-end' : 'flex-start'
```

En móvil, todas las cards se tratan igual: ícono 40px, tipografía 17px, padding uniforme. La card de TIM sigue siendo visualmente distinta por su posición (primera) y altura (200px vs las otras).

---

## Problema 38: Animaciones de entrada se disparan cuando el elemento ya pasó por pantalla en móvil

### Síntoma
En móvil, varias secciones ya son visibles en pantalla pero sus animaciones de entrada todavía no han disparado. El usuario ve el contenido estático (sin animar) mientras hace scroll, y la animación se dispara tarde — cuando el elemento ya lleva un rato visible.

### Causa
Los scroll triggers estaban configurados con `start: 'top 65–75%'` — es decir, "dispara cuando el top del elemento llegue al 65–75% desde arriba del viewport". En desktop (viewport alto) ese porcentaje corresponde a que el elemento ya entró bastante en pantalla antes de animar. En móvil (viewport más corto), ese mismo porcentaje se alcanza cuando el elemento ya está completamente visible, haciendo que la animación llegue tarde o nunca.

### Solución: mover todos los triggers a `88–95%`

| Componente | Antes | Después |
|---|---|---|
| `AboutV2` — contadores | `top 65%` | `top 82%` |
| `ImpactV2` — `.impact-left` | `top 75%` | `top 90%` |
| `ImpactV2` — `.chain-pill` | `top 75%` | `top 88%` |
| `ContactV2` — reveal | `top 75%` | `top 92%` |
| `FooterV2` — reveal | `top 80%` | `top 95%` |
| `BlockchainV2` — entrada | `top 80%` | `top 88%` (móvil) |

Con `top 88–95%`, la animación dispara en cuanto el borde superior del elemento asoma en el viewport (el 88–95% del viewport desde arriba). En móvil esto se siente inmediato y natural; en desktop el elemento ya lleva unos píxeles visibles cuando anima — también correcto.

### Regla general
> Valores de `start` entre `top 88%` y `top 95%` son los más seguros para móvil. Usar `80%` solo cuando se quiere un delay deliberado (el elemento está bastante visible antes de animar). Nunca bajar de `top 65%` en componentes que deben ser compatibles con móvil.

---

## Problema 39: Palabras sueltas en líneas únicas por `<br/>` manual — ImpactV2 móvil

### Síntoma
En ImpactV2, el H2 "Blockchain no es una / tendencia. Es una nueva / infraestructura de confianza." tiene `<br/>` manuales para el layout desktop. En móvil, "nueva" queda sola en una línea — tres palabras en la segunda línea y una sola en la tercera.

### Causa
Idéntica al Problema 34: los `<br/>` manuales no responden al viewport. En un H2 de `clamp(30px, 4.2vw, 56px)` en móvil, el punto de quiebre natural de "tendencia. Es una nueva" es diferente al impuesto por el `<br/>`.

### Solución: JSX condicional con `isMobile` — eliminar `<br/>` en móvil

```tsx
<h2>
  {isMobile ? (
    // Sin <br/> — el browser hace wrap automático
    <>Blockchain no es una tendencia. Es una nueva{' '}
      <span style={{ color: '#0057FF' }}>infraestructura de confianza.</span>
    </>
  ) : (
    // <br/> manuales para desktop
    <>Blockchain no es una<br />tendencia. Es una nueva<br />
      <span style={{ color: '#0057FF' }}>infraestructura de confianza.</span>
    </>
  )}
</h2>
```

### Regla general
> Cualquier H2 o H3 con `<br/>` manuales debe tener una variante móvil sin ellos si el componente es responsive. Revisar sistemáticamente todos los textos con saltos manuales al implementar la versión móvil de una sección.

---

## Resumen rápido

| # | Problema | Causa | Solución |
|---|---|---|---|
| 1 | Flash antes de animación | HTML visible antes de que JS defina el estado inicial | Poner `style={{ opacity: 0 }}` o `style={{ transform: '...' }}` en el markup; GSAP confirma con `fromTo` |
| 2 | Salto en loop del marquee | GSAP mide DOM tarde / pocas copias / porcentaje incorrecto | CSS puro + 4 copias + keyframes a `-25%` (= 100% / nCopias) |
| 3 | Lenis + ScrollTrigger desincronizados / salto al volver al tab | Cada lib tiene su propio RAF; `lagSmoothing` compensa lag con salto | `gsap.ticker.add(lenis.raf)` + `gsap.ticker.lagSmoothing(0)` |
| 4 | GSAP falla en SSR / build de Next.js | Plugins acceden a `window` en el momento del import | `if (typeof window !== 'undefined') gsap.registerPlugin(...)` en `lib/gsap.ts` |
| 5 | `lenis.scrollTo()` no disponible en componentes hijos | Instancia vive en el Provider raíz, props/Context agrega boilerplate | `(window as any).__lenis = lenis` + fallback a `window.scrollTo` |
| 6 | Líneas de grilla desalineadas entre secciones | `background-position` es relativo a cada elemento, no al viewport | `backgroundAttachment: 'fixed'` en la capa de grilla |
| 7 | Glow del cursor con repaints costosos | `position: fixed` fuerza repaint global en cada `mousemove` | Capas absolutas + `mask-image: radial-gradient` actualizado en `mousemove` (compositor) |
| 8 | Barra de progreso con reflow en cada frame | `width` es propiedad de layout; recalcula en cada frame | `transform: scaleX()` con `transformOrigin: 'left center'` — solo compositor |
| 9 | Scroll horizontal pinned termina antes/después con resize | `end` hardcodeado no responde al ancho real del track | `end: () => += track.scrollWidth - section.offsetWidth` + `invalidateOnRefresh: true` |
| 10 | Marquee vertical (columnas del Hero) con salto en loop | Número de copias o porcentaje de keyframe incorrecto | 2 copias + `translateY(-50%)` + fades con `linear-gradient` exacto al fondo |
| 11a | Jumping en timeline scrubbed | `useState` + rerender / transición CSS en `height` durante `onUpdate` | DOM refs directos + `height` instantáneo + solo `opacity` con transición |
| 11b | Pasos intermedios se expanden en click no adyacente | `onUpdate` cruza umbrales intermedios; desbloqueo por `newStep >= target` falla en scroll hacia atrás | Lock con `skipRef` liberado solo en `onComplete` de `lenis.scrollTo`; `onUpdate` no tiene lógica de desbloqueo |
| 11d | Transiciones ausentes al hacer click en un punto | `handleDotClick` desactivaba CSS transitions antes de cambiar estado, re-habilitándolas cuando ya no había nada que animar | Eliminar el patrón disable/enable; llamar `activateStep` con transitions activas (seguro porque `skipRef` bloquea `onUpdate`) |
| 11c | Sección sube al llegar al último paso | `translateY(-50%)` o `align-items: center` recalculan al cambiar alto | `paddingTop` fijo derivado del viewport (`calc(50vh - Npx)`) |
| 11e | Línea blanca en el borde inferior durante scroll rápido | Frame sin pin durante scroll rápido + `.gsap-pin-spacer` hereda fondo cream del body | `anticipatePin: 1` en el ScrollTrigger + `.gsap-pin-spacer:has(#id) { background }` en CSS |
| 12 | Hydration mismatch en contadores de tiempo | Servidor y cliente divergen en `Date.now()` | `useState(null)` + `useEffect` para calcular solo en cliente |
| 13 | Cursor custom visible en touch / posición errática | Eventos de mouse sintéticos en táctil | `window.matchMedia('(pointer: fine)')` antes de montar; CSS cursor solo en `@media (pointer: fine)` |
| 14 | Fuente display recorta letras con `line-height: 1` | Line-box igual a `font-size` corta el ink overflow de la fuente | Mínimo `lineHeight: 1.08`–`1.12`; `paddingBottom + marginBottom` si hay `overflow: hidden` |
| 15 | `overflow-hidden` en `<section>` recorta el título | El clip afecta todos los hijos, incluido el `<h2>` | Mover `overflow-hidden` al `<div>` que contiene las filas del marquee, no al `<section>` |
| 16 | Next.js 16: `params` es undefined en páginas dinámicas | Breaking change — `params` ahora es `Promise`, no objeto síncrono | `const { slug } = await params` en async page/layout |
| 17 | Tailwind v4 no funciona con configuración de v3 | Import, config y tokens completamente distintos en v4 | `@import 'tailwindcss'` + tokens en `@theme {}` en CSS; sin `tailwind.config.ts` para colores |
| 18 | Gradiente spotlight reescribe cadena larga en cada `mousemove` | `style.background = '...'` parsea la cadena completa cada frame | `setProperty('--sx', ...)` + `var(--sx, 50%)` en el estilo base — solo cambia variables |
| 19 | Navbar vibra al hacer scroll rápido | GSAP apila tweens sobre el mismo elemento sin cancelar anteriores | `overwrite: 'auto'` en el `gsap.to` del manejador de scroll |
| 20 | Estado React cambia durante animación GSAP y el DOM salta | `setState` dispara re-render a mitad de la animación | `gsap.timeline({ onComplete: () => setState(...) })` — actualizar estado al terminar |
| 21 | Items del menú desaparecen en el orden incorrecto al cerrar | Stagger por defecto va del primer al último elemento | `stagger: { amount: 0.1, from: 'end' }` invierte el orden |
| 22 | Scrollbar flash de ~15px al desbloquear el scroll del body | `overflow: 'auto'` fuerza un valor que puede no coincidir con el estado previo | `document.body.style.overflow = ''` (string vacío) restaura al CSS original |
| 23 | OG image usa fuente fallback, no la fuente del sitio | Satori no puede cargar Google Fonts en build time | Guardar el `.ttf` en `assets/` y leerlo con `readFile(join(process.cwd(), ...))` |
| 24 | Página de inicio hereda el template de título del layout | `title: 'texto'` siempre pasa por `%s | Nombre del Sitio` | `title: { absolute: 'Título completo' }` ignora el template del layout padre |
| 25 | Botones de navegación requieren dos clics para funcionar | Race condition: `busyRef` (síncrono) se resetea antes de que React procese `setFading(false)` — ventana de 1–2 frames donde el botón sigue `disabled` aunque `busyRef` ya acepta clics | Eliminar `fading` como guard; `busyRef` es el único bloqueo + `queueRef` encola el último clic para ejecutarlo automáticamente al terminar la animación |
| 26 | Línea de progreso del timeline aparece pre-llenada al entrar la sección | Estado inicial en el JSX (`scaleY(1)`) entra en conflicto con el primer `onUpdate` del ScrollTrigger que lo resetea a `scaleY(0)` | Inicializar todas las líneas a `scaleY(0)` en el markup; `onUpdate` es la única fuente de verdad del fill |
| 27 | Nav desktop visible en móvil a pesar de `display: none` | `gsap.fromTo()` sobre un elemento con `hidden` sobreescribe el `display` inline, ganando sobre la clase CSS | Guard `window.innerWidth >= 768` en el `useEffect` + `nav.hidden { display: none !important }` en media query de CSS |
| 28 | Texto MONO uppercase cortado en el borde derecho en móvil | `<br/>` manual fuerza una línea más larga que el viewport; MONO + `0.16em` letter-spacing la hace ~140px más ancha de lo disponible | Eliminar `<br/>`, reducir `letterSpacing` a `0.12em`, añadir `wordBreak: 'break-word'` y `maxWidth: '100%'` |
| 29 | Demasiado espacio entre secciones en móvil | `clamp(96px, 14vh, 136px)` diseñado para desktop — el mínimo de 96px es ~25% del viewport en móvil; en columna única el contenido es mucho más corto | `isMobile ? '48px 24px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)'` en cada sección — nunca confiar en `clamp` para adaptar el espaciado a móvil |
| 30 | Transición overlay al hacer click en link interno no se ve — page scrollea en paralelo | `LenisProvider` tiene un listener global en `document` para todos los `a[href^="#"]`. Al hacer click, React llama `e.preventDefault()` pero el listener de Lenis ya se disparó en paralelo (el DOM listener en `document` es independiente de `preventDefault`). Resultado: el scroll suave de Lenis (1.6s) inicia al mismo tiempo que el overlay, haciéndolo imperceptible | En `LenisProvider.handleAnchorClick` añadir `if (e.defaultPrevented) return` como primera línea — React llama `preventDefault()` antes de que el evento llegue a `document`, por lo que el guard funciona correctamente |
| 31 | Deriva horizontal — el sitio se desplaza lateralmente en móvil | Algún elemento supera el ancho del viewport (grilla `backgroundAttachment:fixed`, glow layers, margen negativo) causando overflow-x implícito | `overflow-x: hidden` en `html` y `body` en `globals.css` |
| 32 | BlockchainV2 con `pin: true` produce flash blanco, colapso de sección y layout inclinado en móvil | GSAP crea un `pin-spacer` de 200vh que desarregla el flujo; en móvil el contenido es una sola columna y el pin no tiene sentido | Deshabilitar el pin con `if (!isMobile)` en `useGSAP`; sección con `height: auto; minHeight: 100svh` en móvil; `dependencies: [isMobile], revertOnUpdate: true` |
| 33 | Descripción de área en AreasV2 se superpone al contenido en lugar de empujar las filas en móvil | `position: absolute` con `left` calculado para el grid desktop — en móvil el elemento flota fuera del flujo y tapa las filas siguientes | En móvil: descripción inline con `maxHeight` transition (accordion); en desktop: mantener `position: absolute` |
| 34 | H2 de ProcessV2 rompe mal en móvil — palabra sola en una línea | `<br/>` manuales fijos para desktop generan un salto en móvil donde el texto tiene distinto ancho disponible | JSX condicional `isMobile`: sin `<br/>` en móvil, con `<br/>` en desktop |
| 35 | Artefacto de ProcessV2 transparente en la parte inferior + botones flotantes (no al fondo) en móvil | (A) Artefacto sin `background` — el fondo cream traspasa. (B) Panel izquierdo sin `flexGrow` — el spacer flex no tiene referencia de altura y no empuja los botones al fondo | `background: '#FFFFFF'` en el artefacto + `flexGrow: isMobile ? 1 : 0` en el panel izquierdo |
| 36 | Warning React: "Updating a style property during rerender (flex) when a conflicting property is set (flexShrink)" | `flex` (shorthand) y `flexShrink` (longhand) en el mismo objeto `style` — React detecta el conflicto y el comportamiento es indefinido | Reemplazar con longhands: `flexGrow: isMobile ? 1 : 0` + `flexShrink: 0`; nunca mezclar shorthand y longhand en el mismo elemento |
| 37 | Card TIM tiene ícono 180px y tipografía mayor que las otras cards en móvil | `iconSz = feature ? 180 : 40` — TIM tiene `feature: true` independientemente del viewport | `isFeatureLayout = feature && !isMobile` — en móvil todas las cards usan ícono 40px y tipografía uniforme |
| 38 | Animaciones de entrada disparan cuando el elemento ya lleva tiempo visible en móvil | `start: 'top 65–75%'` diseñado para viewports altos de desktop — en móvil el elemento ya está completamente visible cuando se alcanza ese porcentaje | Mover todos los triggers a `top 88–95%`: disparan en cuanto el borde superior del elemento asoma en el viewport |
| 39 | Palabras sueltas en líneas únicas por `<br/>` manual (ImpactV2, ProcessV2 móvil) | `<br/>` fijos para desktop crean saltos de línea en puntos que no coinciden con el word-wrap natural en el ancho de móvil | JSX condicional `isMobile`: sin `<br/>` en móvil — el browser hace wrap automático |
| 40 | Navegación entre páginas: contenido invisible + scroll en posición incorrecta | (A) Lenis persiste en el root layout entre rutas — al navegar, mantiene el scroll del origen sin resetear. (B) `ScrollTrigger` del nuevo render desconoce las dimensiones reales del documento. (C) El browser intenta restaurar la posición de scroll en navegación atrás, conflictuando con Lenis. Resultado: la página nueva muestra elementos en `opacity:0` (animaciones GSAP no disparadas) y puede arrancar mid-scroll | `window.history.scrollRestoration = 'manual'` al inicializar Lenis. En `LenisProvider`, usar `usePathname()` + `useEffect([pathname])`: en cada cambio de ruta, `lenis.scrollTo(0, { immediate: true })` y `setTimeout(() => ScrollTrigger.refresh(), 100)`. Si la URL tiene hash (ej. `/certificados` → `/#proyectos`), esperar 200ms a que monte la nueva página y luego `lenis.scrollTo(target)` en lugar de ir al top. Guardar la instancia de Lenis en un `ref` para que el efecto de pathname pueda accederla. |
