# HISTORICAL AUDIT — NavV2 Desktop Bug

INC-001 (en preparación) · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Toda la información de esta fase es memoria histórica + revalidación contra código actual.
> NO es fuente de verdad. Las hipótesis se formalizan en ROOT CAUSE ANALYSIS.

---

## Fuentes consultadas

| Fuente | Estado |
|---|---|
| `reports/PRE_WORKFLOW_LEADS.md` | ✅ Leído — 2 entradas 🔴 |
| `lore/animation.md` | ✅ Leído — 20 patrones |
| `lore/scroll.md` | ✅ Leído — 5 patrones |
| `lore/responsive.md` | ✅ Leído — 4 patrones |
| `lore/routing.md` | ✅ Leído — 6 patrones |
| `lore/layout.md` | ✅ Leído — 7 patrones |
| `incidents/index.md` | ✅ Leído — tabla vacía (INC-001 aún no creado) |
| `changelog.md` | ❌ No existe |
| Código revalidado: `NavV2.tsx` | ✅ Leído completo (340 líneas) |
| Código revalidado: `LenisProvider.tsx` | ✅ Leído completo (124 líneas) |
| Código revalidado: `app/page.tsx` | ✅ |
| Código revalidado: `app/certificados/page.tsx` | ✅ |
| Código revalidado: `app/validacion-pruebas-multimedia/page.tsx` | ✅ |
| Código revalidado: `app/validacion-videos/page.tsx` | ✅ |
| Código revalidado: `app/brochure/page.tsx` | ✅ |
| Código revalidado: `app/layout.tsx` | ✅ |

---

## A. Patrones recurrentes

Síntomas que aparecen en 2 o más fuentes históricas y son relevantes para el cluster de bugs del nav.

---

### PA-1 — GSAP animando elementos que deberían estar ocultos por CSS

**Fuentes:** `lore/animation.md` (entrada "GSAP sobreescribe display:none") · `PRE_WORKFLOW_LEADS.md` 🔴 #27

**Descripción del patrón:** GSAP asigna `display` inline al ejecutar tweens, sobrescribiendo `display:none` de CSS o de clases de Tailwind. El elemento queda visible aunque el CSS lo indique como oculto.

**Revalidación en código actual:**

- `NavV2.tsx` línea 119–155: el `<nav>` desktop tiene `className="hidden md:flex"` (oculta en móvil vía CSS) PERO también tiene `style={{ display: 'flex' }}` en línea (línea 133). El style inline **gana sobre la clase CSS en todo momento y en todo viewport**. En móvil el nav tiene `display: flex` permanentemente por el inline style.
- La única protección contra visibilidad en móvil es el guard de líneas 76–83: `if (window.innerWidth >= 768)` que evita que GSAP anime la opacidad. Sin ese guard, el nav pasaría de `opacity: 0` (inicial) a `opacity: 1` (final) también en móvil.
- **El guard impide la animación, pero no el display: el nav desktop está `display: flex` en móvil en todo momento; solo la `opacity: 0` lo oculta visualmente.** Cualquier otro código que cambie la opacidad del nav podría hacerlo visible en móvil.

**Severidad del patrón:** Alta. La protección actual es frágil: depende de que `opacity: 0` nunca sea tocado fuera del useEffect de entrada.

---

### PA-2 — Estado React no reseteado entre rutas en componentes no compartidos

**Fuentes:** `lore/routing.md` (entrada "Hydration mismatch") · comportamiento observable reportado ("estados inconsistentes tras múltiples navegaciones")

**Descripción del patrón:** Componente que en Next.js App Router se desmonta y remonta con cada navegación (porque NO está en el layout raíz) inicializa su estado en `useState`, pero efectos secundarios como listeners o timers pueden dejar rastros entre rutas.

**Revalidación en código actual:**

- `app/layout.tsx` línea 53: `<LenisProvider>{children}</LenisProvider>` — NavV2 **NO** está aquí.
- Cada página instancia NavV2 directamente (`app/page.tsx` línea 17, `app/certificados/page.tsx` línea 20, `app/validacion-videos/page.tsx` línea 19).
- En cada navegación entre estas páginas: NavV2 se **desmonta** (la instancia anterior) y se **remonta** (nueva instancia). Los cuatro `useState` (`expanded`, `hoverExpanded`, `menuOpen`, `activeId`) vuelven a sus valores iniciales y todos los `useEffect` se ejecutan de nuevo.
- Consecuencia directa: la **animación de entrada GSAP** (`opacity: 0 → 1, top: -34px → 14px`, duración 1.1s + delay 0.3s) se ejecuta en **cada navegación entre páginas** — el nav "reaparece cayendo desde arriba" cada vez.

**Severidad del patrón:** Alta. Causa directa de flickering y nav que "aparece antes de tiempo" en cada navegación.

---

### PA-3 — Guard de viewport evaluado solo al montar (no responde a resize ni re-navegación)

**Fuentes:** `PRE_WORKFLOW_LEADS.md` 🔴 #27 · `lore/animation.md` (entrada "GSAP pin — invalidateOnRefresh")

**Descripción del patrón:** Un `useEffect` con `deps: []` evalúa el viewport una sola vez al montar. No se re-ejecuta si el viewport cambia después.

**Revalidación en código actual:**

- `NavV2.tsx` líneas 76–83: el guard `window.innerWidth >= 768` está en un `useEffect` con `deps: []`.
- Dado que NavV2 remonta en cada navegación (PA-2), el guard sí se re-evalúa en cada navegación. Esto significa que si el usuario estaba en desktop cuando navega, el guard pasa y la animación corre; si estaba en móvil, el guard falla y la animación no corre.
- El riesgo real del guard único al resize es: **dentro de una misma sesión sin navegación**, si el usuario redimensiona de desktop a móvil, el listener de `resize` (líneas 111–113) cierra el menú móvil pero **no revierte** la animación GSAP que ya corrió y dejó el nav desktop en `opacity: 1`. El nav desktop queda visible en el viewport móvil.
- El breakpoint `768` en el guard (JS) debe coincidir con el breakpoint `md` de Tailwind (que en este proyecto es `768px`). En este codebase están alineados.

**Severidad del patrón:** Media. El escenario de riesgo (resize dentro de sesión sin navegación) es real pero menos frecuente.

---

### PA-4 — LenisProvider intercepta anchors globalmente con guard `defaultPrevented`

**Fuentes:** `PRE_WORKFLOW_LEADS.md` 🔴 #30 · `lore/scroll.md` (entrada "LenisProvider intercepta clicks en anchors")

**Descripción del patrón:** Un listener global `document.addEventListener('click', handleAnchorClick)` intercepta todos los clicks en anchors. El guard `if (e.defaultPrevented) return` deja pasar solo los que algún otro handler haya marcado como ya procesados. Si un anchor debería disparar una navegación de ruta y alguien llama `e.preventDefault()` antes, Lenis lo toma para un scroll suave en lugar de navegar.

**Revalidación en código actual:**

- `LenisProvider.tsx` líneas 31–51: el handler captura `a[href^="#"]` y `a[href^="/#"]` (cuando `pathname === '/'`).
- NavV2 links desde landing: `href="/#proyectos"` y `href="/#areas"` — en landing, LenisProvider los intercepta y hace scroll suave. Correcto.
- NavV2 links desde `/certificados`: `href="/#proyectos"` — LenisProvider verifica `window.location.pathname === '/'` (línea 41) que es `false`, así que NO intercepta. El navegador hace una navegación normal `/#proyectos`. Correcto.
- NavV2 CTA `href="#contacto"` — LenisProvider intercepta siempre (empieza con `#`). Correcto en landing (la sección existe), pero en páginas donde no existe `#contacto`, `document.querySelector('#contacto')` devuelve `null` (línea 48) y el handler retorna sin hacer nada ni llamar `e.preventDefault()`. El navegador entonces hace una navegación URL normal con hash — comportamiento potencialmente inconsistente.

**Severidad del patrón:** Media. El risk de `#contacto` desde páginas internas es real pero silencioso (no genera error visible, solo un scroll position raro).

---

### PA-5 — Inconsistencia arquitectónica: página usa nav del sistema heredado

**Fuentes:** Arquitectura detectada (código actual)

**Descripción del patrón:** Una página del sitio usa un componente nav diferente al que usan las demás, causando experiencias de navegación inconsistentes.

**Revalidación en código actual:**

- `app/validacion-pruebas-multimedia/page.tsx` línea 2: `import Nav from '@/components/Nav'` — usa el nav **heredado** del sistema v1.
- Las demás páginas v2 (`/`, `/certificados`, `/validacion-videos`) usan `NavV2`.
- `/brochure` no tiene nav en absoluto (página placeholder).
- `components/Nav.tsx` coexiste con `components/v2/NavV2.tsx` — dos sistemas de nav activos en producción.

**Severidad del patrón:** Media. No causa bugs en NavV2, pero introduce inconsistencia de UX y riesgo de confusión al diagnosticar síntomas de "problemas de navegación".

---

## B. Regresiones históricas

Intervenciones pasadas documentadas que modificaron el comportamiento del sistema y pueden ser causa activa de bugs.

---

### RH-1 🔴 — Guard GSAP `window.innerWidth >= 768` en entrada del nav desktop

**Referencia:** `PRE_WORKFLOW_LEADS.md` entrada #27

**Contexto de la regresión:** El nav desktop aparecía visible en móvil porque GSAP animaba `opacity: 0 → 1` sin verificar el viewport. Fix aplicado: guard `if (navRef.current && window.innerWidth >= 768)` en el useEffect de entrada.

**Estado actual del código:**

- Guard **presente** en `NavV2.tsx` líneas 76–83.
- La protección es correcta para el caso original (animación no corre en móvil).
- **Riesgo residual confirmado en código:** el nav desktop tiene `style={{ display: 'flex' }}` inline (línea 133) que sobrevive incluso cuando la animación no corre. La invisibilidad en móvil depende exclusivamente de `opacity: 0` (inline style línea 128). Si algo cambia esa opacidad, el nav desktop aparece en móvil.
- **Riesgo de resize:** si el usuario estaba en desktop (guard pasó, GSAP corrió, nav en `opacity: 1`) y reduce la ventana a móvil en la misma sesión, el nav desktop queda en `opacity: 1` y visible en el viewport móvil. El listener de resize (líneas 111–113) solo cierra el `menuOpen`, no revierte la opacidad del nav desktop.

---

### RH-2 🔴 — Guard `defaultPrevented` en LenisProvider para separar scroll suave de navigación

**Referencia:** `PRE_WORKFLOW_LEADS.md` entrada #30

**Contexto de la regresión:** Al hacer click en "Colaborar" del Hero, Lenis lanzaba scroll suave de 1.6s en paralelo con el overlay de fade. Fix: guard `if (e.defaultPrevented) return` como primera línea del handler.

**Estado actual del código:**

- Guard **presente** en `LenisProvider.tsx` línea 32.
- El handler maneja navegación con hash desde fuera de la landing: líneas 37–45 verifican `window.location.pathname === '/'` antes de convertir `/#proyectos` en `#proyectos` para scroll suave.
- **Riesgo adicional identificado en código:** Si el usuario hace click en `href="#contacto"` del nav (CTA) desde una página interna (e.g., `/certificados`), LenisProvider intenta `document.querySelector('#contacto')` (línea 48). No existe en `/certificados`, devuelve null, handler retorna sin `preventDefault()`, el browser hace navegación URL con `#contacto` appended. Scroll position y scroll restoration quedan en estado incierto.

---

### RH-3 — Scroll restoration manual via `scrollSaved` en LenisProvider

**Referencia:** No documentado en PRE_WORKFLOW_LEADS (intervención detectada en código)

**Contexto de la intervención:** `LenisProvider.tsx` implementa scroll restoration manual: guarda posición en `scrollSaved.current[pathname]` al salir de cada ruta y restaura al volver (líneas 65–120).

**Estado actual del código:**

- `window.history.scrollRestoration = 'manual'` (línea 15) — deshabilita la restauración nativa del browser para tomar control total.
- El guardado se hace en el `return` del `useEffect([pathname])` (líneas 66–70): guarda `lenisRef.current?.scroll ?? 0` al desmontar el efecto de esa ruta.
- La restauración usa `requestAnimationFrame` + `lenis.scrollTo(savedPos, { immediate: true })` (línea 107–109).
- **Riesgo identificado:** Si NavV2 remonta y lanza su animación GSAP (1.1s + 0.3s delay) en el mismo rAF cycle en que LenisProvider intenta restaurar la posición de scroll, ambas operaciones corren en paralelo. La animación del nav asume que el viewport está en su estado inicial; el scroll restoration puede mover la página mientras el nav está entrando.

---

## C. Áreas frágiles

Partes del sistema que —sin ser regresiones documentadas— tienen mayor probabilidad de romperse con cualquier cambio en NavV2.

---

### AF-1 — Sincronización temporal entre GSAP entrance de NavV2 y scroll restoration de LenisProvider

**Evidencia:** código `NavV2.tsx` líneas 76–83 (delay 0.3s + duration 1.1s) vs `LenisProvider.tsx` líneas 106–109 (rAF → `scrollTo immediate`).

**Fragilidad:** Dos operaciones asíncronas independientes (animación GSAP del nav + restauración de scroll de Lenis) corren en el mismo evento de navegación sin coordinación. El orden exacto depende de cuándo se montan los componentes y cuándo el scheduler de React los procesa.

---

### AF-2 — Cuatro estados de React en NavV2 sin coordinación explícita

**Evidencia:** `NavV2.tsx` líneas 20–23: `expanded`, `hoverExpanded`, `menuOpen`, `activeId` son cuatro `useState` independientes.

**Fragilidad:** No hay guardias contra combinaciones de estado inválidas (e.g., `menuOpen: true` + `expanded: true` al mismo tiempo). El `isOpen = expanded || hoverExpanded` (línea 29) mezcla dos fuentes de expansión. Tras remount, todos vuelven a `false/null` pero el scroll listener (líneas 41–52) que fija `expanded` se registra de nuevo — hay un frame donde el nav podría mostrar el estado colapsado aunque `window.scrollY > 60`.

---

### AF-3 — IntersectionObserver de secciones: mapa hardcodeado con IDs que pueden no existir en páginas internas

**Evidencia:** `NavV2.tsx` líneas 55–72: el observer busca IDs `areas`, `proyectos`, `equipo`, `impacto`, `blockchain`, `acerca`, `proceso`, `roadmap` con `document.getElementById(id)`.

**Fragilidad:** En páginas internas (`/certificados`, `/validacion-videos`) estos IDs no existen. El observer se registra pero nunca observa nada, y `activeId` queda en `null`. Esto es silencioso y no causa error, pero el activeId nunca se actualiza en páginas internas — potencial confusión en el estado visual de los links activos.

---

### AF-4 — Breakpoint 768px duplicado en JS y CSS sin fuente de verdad única

**Evidencia:** `NavV2.tsx` línea 77 (`window.innerWidth >= 768`) + líneas 111, 119, 224 (className `md:` → Tailwind `md` = 768px por defecto). `LenisProvider.tsx` no referencia 768px.

**Fragilidad:** Si el breakpoint de Tailwind cambia (config de `globals.css`), la lógica JS de NavV2 no se actualiza automáticamente. Actualmente están alineados pero la alineación es manual.

---

### AF-5 — `document.body.style.overflow = 'hidden'` en apertura de menú móvil sin cleanup garantizado

**Evidencia:** `NavV2.tsx` líneas 92 y 101: apertura de menú asigna `document.body.style.overflow = 'hidden'`; cierre lo revierte. La limpieza del `useEffect` (línea 107) también lo revierte.

**Fragilidad:** Si el componente se desmonta mientras el menú está abierto (navegación del usuario durante menú abierto), el `return () => { document.body.style.overflow = '' }` de la limpieza del efecto corre — correcto. Sin embargo, si el componente remonta en la página siguiente con `menuOpen: false` (valor inicial), el `useEffect([menuOpen])` corre con `menuOpen === false` y hace el cierre — incluyendo `gsap.to(overlay, { opacity: 0 })` sobre un overlay recién montado. Innecesario pero silencioso.

---

## D. Hallazgo crítico no documentado históricamente

**NavV2.tsx línea 133 — `style={{ display: 'flex' }}` inline sobrescribe `className="hidden md:flex"`**

Este hallazgo no está en ninguna entrada de lore ni en PRE_WORKFLOW_LEADS. Es una contradicción en el código actual:

- `className="hidden md:flex"` establece `display: none` en móvil y `display: flex` en desktop (vía CSS media query).
- `style={{ display: 'flex' }}` en el mismo elemento establece `display: flex` con especificidad de style attribute, que supera cualquier clase CSS.
- **Resultado real:** el nav desktop tiene `display: flex` en **todos los viewports** siempre. La clase `hidden` no tiene efecto. Solo `opacity: 0` lo oculta visualmente en móvil.

Esto contradice el propósito del fix de #27 y es un candidato a causa raíz del síntoma "elementos desktop visibles temporalmente en móvil". No se confirma hasta ROOT CAUSE ANALYSIS.

---

## Resumen ejecutivo

| Categoría | Cantidad | Ítems críticos |
|---|---|---|
| Patrones recurrentes | 5 (PA-1 a PA-5) | PA-1, PA-2, PA-3 |
| Regresiones históricas | 3 (RH-1 a RH-3) | RH-1 🔴, RH-2 🔴 |
| Áreas frágiles | 5 (AF-1 a AF-5) | AF-1, AF-2 |
| Hallazgos no documentados | 1 | Sección D (display:flex inline) |

Los síntomas del intake que se explican por lo histórico:
- **Flickering / nav que aparece** → PA-2 (remount en cada navegación + GSAP entrance)
- **Elementos desktop en móvil** → PA-1 + RH-1 + Hallazgo D (inline display:flex + opacidad frágil)
- **Scroll restoration inconsistente** → RH-3 + AF-1 (sync timing entre GSAP y Lenis)
- **Estados inconsistentes tras múltiples navegaciones** → PA-2 + AF-2 (estado reseteado en cada remount)
- **Problemas con Back/Forward** → RH-3 (scroll restoration manual vía LenisProvider)
