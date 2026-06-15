# SYSTEM INVENTORY — NavV2 Desktop Bug

INC-001 (en preparación) · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Inventario de componentes, listeners, observers, hooks, dependencias y estados compartidos.
> Base para ROOT CAUSE ANALYSIS. Cada sistema sospechoso del intake aparece mapeado.

---

## Sistemas sospechosos del intake (checklist)

- [x] GSAP
- [x] ScrollTrigger
- [x] Lenis
- [x] Navigation
- [x] Router
- [x] History API
- [x] Responsive Layer
- [x] Page Transitions
- [x] Scroll Restoration

---

## SYS-1 — Navigation (NavV2)

**Archivo:** `components/v2/NavV2.tsx` (340 líneas)

### Estado interno

| Estado | Tipo | Valor inicial | Propósito |
|---|---|---|---|
| `expanded` | `boolean` | `false` | Nav expandida por scroll (>60px) |
| `hoverExpanded` | `boolean` | `false` | Nav expandida por hover (500ms timer) |
| `menuOpen` | `boolean` | `false` | Overlay móvil abierto |
| `activeId` | `string \| null` | `null` | ID del link activo por IntersectionObserver |

**Estado derivado:** `isOpen = expanded || hoverExpanded` (línea 29) — controla `transform` y `clipPath` del nav desktop.

### Refs

| Ref | Tipo | Uso |
|---|---|---|
| `navRef` | `HTMLElement` | Target del tween GSAP de entrada + fallback GSAP |
| `overlayRef` | `HTMLDivElement` | Target de tweens del overlay móvil |
| `menuLinksRef` | `HTMLDivElement` | Query selector de `.mob-link` para stagger GSAP |
| `hoverTimer` | `setTimeout` | Timer de 500ms para `hoverExpanded` |

### Efectos (useEffect) — 5 efectos, todos con deps `[]` salvo el de `menuOpen`

| # | Deps | Propósito | Listeners registrados |
|---|---|---|---|
| E1 (línea 41) | `[]` | Scroll → `expanded` | `window: 'scroll'` (passive) |
| E2 (línea 55) | `[]` | Secciones visibles → `activeId` | `IntersectionObserver` sobre 8 IDs |
| E3 (línea 76) | `[]` | Animación GSAP de entrada (desktop only) | ninguno |
| E4 (línea 86) | `[menuOpen]` | Animación GSAP overlay + `body.overflow` | ninguno |
| E5 (línea 110) | `[]` | Resize → cerrar menú móvil si ≥768px | `window: 'resize'` |

### GSAP en NavV2

| Tween | Target | Propiedades | Guard |
|---|---|---|---|
| Entrada desktop (E3) | `navRef.current` | `opacity`, `top` | `window.innerWidth >= 768` |
| Overlay open (E4) | `overlayRef.current` | `opacity`, `pointerEvents` | `menuOpen === true` |
| Links stagger open (E4) | `.mob-link` (querySelectorAll) | `y`, `opacity` | `menuOpen === true` |
| Overlay close (E4) | `overlayRef.current` | `opacity`, `pointerEvents` | `menuOpen === false` |

### HTML emitido — dos elementos raíz

| Elemento | Clases CSS | Style inline `display` | Visible en |
|---|---|---|---|
| `<nav>` desktop | `hidden md:flex` | `display: 'flex'` (línea 133) ← **conflicto** | Todos los viewports (inline gana) |
| `<div>` móvil | `flex md:hidden` | sin display inline | Todos los viewports vía Tailwind |
| `<div>` overlay | sin clase | `display: 'flex'`, `opacity: 0` | Siempre presente en DOM |

### Links de navegación

| Link | href | Quién lo maneja |
|---|---|---|
| Logo desktop | `/` | Next.js Router (full nav) |
| Logo móvil | `/` | Next.js Router (full nav) |
| Proyectos | `/#proyectos` | LenisProvider (si pathname=='/') / Router (si no) |
| Áreas | `/#areas` | LenisProvider (si pathname=='/') / Router (si no) |
| Blog | `#` | LenisProvider captura y descarta (hash === '#') |
| CTA desktop/móvil | `#contacto` | LenisProvider (si `#contacto` existe en DOM) |

### Ciclo de vida por navegación

```
Usuario navega a /certificados:
  1. NavV2 en / se desmonta → cleanup de E1 (scroll), E2 (observer), E5 (resize)
  2. NavV2 en /certificados monta → useState: todos a false/null
  3. E1 registra 'scroll' → no dispara (scrollY = 0 tras rAF de Lenis)
  4. E2 registra IntersectionObserver sobre IDs que no existen → silencioso
  5. E3 corre → GSAP: opacity 0→1, top -34px→14px (1.4s total)
  6. E5 registra 'resize'
```

---

## SYS-2 — GSAP / Animation Layer

**Archivo principal:** `lib/gsap.ts`

### Setup

- Importa `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` de sus paquetes.
- Registra `ScrollTrigger`, `SplitText`, `useGSAP` solo en cliente (`typeof window !== 'undefined'`).
- Exporta: `gsap`, `ScrollTrigger` (SplitText y useGSAP no se exportan explícitamente).

### Consumidores de GSAP en el proyecto

| Componente | Tipo de uso | Interacción con nav |
|---|---|---|
| `NavV2.tsx` | `gsap.fromTo`, `gsap.to`, `gsap.set` (raw, no useGSAP) | Directo — anima el propio nav |
| `BlockchainV2.tsx` | `useGSAP`, `gsap.fromTo`, `gsap.from`, `gsap.to` + pin | Lee `(window as any).__lenis` |
| `ProcessV2.tsx` | `useGSAP`, `gsap.to`, `gsap.fromTo` | Sin interacción directa con nav |
| `HeroV2.tsx` | GSAP (confirmado por grep) + `(window as any).__lenis` | Sin interacción directa con nav |
| Otros 16 componentes v2 | Animaciones de entrada | Sin interacción directa con nav |

### Importante: NavV2 usa GSAP raw, no `useGSAP`

`useGSAP` hace cleanup automático de tweens al desmontar. NavV2 usa `gsap.fromTo` directamente dentro de `useEffect` — el tween de entrada **no se cancela** al desmontar el componente si está en curso. Si la navegación ocurre durante los 1.4s de duración del tween, el tween puede intentar actualizar un elemento ya desmontado.

### Estado compartido: `(window as any).__lenis`

- Escrito por LenisProvider (líneas 25, 59).
- Leído por BlockchainV2 (línea 135) y HeroV2 (líneas 155, 457) para scroll programático.
- No leído por NavV2 — el nav no hace scroll programático.

---

## SYS-3 — Lenis / Scroll System

**Archivo:** `components/v2/LenisProvider.tsx` (124 líneas)

### Instancia y ciclo de vida

- Creada en `useEffect([], [])` (línea 14) — persiste mientras el layout raíz está montado (toda la sesión).
- Destruida en cleanup del mismo efecto: `lenis.destroy()`, `gsap.ticker.remove(update)`, `__lenis = null` (líneas 56–62).
- La instancia **sobrevive** a todas las navegaciones entre páginas — `LenisProvider` está en el layout raíz.

### Integración con GSAP

- `gsap.ticker.add(update)` (línea 28): Lenis.raf se llama en cada tick de GSAP.
- `gsap.ticker.lagSmoothing(0)` (línea 29): desactiva el lag smoothing para evitar saltos.
- `ScrollTrigger.refresh()` se llama en dos momentos de navegación (líneas 87, 114).

### Listeners registrados

| Listener | Target | Propósito | Cleanup |
|---|---|---|---|
| `gsap.ticker` | global | RAF de Lenis | `gsap.ticker.remove(update)` |
| `document: 'click'` | document | Interceptar anchors | `removeEventListener` en cleanup |

### Efectos de pathname

| Efecto | Deps | Propósito |
|---|---|---|
| Guardar posición | `[pathname]` (return) | `scrollSaved[pathname] = lenis.scroll` al salir |
| Restaurar posición | `[pathname]` | RAF → `lenis.scrollTo(saved, {immediate:true})` o `scrollTo(0)` |

### Flujo de Back navigation

```
1. pathname cambia (push → pop)
2. useEffect([pathname]) return: guarda lenis.scroll en scrollSaved[saliente]
3. useEffect([pathname]): lee scrollSaved[destino]
4. rAF: lenis.scrollTo(savedPos, {immediate:true})
5. setTimeout(100ms): ScrollTrigger.refresh()
```

### Flujo de navegación con hash (desde landing)

```
1. Usuario clickea href="/#proyectos" en nav
2. LenisProvider handleAnchorClick: pathname === '/' → hash = '#proyectos'
3. e.preventDefault(), lenis.scrollTo('#proyectos', {duration:1.6})
```

### Flujo de navegación con hash (desde /certificados)

```
1. Usuario clickea href="/#proyectos" en nav
2. LenisProvider handleAnchorClick: pathname !== '/' → NO intercepta
3. Navegación normal → Next.js Router navega a /#proyectos
4. LenisProvider useEffect([pathname]): restaura/inicializa scroll
5. LenisProvider useEffect([pathname]): setTimeout(400ms) → ScrollTrigger.refresh() → lenis.scrollTo('#proyectos')
```

---

## SYS-4 — Router / Next.js App Router

**Archivos involucrados:** `app/layout.tsx`, `app/page.tsx`, `app/*/page.tsx`, `LenisProvider.tsx`

### Arquitectura de rutas

| Ruta | Componentes montados | NavV2 | Nav legacy | Observaciones |
|---|---|---|---|---|
| `/` | NavV2, ScrollUI, HeroV2…FooterV2 | ✅ | — | Landing completa |
| `/certificados` | NavV2, ScrollUI, Cert*V2, FooterV2 | ✅ | — | Página de proyecto v2 |
| `/validacion-videos` | NavV2, ScrollUI, Video*V2, FooterV2 | ✅ | — | Página de proyecto v2 |
| `/validacion-pruebas-multimedia` | Nav (legacy), Valid*, Footer (legacy) | — | ✅ | **Sistema distinto** |
| `/brochure` | ninguno | — | — | Placeholder sin nav |

### Componentes en layout raíz (persisten entre rutas)

Solo `LenisProvider` — todo lo demás es por página.

### Comportamiento de remount

En App Router, una navegación entre `/` y `/certificados` desmonta todos los componentes específicos de la ruta anterior y monta los de la nueva. **NavV2 remonta en cada navegación entre páginas v2.** No hay preservación de estado del nav entre rutas.

### `usePathname` en uso

Solo `LenisProvider.tsx` usa `usePathname` (línea 12). NavV2 no observa el pathname — no sabe en qué página está.

---

## SYS-5 — History API

**Archivo:** `LenisProvider.tsx` línea 15

### Modificaciones al comportamiento nativo

- `window.history.scrollRestoration = 'manual'` (línea 15) — desactiva la restauración automática del browser. LenisProvider toma control total.
- El browser no restaura la posición de scroll en Back/Forward — todo depende del mecanismo de `scrollSaved` de LenisProvider.

### Interacción con Back/Forward buttons

```
Back button:
  1. Browser hace pop del history state
  2. Next.js Router actualiza pathname
  3. LenisProvider detecta cambio de pathname
  4. Intenta restaurar desde scrollSaved[pathname anterior]
  5. Si el entry existe: lenis.scrollTo(savedPos, {immediate:true})
  6. Si no existe: lenis.scrollTo(0, {immediate:true})
```

**Riesgo:** scrollSaved solo guarda si `lenis.scroll > 0` (línea 68). Si el usuario navega desde el tope de la página (scroll = 0) y vuelve, no hay entry en scrollSaved y Lenis hace `scrollTo(0)` — correcto. Pero si el usuario hace Back a una ruta que no estaba en scrollSaved (e.g., primera visita), también hace `scrollTo(0)` — correcto. El sistema parece robusto para este caso.

---

## SYS-6 — Responsive Layer

**Archivos:** `lib/useIsMobile.ts`, `NavV2.tsx` (guard JS manual)

### `useIsMobile.ts`

- Hook con `useIsomorphicLayoutEffect` (LayoutEffect en cliente, Effect en servidor).
- Inicializa con `false` — puede causar un flash si el cliente es mobile (SSR: false, cliente: true).
- Registra `resize` listener con el mismo breakpoint (default 768).
- Reactivo a resize: actualiza `isMobile` en tiempo real.
- **NavV2 NO usa `useIsMobile`** — usa `window.innerWidth >= 768` directamente en un `useEffect([], [])`.

### Fuentes de verdad del breakpoint en NavV2

| Fuente | Valor | Reactiva a resize |
|---|---|---|
| Tailwind `md:` | 768px (CSS media query) | ✅ Sí (CSS) |
| E3 guard JS (línea 77) | `>= 768` (evaluado al montar) | ❌ No |
| E5 close-on-resize (línea 111) | `>= 768` (evaluado en cada resize) | ✅ Sí |

**Desalineación:** E3 evalúa el viewport al montar y nunca más. Si el usuario redimensiona DESPUÉS de que E3 corrió (y dejó el nav desktop en `opacity: 1`), no hay mecanismo que revierta la opacidad.

### Componentes que usan `useIsMobile`

Los 18 componentes identificados por grep usan `useIsMobile` (o `isMobile` directamente). NavV2 es el único componente v2 que **no usa el hook** y en su lugar hace la verificación manual.

---

## SYS-7 — Page Transitions

No existe un sistema de transiciones de página formal (ni `<AnimatePresence>`, ni `next-view-transitions`, ni overlay de transición). Las "transiciones" son:

1. **LenisProvider** maneja el scroll en el nuevo pathname (rAF + setTimeout 400ms para hash).
2. **NavV2 remonta** con su animación GSAP de entrada (1.4s) en cada nueva página.
3. No hay ningún overlay de fade entre páginas.

**Efecto neto:** cada navegación entre páginas v2 produce un flash donde el nav desaparece (desmount de la instancia anterior) y reaparece lentamente desde arriba (entrance GSAP de la nueva instancia, delay 0.3s + duration 1.1s). Esto es el síntoma "flickering visual" y "elementos que aparecen antes de tiempo" del intake.

---

## SYS-8 — Scroll Restoration

**Implementado en:** `LenisProvider.tsx` (SYS-3)

**Mecanismo completo:**

```
Punto de guardado: useEffect([pathname]) return
  - Lee: lenisRef.current?.scroll ?? 0
  - Guarda: scrollSaved[pathname] = pos (solo si pos > 0)

Punto de restauración: useEffect([pathname]) body
  - Si isFirstPath: skip (primera carga)
  - Si URL tiene hash: setTimeout(400ms) → ScrollTrigger.refresh() → rAF → lenis.scrollTo(hash)
  - Si no hash y scrollSaved[pathname]: rAF → lenis.scrollTo(savedPos, {immediate:true})
  - Si no hash y no savedPos: rAF → lenis.scrollTo(0, {immediate:true})
  - siempre: setTimeout(100ms) → ScrollTrigger.refresh()
```

**Estado compartido de scroll restoration:**

| Variable | Scope | Persiste entre rutas |
|---|---|---|
| `scrollSaved` | `useRef<Record<string, number>>` en LenisProvider | ✅ Sí (ref en componente persistente) |
| `isFirstPath` | `useRef<boolean>` en LenisProvider | ✅ Sí |
| `lenisRef` | `useRef<Lenis>` en LenisProvider | ✅ Sí |

---

## SYS-9 — ScrollUI (scroll progress bar)

**Archivo:** `components/v2/ScrollUI.tsx`

- Registra `window: 'scroll'` listener (passive) al montar.
- Usa `scaleY` (compositor) — sin reflow.
- Remonta en cada página igual que NavV2.
- **No interactúa con GSAP ni con Lenis** — lee `window.scrollY` directamente.
- No tiene dependencias con los sistemas sospechosos. Área de bajo riesgo.

---

## Mapa de dependencias entre sistemas sospechosos

```
App Router (Router/History API)
  └── LenisProvider [persiste] (Lenis + ScrollTrigger.refresh)
        ├── gsap ticker ← (SYS-2 GSAP)
        ├── document.click (anchor handler)
        ├── pathname → scroll restoration → History API (manual)
        └── (window as any).__lenis [global] → leído por BlockchainV2, HeroV2
  
  Per-route mount/unmount:
  └── NavV2 [remonta en cada ruta] (Navigation + Responsive + GSAP raw)
        ├── useEffect[] → window: 'scroll' → expanded state
        ├── useEffect[] → IntersectionObserver (8 IDs) → activeId state
        ├── useEffect[] → gsap.fromTo(navRef) [guard: innerWidth >= 768]
        ├── useEffect[menuOpen] → gsap overlay + document.body.overflow
        └── useEffect[] → window: 'resize' → menuOpen close
  
  └── ScrollUI [remonta en cada ruta]
        └── useEffect[] → window: 'scroll' (passive, scaleY)
```

---

## Tabla de listeners globales activos simultáneamente (en una página v2)

| Listener | Registrado por | Target | Cleanup garantizado |
|---|---|---|---|
| `scroll` (passive) | NavV2 E1 | `window` | ✅ cleanup useEffect |
| `scroll` (passive) | ScrollUI | `window` | ✅ cleanup useEffect |
| `click` | LenisProvider | `document` | ✅ cleanup useEffect |
| `resize` | NavV2 E5 | `window` | ✅ cleanup useEffect |
| IntersectionObserver | NavV2 E2 | 8 elementos | ✅ `observer.disconnect()` |
| gsap.ticker | LenisProvider | GSAP | ✅ `gsap.ticker.remove` |

**Observación:** dos listeners de `scroll` activos simultáneamente (NavV2 + ScrollUI). Ambos son passive — no hay bloqueo. No es un problema de performance pero es una redundancia.

---

## Estados compartidos / acoplamiento entre sistemas

| Estado / Variable | Productor | Consumidores | Riesgo |
|---|---|---|---|
| `(window as any).__lenis` | LenisProvider | BlockchainV2, HeroV2 | Si LenisProvider se destruye y recrea, la ref queda `null` temporalmente |
| `document.body.style.overflow` | NavV2 (menuOpen) | Browser (scroll nativo) | Si NavV2 se desmonta con menú abierto, cleanup revierte; riesgo bajo |
| `window.history.scrollRestoration` | LenisProvider | Browser | Persiste como `'manual'` para toda la sesión; no se revierte al destruir Lenis |
| `scrollSaved` | LenisProvider | LenisProvider | Correctamente encapsulado en ref |
| GSAP tweens sin cleanup | NavV2 E3 | GSAP engine | Tween puede correr tras desmount si navegación ocurre durante los 1.4s de animación |

---

## Hallazgo adicional: acoplamiento `window.__lenis`

El patrón `(window as any).__lenis` expone la instancia de Lenis como global sin tipo. Tres componentes lo leen (BlockchainV2, HeroV2) y LenisProvider lo escribe. Durante la transición entre rutas, hay una ventana donde `__lenis = null` (LenisProvider en cleanup) y los componentes que lo leen podrían no encontrarlo. En NavV2 esto no es relevante (no lo usa), pero es un acoplamiento frágil en el sistema.
