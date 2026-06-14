# REMEDIATION PLAN — NavV2 Desktop Bug

INC-001 (en preparación) · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Derivado de HISTORICAL_AUDIT, SYSTEM_INVENTORY, ROOT_CAUSE_ANALYSIS y DEPENDENCY_MAP.
> NO se escribe código hasta CONTROLLED IMPLEMENTATION con checkpoint git.

---

## Decisión registrada — `/validacion-pruebas-multimedia`

**Decisión del usuario (2026-06-14): Opción B — route group.**

`/validacion-pruebas-multimedia` queda excluida del layout v2. El `<Nav>` legacy de esa página se mantiene sin cambios. NavV2 se introduce mediante un route group `(v2)` en lugar de en `app/layout.tsx`.

---

## Etapas del plan

---

## Etapa 1 — NavV2.tsx consolidada (RC-2 + RC-3 + RC-4 + animation skip) · SCOPE FINAL

**Causas raíz resueltas:** RC-2 (display:flex inline), RC-3 (guard viewport mount-only), RC-4 (tween sin cleanup), animation skip vía usePathname

**Síntomas que resuelve:**
- S-01 Flickering → **resuelto** (animation skip elimina la ventana de 1.4s invisible en internas)
- S-02 Aparecen antes de tiempo → **resuelto** (ídem)
- S-03 Desaparecen incorrectamente → **mejorado** (RC-4 limpia tween; el blank de FPL entre páginas es inherente al browser, no a NavV2)
- S-09 Desktop visible en móvil → **resuelto** (RC-2 + RC-3)
- S-11 Historial de regresiones → **resuelto** (RC-2 elimina la fragilidad estructural opacity-only)

**Archivo único:** `components/v2/NavV2.tsx`

### Scope cerrado

1. **RC-2 — Eliminar `display: 'flex'` del objeto de inline style del `<nav>` desktop (línea 133).**
   La clase `className="hidden md:flex"` recupera el control del display. El nav desktop pasa a tener `display: none` real en móvil (no solo `opacity: 0`).

2. **RC-3 — Hacer el guard de viewport reactivo.**
   Añadir `useIsMobile()` (hook existente en `lib/useIsMobile.ts`) a NavV2. Reemplazar la evaluación de `window.innerWidth >= 768` en E3 por el valor de `isMobile` como dependencia del efecto. Añadir un efecto separado que, cuando `isMobile` cambia a `true`, resetee la opacidad del `navRef` a 0 (ocultamiento por resize de desktop a móvil). Cuando `isMobile` cambia a `false` y el nav ya se había animado, la visibilidad es controlada por CSS — sin re-animación.

3. **RC-4 — Añadir cleanup del tween GSAP en E3.**
   En el `return` del efecto E3, añadir `gsap.killTweensOf(navRef.current)`. Previene que el tween corra contra un nodo desmontado durante los 1.4s de animación.

4. **Animation skip vía `usePathname` (S-01, S-02 — Evidencia nivel 2, 2026-06-14).**
   Añadir `usePathname()` a NavV2. En E3, bifurcar el comportamiento según ruta:
   - `pathname === '/'` (landing) → animación completa: `gsap.fromTo(navRef.current, { opacity: 0, top: '-34px' }, { opacity: 1, top: '14px', duration: 1.1, delay: 0.3, ease: 'expo.out' })`.
   - `pathname !== '/'` (páginas internas) → skip inmediato: `gsap.set(navRef.current, { opacity: 1, top: '14px' })`.
   - Fallback SSR (`pathname === null`) → tratar como landing (animación completa, safe fallback).

   El `usePathname` también sirve para reset de estado al cambiar de ruta: al cambiar `pathname` (efecto separado), cerrar `menuOpen → false`, `hoverExpanded → false`, limpiar `hoverTimer.current`.

### Lo que NO cambia en Etapa 1

- Posición de NavV2 en el árbol de componentes — sigue per-page. RC-1 (arquitectura) es deuda técnica diferida, ver sección "Diferido" abajo.
- Links, CTA, animaciones del overlay móvil — sin cambios.
- LenisProvider — sin cambios.

### Archivos afectados

| Archivo | Tipo de cambio | Líneas aproximadas |
|---|---|---|
| `components/v2/NavV2.tsx` | Modificar | ~18–24 líneas net |

### Golden Paths gate (Etapa 1)

| GP | Test gate | Estado esperado post-fix |
|---|---|---|
| GP-4 | `desktop nav display:none en viewport 390px` | RED→GREEN (RC-2 + RC-3) |
| GP-5 | `S-02: nav visible dentro de 200ms en /certificados` | RED→GREEN (animation skip) |
| GP-7 | Checklist GSAP + display:none | Regression guard — debe seguir GREEN |

### Riesgos de Etapa 1

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| `isMobile` inicia en `false` (SSR) → flash de 1 frame en móvil | Baja | `useIsomorphicLayoutEffect` ya lo maneja en el hook |
| E3 con `[isMobile]` como dep puede re-animar en resize (mobile→desktop) | Media | Guard explícito: solo animar si `!isMobile && !hasAnimated.current` |
| Eliminar `display:'flex'` inline expone un frame sin estilo si Tailwind carga tarde | Muy baja | Tailwind se incluye en el CSS crítico de Next.js |
| `usePathname` retorna `null` durante hydration → skip podría aplicarse en landing | Muy baja | Fallback: `if (pathname === null \|\| pathname === '/')` trata null como landing |

---

## Diferido — RC-1: NavV2 per-page (arquitectura / soft navigation)

**Decisión (2026-06-14):** RC-1 queda fuera del scope de INC-001.

**Causa raíz:** NavV2 está importada en cada `page.tsx` en lugar de en un layout compartido. En Full Page Load (único tipo de navegación actual del sitio — todos los links son `<a>` plain, no Next.js `<Link>`), el layout también se recrea, por lo que mover NavV2 a un route group `(v2)/layout.tsx` no produce ningún cambio observable.

**Por qué se difiere:**
El síntoma principal (nav invisible 1.4s en páginas internas) queda resuelto por el animation skip (Etapa 1). El route group solo tendría efecto visible cuando el sitio introduzca soft navigation vía `<Link>`. Ejecutar el route group sin `<Link>` agrega 4+ cambios de archivo sin ningún cambio de comportamiento testeable.

**Test RC-1:** permanece RED de forma esperada y documentada. No es un fallo de INC-001 — es un gate para un incidente futuro.

**Condición de activación:** cuando se introduzca `<Link>` en al menos un link de ruta (candidato natural: las tarjetas de proyecto en `ProjectsV2`), abrir INC-002 con:
- Precondición: Etapa 1 de INC-001 completa y en producción.
- Scope: route group `(v2)/layout.tsx` + mover 3 `page.tsx` + verificar que RC-1 test pasa RED→GREEN.
- Candidato a lore: el patrón "layout vs per-page en Next.js App Router + FPL vs soft nav" es generalizable.

---

## Etapa 2 — Fixes puntuales de comportamiento (RC-6 + RC-7)

**No bloqueada — puede ejecutarse tras Etapa 1 o en paralelo.**

**Causas raíz resueltas:** RC-6 (CTA #contacto desde internas), RC-7 (activeId muerto)

**Síntomas que mejoran:** S-04 (problemas de navegación — URL con hash incorrecto), S-08 (estados inconsistentes — link activo visual)

### Scope cerrado

**RC-6 — Fix `#contacto` desde páginas internas (LenisProvider.tsx)**

En `LenisProvider.tsx`, línea 48: cuando `!target` (el elemento `#contacto` no existe en el DOM), añadir `e.preventDefault()` antes de retornar. El browser no appenderá el hash a la URL. La URL permanece limpia.

Líneas antes del fix:
```
if (!target) return
```
Líneas después del fix:
```
if (!target) { e.preventDefault(); return }
```

**RC-7 — Limpieza de activeId (NavV2.tsx)**

Sub-tarea 7a: eliminar IDs muertos (`acerca`, `roadmap`) del mapa del IntersectionObserver (E2). Reducir de 8 a 6 entradas activas.

Sub-tarea 7b: conectar `activeId` al render de los links. Actualmente `activeId` es dead state. Añadir lógica en el `style` de cada `<a>` de nav link para que, cuando `link.sectionId === activeId`, aplique un color diferenciado (`rgba(247,245,242,1)` vs `rgba(247,245,242,0.72)`). Alternativamente, añadir la clase `nav-link is-active` que ya existe en `globals.css`.

### Archivos afectados

| Archivo | Tipo de cambio | Líneas aproximadas |
|---|---|---|
| `components/v2/LenisProvider.tsx` | Modificar — RC-6 | 1 línea |
| `components/v2/NavV2.tsx` | Modificar — RC-7a + 7b | ~4–6 líneas |

### Golden Paths gate (Etapa 2)

| GP | Descripción | Por qué aplica |
|---|---|---|
| GP-2 | Navbar desktop consistente | Estado activo visual — parte de "consistente" |
| GP-1 | Restauración de scroll con Back | Verificar que fix de RC-6 no afecta scroll restoration |

### Riesgos de Etapa 2

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| `e.preventDefault()` en RC-6 para anchors inexistentes podría bloquear algún comportamiento nativo no previsto | Muy baja | El caso está acotado: solo cuando `target === null` |
| RC-7b (activeId en render) puede producir flashes si el observer dispara en frames intermedios | Baja | No hay transición animada — solo cambio de color |

---

## Matriz de síntomas vs etapas

| Síntoma | Etapa 1 (consolidada) | Etapa 2 | Diferido (INC-002) |
|---|---|---|---|
| S-01 Flickering | **Resuelve** (animation skip) | — | Mejora adicional con route group + `<Link>` |
| S-02 Aparecen antes de tiempo | **Resuelve** (animation skip) | — | — |
| S-03 Desaparecen incorrectamente | Mejora (RC-4 cleanup) | — | Resuelve completo con `<Link>` (sin blank de FPL) |
| S-04 Problemas de navegación | — | **Resuelve** (RC-6) | — |
| S-05 Problemas con Back | Mejora (animation skip rápido) | — | Mejora completa con soft nav |
| S-06 Problemas con Forward | — | — | — (Confidence BAJA — monitorear) |
| S-07 Scroll restoration inconsistente | — | — | Requiere `<Link>` + LenisProvider activo |
| S-08 Estados inconsistentes | Mejora (reset en pathname change) | Mejora (RC-7 activeId) | Resuelve completo con NavV2 en layout |
| S-09 Desktop visible en móvil | **Resuelve** (RC-2 + RC-3) | — | — |
| S-10 Móvil visible en desktop | — | — | — (No en NavV2 — monitorear) |
| S-11 Historial de regresiones | **Resuelve** (RC-2 estructura) | — | — |

---

## Resumen ejecutivo del plan · SCOPE FINAL

| Etapa | RCs / Cambios | Archivos | Gate (RED→GREEN) | Estado |
|---|---|---|---|---|
| **Etapa 1** | RC-2, RC-3, RC-4, animation skip | `NavV2.tsx` (1 archivo) | GP-4 test A, GP-5 S-02 | ✅ Lista para ejecutar |
| **Etapa 2** | RC-6, RC-7 | `LenisProvider.tsx`, `NavV2.tsx` (2 archivos) | GP-1, GP-2 (regression guards) | ✅ Lista (independiente) |
| **Diferido** | RC-1 (route group + `<Link>`) | 4+ archivos de routing | GP-2 RC-1 (actualmente RED) | ⏸ INC-002 cuando se introduzca soft nav |

**Orden:** Etapa 1 → cerrar INC-001 → Etapa 2 en cualquier momento. Diferido es un incidente separado.

**Tests RED actuales y su destino:**
- `gp1 › LenisProvider restaura scroll` → deuda técnica (requiere `<Link>` + BFCache o eliminar `scrollRestoration: 'manual'`)
- `gp2 › RC-1: nav PIERDE data-*` → gate para INC-002 (route group)
- `gp5 › S-02: nav visible dentro de 200ms` → gate de Etapa 1, debe pasar a GREEN
