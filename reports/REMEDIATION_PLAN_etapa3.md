# REMEDIATION PLAN — Etapa 3 (RC-7a + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Derivado de HISTORICAL_AUDIT_etapa3, SYSTEM_INVENTORY_etapa3,
> ROOT_CAUSE_ANALYSIS_etapa3 y DEPENDENCY_MAP_etapa3.
> NO se escribe código hasta CONTROLLED IMPLEMENTATION con checkpoint git.

---

## ⚠ RC-6 descartado — evidencia de campo invalida la premisa del análisis

**Fecha de descarte:** 2026-06-15 (VALIDATION DESIGN — intento de demostrar RED en GP-10B).

ROOT_CAUSE_ANALYSIS_etapa3.md afirmaba:
> "app/certificados/page.tsx no incluye ContactV2 — el elemento id='contacto' no existe en el DOM de /certificados."

Esa afirmación era **incorrecta**. Verificación con browser real (MCP Playwright en /certificados):
- `document.getElementById('contacto')` → devuelve `<footer id="contacto">` (FooterV2.tsx línea 79)
- `/certificados/page.tsx` incluye explícitamente `<FooterV2 />` → el elemento existe en el DOM
- `querySelector("#contacto")` en Guard 2 **siempre encuentra el target** en todas las páginas → `e.preventDefault()` se llama correctamente → la URL nunca se contamina

**Consecuencia:** el bug descrito en RC-6 no tiene síntoma observable en el codebase actual. El código `if (!target) return` (línea 49 de LenisProvider.tsx) es dead code defensivo que no se alcanza para ningún link existente. Se deja **sin modificar**.

**Lección documentada:** `lore/testing.md` — "Presencia de elementos en DOM: verificar en browser real, no por code-reading de imports."

---

## Scope de Etapa 3

| RC | Síntoma resuelto | Archivo | Cambio |
|---|---|---|---|
| RC-8 | Aterriza en sección incorrecta al navegar desde páginas internas | `LenisProvider.tsx` | 1 línea (líneas 73–76) |
| RC-7a | Dead code: IDs `acerca`/`roadmap` sin correspondencia en DOM | `NavV2.tsx` | 2 entradas eliminadas del mapa (líneas 67–68) |

**Total: 2 archivos, 3 líneas de cambio neto.**

---

## Etapa 3 — Scope cerrado

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
- FPL sin hash: `window.location.hash` es `''` (falsy) → `if (!window.location.hash) return` → mismo comportamiento que antes.
- Scroll restoration (`lenis.scrollTo(savedPos)`, líneas 101–115): no se ejecuta en first load. El bloque `if (hash)` de línea 82 retorna vía cleanup antes de llegar a scroll restoration.
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

**Impacto sobre `activeId`:** nulo. `'equipo'` sigue siendo reachable via `equipo` (TeamV2) y `proceso` (ProcessV2).

---

### Lo que NO cambia en Etapa 3

- RC-6: `if (!target) return` (LenisProvider línea 49) — sin cambio. Ver sección ⚠ arriba.
- Lógica de scroll restoration de LenisProvider para soft navigation — sin cambios.
- Animación GSAP de NavV2 — sin cambios.
- IntersectionObserver trigger del activeId para los 6 IDs válidos — sin cambios.
- RC-7b (conectar activeId al render) — diferido.

---

## Archivos afectados

| Archivo | RCs | Líneas | Tipo de cambio |
|---|---|---|---|
| `components/v2/LenisProvider.tsx` | RC-8 | 73–76 | 1 línea (return incondicional → condicional sobre hash) |
| `components/v2/NavV2.tsx` | RC-7a | 67–68 | 2 líneas eliminadas del mapa del observer |

---

## Golden Paths gate (Etapa 3)

### Test gate — debe pasar de RED a GREEN

| GP | Test gate | Estado esperado post-fix |
|---|---|---|
| GP-10 | FPL a `/#proyectos` → `#proyectos` en viewport tras carga | RED ahora → **GREEN** (RC-8) |

### Tests de regresión — deben mantenerse GREEN

| GP | Tests críticos a mantener | Por qué aplica |
|---|---|---|
| GP-1 | LenisProvider scroll restoration (Back/Forward) | LenisProvider es tocado por RC-8 |
| GP-2 | Nav en DOM, count=1, logo visible en `/` y `/certificados` | NavV2 es tocado por RC-7a |
| GP-3 | Hamburger visible, toggle, cierre en mobile | NavV2 tocado |
| GP-5 | Nav inmediato en páginas internas (gap < 500ms), no flash | NavV2 tocado — animación de entrada no debe regresar |
| GP-4 | Display:none en 390px | NavV2 tocado — bleed no debe reaparecer |

---

## Riesgos de Etapa 3

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| RC-8: timeout 400ms insuficiente si GSAP tarda más en instalar el pin | Baja | El mismo timeout ya está validado en prod para soft nav. Si falla, el síntoma es el mismo que antes — no introduce regresión nueva. |
| RC-8: `lenis.scrollTo` llamado con instancia no lista | Muy baja | `lenisRef.current` disponible por orden de declaración de efectos + 400ms de buffer |
| LenisProvider como SPOF: un error en el fix rompe scroll global | Media | El cambio es de 1 línea; revisión cuidadosa antes de commit. Regresión detectable inmediatamente via GP-1. |
| RC-7a: cambio inadvertido en comportamiento de activeId | Muy baja | Análisis en DM-E3-3 confirma impacto cero — `'equipo'` sigue reachable sin `acerca`/`roadmap`. |

---

## Orden de implementación recomendado

RC-7a (NavV2) primero — el cambio más simple y sin dependencias:
1. `NavV2.tsx`: eliminar `acerca` y `roadmap` del mapa.

Luego RC-8 sobre LenisProvider.tsx:
2. `LenisProvider.tsx` líneas 73–76: cambiar `return` por `if (!window.location.hash) return`.

**Los dos cambios pueden ir en un único commit** referenciando INC-001 Etapa 3.

---

## Diferido — RC-7b: conectar `activeId` al render (candidato a INC futuro)

**Decisión (2026-06-15):** RC-7b queda fuera del scope de INC-001 Etapa 3.

**Prerequisito:** RC-7a aplicado en Etapa 3 — mapa del observer limpiado (IDs muertos eliminados).

**Condición de activación:** cuando se decida el diseño completo del estado activo de los links (colores, transición, comportamiento en páginas internas). Abrir como `INC-002-navlinks-activeId`. Ver DM-E3-4 del DEPENDENCY_MAP para detalle de la interacción hover×active.

---

## Resumen ejecutivo

| Etapa | RCs | Archivos | Gate (RED→GREEN) | Estado |
|---|---|---|---|---|
| **Etapa 3** | RC-7a, RC-8 | `LenisProvider.tsx`, `NavV2.tsx` (2 archivos, 3 líneas) | GP-10 FPL a `/#proyectos` | ✅ Lista para VALIDATION DESIGN |
| **Descartado** | RC-6 (URL pollution #contacto) | — | — | ❌ Premisa incorrecta — bug no existe en codebase actual |
| **Diferido** | RC-7b (activeId render) | `NavV2.tsx` (render links) | GP pendiente (IntersectionObserver activo) | ⏸ INC futuro — prerequisito RC-7a ✓ en Etapa 3 |

**Test gate de Etapa 3:**

| Test | Estado | Destino |
|---|---|---|
| `GP-10: FPL a /#proyectos en sección correcta` | ❌ RED | Gate de Etapa 3 → GREEN con RC-8 |
