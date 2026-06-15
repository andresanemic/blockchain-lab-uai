# DEPENDENCY MAP — NavV2 Desktop Bug

INC-001 (en preparación) · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Dependencias críticas, puntos únicos de falla y sistemas acoplados para cada causa raíz.
> Solo sistemas tocados por las RC identificadas en ROOT_CAUSE_ANALYSIS.md.

---

## Sistemas tocados por causa raíz (resumen)

| RC | Sistema primario | Archivos tocados |
|---|---|---|
| RC-1 | NavV2 placement (layout vs per-page) | `app/layout.tsx`, `app/page.tsx`, `app/certificados/page.tsx`, `app/validacion-videos/page.tsx`, `components/v2/NavV2.tsx` |
| RC-2 | `display:flex` inline en `<nav>` desktop | `components/v2/NavV2.tsx` (línea 133) |
| RC-3 | Guard viewport mount-only | `components/v2/NavV2.tsx` (líneas 76–83, 110–113) |
| RC-4 | Tween GSAP sin cleanup | `components/v2/NavV2.tsx` (líneas 76–83), `lib/gsap.ts` |
| RC-5 | Coordinación GSAP/Lenis en navegación | `components/v2/NavV2.tsx`, `components/v2/LenisProvider.tsx` |
| RC-6 | CTA `#contacto` desde internas | `components/v2/NavV2.tsx` (líneas 215, 310), `components/v2/LenisProvider.tsx` (líneas 34–50) |
| RC-7 | IntersectionObserver con IDs inexistentes | `components/v2/NavV2.tsx` (líneas 55–72) |

---

## DM-1 — NavV2: dependencias entrantes y salientes

### Lo que NavV2 consume (dependencias salientes)

| Dependencia | Archivo | Tipo | Qué pasaría si cambia |
|---|---|---|---|
| `gsap` | `lib/gsap.ts` | Import directo | NavV2 usa `gsap.fromTo`, `gsap.to`, `gsap.set` — si GSAP no está registrado con SSR guard, build falla |
| `ScrambleText` | `components/v2/ScrambleText.tsx` | Componente hijo | Reemplazable; se desmonta/remonta con NavV2 |
| `.nav-cta` class | `app/globals.css` (línea 322) | CSS global | Si se elimina, el botón CTA pierde todo su estilo |
| `.nav-link`, `.nav-link.is-active` | `app/globals.css` (línea 353) | CSS global | Actualmente **nunca aplicadas** (los links usan inline styles, no esta clase) — muerto |
| `.nav-progress` | `app/globals.css` (línea 305) | CSS global | **Nunca referenciado** en NavV2.tsx actual — muerto |
| `window.scrollY`, `window.innerWidth` | Browser API | Runtime | Guard SSR en `useEffect` — seguro |
| `IntersectionObserver` | Browser API | Runtime | `disconnect()` en cleanup — seguro |
| Section IDs en DOM | 7 componentes v2 | DOM runtime | Ver DM-4 |

### Lo que consume NavV2 (dependencias entrantes: quién importa NavV2)

| Importador | Archivo | Posición en árbol | Consecuencia si NavV2 cambia |
|---|---|---|---|
| Landing | `app/page.tsx` línea 1 | Hijo directo del route | Rebuild automático por HMR |
| Certificados | `app/certificados/page.tsx` línea 2 | Hijo directo del route | Rebuild automático |
| Validacion Videos | `app/validacion-videos/page.tsx` línea 2 | Hijo directo del route | Rebuild automático |

**NavV2 NO está en:**
- `app/layout.tsx` — causa de RC-1
- `app/validacion-pruebas-multimedia/page.tsx` — usa `components/Nav.tsx` legacy
- `app/brochure/page.tsx` — sin nav

---

## DM-2 — Impacto de RC-1: mover NavV2 al layout raíz

Esta es la RC de mayor impacto y la que más dependencias cascada tiene.

### Archivos que cambian si NavV2 se mueve a `app/layout.tsx`

| Archivo | Cambio requerido | Riesgo |
|---|---|---|
| `app/layout.tsx` | Añadir `import NavV2` y `<NavV2 />` | **Afecta todas las rutas** — cualquier error en NavV2 rompe el sitio entero |
| `app/page.tsx` | Eliminar `import NavV2` y `<NavV2 />` | Seguro si layout ya lo provee |
| `app/certificados/page.tsx` | Eliminar `import NavV2` y `<NavV2 />` | Seguro |
| `app/validacion-videos/page.tsx` | Eliminar `import NavV2` y `<NavV2 />` | Seguro |
| `app/validacion-pruebas-multimedia/page.tsx` | **CONFLICTO**: recibiría NavV2 del layout Y tiene `<Nav>` legacy | **Alto riesgo**: dos navbars simultáneos |
| `app/brochure/page.tsx` | Recibiría NavV2 sin pedirlo | Riesgo bajo (placeholder), pero cambio visual |

### Punto único de falla introducido por RC-1 fix

Si NavV2 se mueve al layout, **cualquier error de render en NavV2 rompe todas las páginas del sitio**. Actualmente, un error en NavV2 solo rompe las páginas que lo importan. Este es el trade-off principal de RC-1.

### Acoplamiento nuevo que RC-1 fix introduce

**Estado de NavV2 persiste entre rutas** — consecuencias:

| Estado | Comportamiento actual (remount) | Comportamiento tras fix (persistente) | Riesgo |
|---|---|---|---|
| `expanded` | Resetea a `false` en cada nav | Persiste — correcto si scroll se restaura | Bajo |
| `hoverExpanded` | Resetea a `false` | Persiste — correcto (hover no debería sobrevivir) | **Medio**: requiere reset en ruta-change |
| `menuOpen` | Resetea a `false` | **Persiste** — usuario abre menú móvil, navega, menú sigue abierto | **Alto**: bug nuevo si no se maneja |
| `activeId` | Resetea a `null` | Persiste el último valor — puede mostrar sección incorrecta como activa | **Medio** |

**Solución necesaria:** si NavV2 va al layout, necesita un `useEffect([pathname])` que cierre `menuOpen`, reset `hoverExpanded` y dispare re-evaluación del `activeId`. Requiere `usePathname()` en NavV2 — nueva dependencia de `next/navigation`.

### Impacto sobre E3 (animación GSAP de entrada)

Si NavV2 persiste en el layout: `useEffect([], [])` de E3 corre **una sola vez** (en el primer mount al cargar la aplicación). En navegaciones posteriores NavV2 ya está montado — E3 no vuelve a correr. **Este es el comportamiento deseado** — la animación de entrada ocurre una vez, no en cada ruta.

---

## DM-3 — Impacto de RC-2 y RC-3: corrección del inline style y guard de resize

### RC-2: eliminar `style={{ display: 'flex' }}` del `<nav>` desktop

**Dependencia directa:** `NavV2.tsx` línea 133 dentro del objeto `style={{...}}`.

Si se elimina `display: 'flex'` del inline style, la clase `className="hidden md:flex"` recupera el control:
- Viewport `< 768px`: `display: none` (CSS) — el nav desktop desaparece del flujo y del compositor.
- Viewport `>= 768px`: `display: flex` (CSS) — igual que antes.

**Consecuencia en cascada:** Si el nav desktop tiene `display: none` en móvil (real, no solo opacity 0), el GSAP `fromTo` sobre `navRef.current` animaría un elemento con `display:none`. GSAP asignaría `display:block` o `display:flex` inline al iniciarse el tween, anulando de nuevo el CSS. La corrección de RC-2 **requiere** que el guard de RC-3 esté operativo para que GSAP nunca intente animar el nav desktop en móvil.

**Dependencia RC-2 → RC-3:** las dos correcciones deben aplicarse juntas. RC-2 solo no es suficiente.

### RC-3: hacer el guard de viewport reactivo

El guard actual (`window.innerWidth >= 768` en `useEffect([], [])`) necesita ser reactivo a:
1. Resize de ventana (mismo mount).
2. Remount tras navegación (actualmente sí re-evalúa, pero solo porque remonta).

**Si RC-1 se implementa (NavV2 en layout):** el remount ya no ocurre → el guard de E3 corre una sola vez para siempre → RC-3 se convierte en problema crítico en el escenario de resize.

**Dependencia RC-3 → RC-1:** la urgencia de RC-3 aumenta si RC-1 se implementa. En el estado actual (remount por ruta), el guard se re-evalúa en cada navegación, lo que mitiga parcialmente el problema. Con NavV2 persistente, el guard solo corre una vez en toda la sesión.

**Alternativa de fix para RC-3:** reemplazar el guard manual por `useIsMobile()` (ya existe en `lib/useIsMobile.ts`) y usar `isMobile` como dependencia del efecto GSAP. Esto añade una dependencia de `useIsMobile` a NavV2 — actualmente NavV2 es el único componente v2 que no lo usa.

---

## DM-4 — Acoplamiento NavV2 ↔ Section IDs

### Mapa de IDs que observa NavV2 vs IDs que existen en el DOM

| ID observado (NavV2 E2) | Componente propietario | Presente en landing | Presente en /certificados | Presente en /validacion-videos |
|---|---|---|---|---|
| `areas` | `AreasV2.tsx:40` | ✅ | ❌ | ❌ |
| `proyectos` | `ProjectsV2.tsx:254` | ✅ | ❌ | ❌ |
| `equipo` | `TeamV2.tsx:194` | ✅ | ❌ | ❌ |
| `impacto` | `ImpactV2.tsx:107` | ✅ | ❌ | ❌ |
| `blockchain` | `BlockchainV2.tsx:196` | ✅ | ❌ | ❌ |
| `proceso` | `ProcessV2.tsx:375` | ✅ | ❌ | ❌ |
| `acerca` | **ninguno** | ❌ | ❌ | ❌ |
| `roadmap` | **ninguno** | ❌ | ❌ | ❌ |

**Hallazgo crítico:** dos de los ocho IDs (`acerca`, `roadmap`) no existen en ningún componente v2 actual. Corresponden a secciones eliminadas por el knip audit. El observer observa elementos que no existen — dead observation.

**Acoplamiento implícito:** si en el futuro se crea una nueva página interna con una sección de id `areas` (e.g., `/servicios` con una sección `<section id="areas">`), NavV2 la observaría automáticamente y marcaría "Áreas" como activo — comportamiento sorpresivo.

**`activeId` nunca se usa en el render:** grep de NavV2.tsx confirma que `activeId` solo aparece en la línea de declaración `useState` (línea 23). No se pasa a ningún elemento como className ni como style. Las clases `.nav-link` y `.nav-link.is-active` existen en `globals.css` pero **ningún elemento del nav las tiene**. El sistema de link activo está implementado a medias — calcula el estado pero no lo aplica visualmente.

---

## DM-5 — Acoplamiento LenisProvider ↔ NavV2 (RC-5, RC-6)

### Canal de comunicación: `window.__lenis`

LenisProvider escribe `(window as any).__lenis` (líneas 25, 59). NavV2 **no lo lee** — no hace scroll programático. El acoplamiento vía `__lenis` no afecta directamente a NavV2.

### Canal de comunicación: anchor click handler

LenisProvider registra `document.addEventListener('click', handleAnchorClick)`. Los enlaces de NavV2 son anchors que pasan por este handler:

| Link de NavV2 | Capturado por LenisProvider | Qué hace LenisProvider |
|---|---|---|
| `href="/"` (logo) | ❌ (no empieza con `#` ni `/#`) | No interceptado — full page nav |
| `href="/#proyectos"` desde `/` | ✅ | Scroll suave a `#proyectos` con Lenis |
| `href="/#proyectos"` desde otra ruta | ❌ (pathname ≠ `/`) | No interceptado — Router navega a `/#proyectos` |
| `href="/#areas"` | Igual que proyectos | — |
| `href="#"` (Blog) | ✅ pero descartado (`hash === '#'`) | Retorna sin acción |
| `href="#contacto"` desde `/` | ✅ — `#contacto` existe (FooterV2:79) | Scroll suave a `#contacto` |
| `href="#contacto"` desde `/certificados` | ✅ pero `querySelector` null | Retorna **sin preventDefault** → URL queda `/certificados#contacto` |
| `href="#contacto"` desde `/validacion-videos` | ✅ pero `querySelector` null | Igual — URL queda `/validacion-videos#contacto` |

**Punto único de falla de RC-6:** La sección `#contacto` solo existe en `FooterV2.tsx:79`. FooterV2 se usa en `app/page.tsx`, `app/certificados/page.tsx` y `app/validacion-videos/page.tsx`. Sin embargo, el id `contacto` puede estar fuera del viewport cuando el link es clickeado y el querySelector puede no encontrarlo si el DOM no está completamente renderizado. Bajo riesgo en la landing; riesgo real en páginas internas si en el futuro se añade FooterV2 a más páginas pero se cambia el id.

### Dependencia: ScrollTrigger.refresh() de LenisProvider tras navegación

`LenisProvider.tsx` línea 114: `setTimeout(() => ScrollTrigger.refresh(), 100)` tras cada cambio de pathname. Este refresh recalcula todos los ScrollTriggers activos en la nueva página, incluyendo el pin de `BlockchainV2` en la landing. Si NavV2 se mueve al layout y su entrance GSAP corre al mismo tiempo que este refresh, el nav puede estar en mid-animation cuando ScrollTrigger recalcula geometrías. **Riesgo bajo** porque el nav desktop es `position:fixed` — no afecta el layout flow del documento.

---

## DM-6 — Acoplamiento NavV2 ↔ GSAP (RC-4)

### Tween sin cleanup: ventana de vulnerabilidad

El tween de entrada de E3 tiene duración total de 1.4s (delay 0.3 + duration 1.1). Si el usuario navega durante ese intervalo:

```
t=0ms   NavV2 monta → E3 schedules useEffect
t=Xms   useEffect corre → gsap.fromTo(navRef.current, ...)
t=Xms   GSAP registra tween en su engine
t=X+300ms  GSAP inicia animación (delay 0.3s)
t=?ms   Usuario navega → React desmonta NavV2
t=?ms   E3 cleanup corre → pero NO hay gsap.killTweensOf()
t=?ms   GSAP continúa el tween sobre el nodo desmontado
```

GSAP detecta que el elemento está desconectado del DOM y cancela silenciosamente el tween (comportamiento de GSAP 3). No produce error, pero hay un frame en que el nodo existe en el GSAP engine pero no en el DOM.

**Si RC-1 se implementa (NavV2 en layout):** este riesgo desaparece — NavV2 nunca se desmonta durante la sesión, el tween corre hasta completarse.

**Si RC-1 NO se implementa:** añadir `return () => { if (navRef.current) gsap.killTweensOf(navRef.current) }` en el cleanup de E3 elimina el riesgo.

---

## DM-7 — Puntos únicos de falla del sistema

| SPOF | Descripción | Sistemas que fallan si se rompe |
|---|---|---|
| `LenisProvider` en layout raíz | Único componente persistente. Si falla, toda la navegación y scroll del sitio se rompe | Lenis, ScrollTrigger.refresh, scroll restoration, anchor handler |
| `lib/gsap.ts` SSR guard | Si el guard falla, el build de Next.js falla por `window is not defined` | Todos los 20 componentes que importan gsap |
| `window.history.scrollRestoration = 'manual'` | Configurado una vez al montar LenisProvider. Si LenisProvider no monta (error), el browser usa su restauración nativa que puede conflictuar | Scroll restoration en todo el sitio |
| `(window as any).__lenis` | Si LenisProvider no asigna `__lenis` (error en init), BlockchainV2 y HeroV2 hacen fallback a `window.scrollTo` nativo — scroll sin suavizado | BlockchainV2 dot-navigation, HeroV2 scroll-to-section |

---

## DM-8 — Dependencias de la corrección completa (resumen ejecutivo)

Para resolver todos los RCs identificados, las correcciones tienen el siguiente orden de dependencia:

```
RC-2 (fix display:flex inline)
  REQUIERE → RC-3 (fix guard de viewport) para que GSAP no anule el fix

RC-3 (guard reactivo a resize)
  REQUIERE → reemplazar window.innerWidth manual con useIsMobile o MediaQueryList listener
  SI RC-1 se implementa → urgencia de RC-3 AUMENTA (guard ahora es para-siempre, no por-ruta)

RC-1 (NavV2 al layout)
  REQUIERE → manejo de menuOpen y hoverExpanded en cambio de ruta (nuevo usePathname en NavV2)
  REQUIERE → resolución del conflicto con Nav legacy en /validacion-pruebas-multimedia
  IMPLICA → RC-4 se mitiga solo (tween corre una vez, sin riesgo de desmount)
  IMPLICA → RC-5 se mitiga parcialmente (GSAP entrance no corre en cada nav)
  NO RESUELVE → RC-6 (#contacto desde internas) ni RC-7 (activeId muerto)

RC-6 (fix #contacto)
  INDEPENDIENTE de RC-1/RC-2/RC-3
  REQUIERE modificar solo LenisProvider.tsx (añadir preventDefault antes de retornar) o NavV2.tsx

RC-7 (fix activeId)
  INDEPENDIENTE — requiere limpiar IDs muertos (acerca, roadmap) y conectar activeId al render
```

**Orden de implementación recomendado para el REMEDIATION PLAN:**
1. RC-2 + RC-3 juntos (atómicos, sin riesgo de estado persistente nuevo)
2. RC-4 (cleanup de tween — una línea, independiente)
3. RC-1 (NavV2 al layout — mayor scope, requiere RC-2+RC-3 ya correctos)
4. RC-6 (fix puntual en LenisProvider)
5. RC-7 (cleanup de activeId — cosmético, bajo riesgo)
