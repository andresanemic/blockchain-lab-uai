# REMEDIATION PLAN — Etapa 3 (RC-6 + RC-7a + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Derivado de HISTORICAL_AUDIT_etapa3, SYSTEM_INVENTORY_etapa3,
> ROOT_CAUSE_ANALYSIS_etapa3 y DEPENDENCY_MAP_etapa3.
> NO se escribe código hasta CONTROLLED IMPLEMENTATION con checkpoint git.

---

## Scope de Etapa 3

| RC | Síntoma resuelto | Archivo | Cambio |
|---|---|---|---|
| RC-6 | URL pollution `#contacto` desde páginas internas | `LenisProvider.tsx` | 1 línea (línea 49) |
| RC-8 | Aterriza en sección incorrecta al navegar desde páginas internas | `LenisProvider.tsx` | 1 línea (líneas 73–76) |
| RC-7a | Dead code: IDs `acerca`/`roadmap` sin correspondencia en DOM | `NavV2.tsx` | 2 entradas eliminadas del mapa (líneas 67–68) |

**Total: 2 archivos, 4 líneas de cambio neto.**

---

## Etapa 3 — Scope cerrado

### RC-6 — Fix `e.preventDefault()` en Guard 2 de `handleAnchorClick`

**Archivo:** `components/v2/LenisProvider.tsx` línea 49

**Cambio:**
```diff
- if (!target) return
+ if (!target) { e.preventDefault(); return }
```

**Qué resuelve:** desde `/certificados`, click en CTA "Colaborar" (`href="#contacto"`) ya no appende `#contacto` a la URL. El browser no recibe el evento sin `preventDefault` y la URL permanece limpia.

**Qué NO cambia:** ningún scroll ocurre cuando `target` es null (comportamiento actual). El fix solo previene la mutación de URL — no añade scroll.

**Interacción con Guard 0:** nula. HeroV2 "Colaborar" llama `e.preventDefault()` antes de que el evento llegue a `handleAnchorClick` → Guard 0 lo descarta en línea 32. Los dos paths son mutuamente excluyentes (verificado en DM-E3-1).

---

### RC-8 — Fix `isFirstPath` para hash handling en FPL

**Archivo:** `components/v2/LenisProvider.tsx` líneas 73–76

**Cambio:**
```diff
  if (isFirstPath.current) {
    isFirstPath.current = false
-   return
+   if (!window.location.hash) return
  }
```

**Qué resuelve:** en Full Page Load a `/#proyectos` (o cualquier ruta con hash), el bloque `if (hash)` de línea 82 ahora se ejecuta. Esto dispara `setTimeout(400ms) → ScrollTrigger.refresh() → lenis.scrollTo(hash)` — el mismo mecanismo ya validado en producción para soft navigation. El scroll llega a la sección correcta después de que el pin-spacer de BlockchainV2 esté instalado.

**Qué NO cambia:**
- FPL sin hash: `window.location.hash` es `''` (falsy) → `if (!hash) return` → mismo comportamiento que antes.
- Scroll restoration (`lenis.scrollTo(savedPos)`, líneas 101–115): no se ejecuta en first load. El bloque `if (hash)` de línea 82 retorna vía cleanup antes de llegar a scroll restoration — sin cambio.
- Todas las navegaciones soft (isFirstPath=false desde la segunda ruta): sin cambio.

**Orden de ejecución garantizado:** `useEffect([])` línea 14 (instancia Lenis → `lenisRef.current = lenis`) se declara antes que `useEffect([pathname])` línea 73 en el mismo componente. React ejecuta efectos en orden de declaración en el primer render. El `setTimeout(400ms)` añade margen adicional. `lenisRef.current` está disponible cuando `lenis.scrollTo` se ejecuta.

---

### RC-7a — Eliminar IDs muertos del IntersectionObserver

**Archivo:** `components/v2/NavV2.tsx` líneas 67–68

**Cambio:**
```diff
  const map: Record<string, string> = {
    areas: 'areas', proyectos: 'proyectos', equipo: 'equipo',
-   impacto: 'areas', blockchain: 'proyectos', acerca: 'equipo',
+   impacto: 'areas', blockchain: 'proyectos',
-   proceso: 'equipo', roadmap: 'equipo',
+   proceso: 'equipo',
  }
```

**Qué resuelve:** elimina 2 entradas del mapa que apuntan a IDs inexistentes (`acerca`, `roadmap`). El observer ya ignoraba silenciosamente estos IDs — el cambio de comportamiento observable es cero. Es exclusivamente higiene de dead code.

**Impacto sobre `activeId`:** nulo. `'equipo'` sigue siendo reachable via `equipo` (TeamV2) y `proceso` (ProcessV2). El rango de valores posibles de `activeId` no cambia.

---

### Lo que NO cambia en Etapa 3

- Lógica de scroll restoration de LenisProvider para soft navigation — sin cambios.
- Animación GSAP de NavV2 — sin cambios.
- IntersectionObserver trigger del activeId para los 6 IDs válidos — sin cambios.
- RC-7b (conectar activeId al render) — diferido, ver sección "Diferido" abajo.

---

## Archivos afectados

| Archivo | RCs | Líneas | Tipo de cambio |
|---|---|---|---|
| `components/v2/LenisProvider.tsx` | RC-6, RC-8 | 49 y 73–76 | 2 cambios de 1 línea c/u, mismo archivo |
| `components/v2/NavV2.tsx` | RC-7a | 67–68 | 2 líneas eliminadas del mapa |

---

## Golden Paths gate (Etapa 3)

### Tests gate — deben pasar de RED a GREEN

| GP | Sub-caso | Test gate | Estado esperado post-fix |
|---|---|---|---|
| GP-10 | Sub-caso A | Desde `/certificados`, click "Proyectos" (`/#proyectos`) → llega a sección Proyectos | RED ahora → **GREEN** (RC-8) |
| GP-10 | Sub-caso B | Desde `/certificados`, click "Colaborar" (`#contacto`) → URL no cambia | RED ahora → **GREEN** (RC-6) |

### Tests de regresión — deben mantenerse GREEN

| GP | Tests críticos a mantener | Por qué aplica |
|---|---|---|
| GP-1 | LenisProvider scroll restoration (Back/Forward) | LenisProvider es tocado por RC-6 y RC-8 |
| GP-2 | Nav en DOM, count=1, logo visible en `/` y `/certificados` | NavV2 es tocado por RC-7a |
| GP-3 | Hamburger visible, toggle, cierre en mobile | NavV2 tocado |
| GP-5 | Nav inmediato en páginas internas (gap < 500ms), no flash | NavV2 tocado — animación de entrada no debe regresar |
| GP-4 | Display:none en 390px | NavV2 tocado — bleed no debe reaparecer |

**Nota:** GP-10 requiere scripts Playwright nuevos. La fase VALIDATION DESIGN los crea y demuestra RED antes de CONTROLLED IMPLEMENTATION.

---

## Riesgos de Etapa 3

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| RC-8: timeout 400ms insuficiente si GSAP tarda más en instalar el pin | Baja | El mismo timeout ya está validado en prod para soft nav. Si falla, el síntoma es el mismo que antes — no introduce regresión nueva. |
| RC-8: `lenis.scrollTo` llamado con instancia no lista | Muy baja | `lenisRef.current` disponible por orden de declaración de efectos + 400ms de buffer |
| RC-6: algún `a[href^="#id"]` intencionalmente pollutea URL en otro contexto | Muy baja | Grep del codebase — no existe ese patrón. El único caso conocido con target=null es `#contacto` desde internas. |
| LenisProvider como SPOF: un error en cualquiera de los dos fixes rompe scroll global | Media | Los cambios son de 1 línea c/u; revisión cuidadosa antes de commit. Regresión detectable inmediatamente via GP-1. |
| RC-7a: cambio inadvertido en comportamiento de activeId | Muy baja | Análisis en DM-E3-3 confirma impacto cero — `'equipo'` sigue reachable sin `acerca`/`roadmap`. |

---

## Orden de implementación recomendado

RC-7a (NavV2) primero — el cambio más simple y sin dependencias:
1. `NavV2.tsx`: eliminar `acerca` y `roadmap` del mapa.

Luego RC-6 + RC-8 en el mismo pass sobre LenisProvider.tsx — mismo archivo, no hay conflicto:
2. `LenisProvider.tsx` línea 49: añadir `e.preventDefault()`.
3. `LenisProvider.tsx` línea 76: cambiar `return` por `if (!window.location.hash) return`.

**Los tres cambios pueden ir en un único commit** referenciando INC-001 Etapa 3.

---

## Diferido — RC-7b: conectar `activeId` al render (candidato a INC futuro)

**Decisión (2026-06-15):** RC-7b queda fuera del scope de INC-001 Etapa 3.

**Descripción del problema:** `activeId` se calcula correctamente vía IntersectionObserver pero nunca se aplica en el render de los links del nav. Los links siempre muestran el mismo color independientemente de qué sección está activa.

**Bug adicional identificado en DEPENDENCY MAP (DM-E3-4):** el handler `onMouseLeave` actual siempre restaura el color inactivo (`rgba(247,245,242,0.72)`). Si se añadiera el estado activo, `onMouseLeave` debería restaurar el color activo (`rgba(247,245,242,1)`) cuando `activeId === link.sectionId` — de lo contrario cada hover "rompe" visualmente el estado activo hasta que el IntersectionObserver lo restaura. Este bug debe documentarse como scope obligatorio del incidente futuro.

**Prerequisito:** RC-7a (eliminación de IDs muertos) debe estar aplicado antes de abrir este ciclo — está cubierto por Etapa 3.

**Condición de activación:** cuando se decida el diseño completo del estado activo de los links (colores, transición, comportamiento en páginas internas sin secciones). Abrir como `INC-002-navlinks-activeId` o similar con un ticket de diseño previo.

---

## Resumen ejecutivo

| Etapa | RCs | Archivos | Gate (RED→GREEN) | Estado |
|---|---|---|---|---|
| **Etapa 3** | RC-6, RC-7a, RC-8 | `LenisProvider.tsx`, `NavV2.tsx` (2 archivos, 4 líneas) | GP-10 Sub-caso A + Sub-caso B | ✅ Lista para VALIDATION DESIGN |
| **Diferido** | RC-7b (activeId render) | `NavV2.tsx` (render links) | GP pendiente (IntersectionObserver activo) | ⏸ INC futuro — prerequisito RC-7a ✓ en Etapa 3 |

**Tests RED actuales y su destino:**

| Test | Estado | Destino |
|---|---|---|
| `GP-10 Sub-caso A: sección correcta desde interna` | ❌ RED (pendiente crear) | Gate de Etapa 3 → GREEN con RC-8 |
| `GP-10 Sub-caso B: URL limpia con #contacto` | ❌ RED (pendiente crear) | Gate de Etapa 3 → GREEN con RC-6 |
| `GP-1: scroll restoration` | ✅ RED esperado permanente (FPL, sin soft nav) | Regression guard — debe mantenerse en su estado actual |
| `GP-2: RC-1 nav pierde data-*` | ❌ RED permanente esperado (INC-002) | Sin cambio en Etapa 3 |
