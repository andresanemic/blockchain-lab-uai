# VALIDATION DESIGN — Etapa 3 (RC-7a + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Fase VALIDATION DESIGN del REMEDIATION_WORKFLOW.md (track FULL).
> Traduce cada Golden Path a script Playwright. Demuestra RED actual antes de CONTROLLED IMPLEMENTATION.

---

## Hallazgo crítico durante esta fase — RC-6 descartado

Durante la demostración RED de GP-10B (RC-6), la verificación en browser real reveló que la premisa de ROOT_CAUSE_ANALYSIS_etapa3.md era incorrecta:

- **Premisa inválida:** "`app/certificados/page.tsx` no incluye ContactV2 — `id='contacto'` no existe en el DOM de `/certificados`"
- **Realidad:** `FooterV2.tsx:79` tiene `id="contacto"` en su root `<footer>`. `/certificados/page.tsx` incluye explícitamente `<FooterV2 />`. El elemento **siempre existe** en el DOM de `/certificados`.
- **Consecuencia:** Guard 2 siempre encuentra el target → `e.preventDefault()` siempre se llama → no hay URL pollution. RC-6 no tiene síntoma observable.

**Decisión (aprobada por el usuario):** RC-6 descartado del scope de Etapa 3. GP-10B eliminado. Scope final: RC-7a + RC-8 únicamente.

Lección documentada en `lore/testing.md`.

---

## Scripts creados / modificados en Etapa 3

| Archivo | Golden Path | Tests | Estado gate |
|---|---|---|---|
| `tests/golden-paths/gp10-nav-section-links.spec.ts` | GP-10 Nav links desde páginas internas | 1 | ❌ RED confirmado |

**Scripts de regresión sin cambios (etapas anteriores):**

| Archivo | Tests | Estado |
|---|---|---|
| `tests/golden-paths/gp1-scroll-restoration.spec.ts` | 2 | Estable (estado documentado en VALIDATION_DESIGN.md) |
| `tests/golden-paths/gp2-navbar-structure.spec.ts` | 7 | Estable |
| `tests/golden-paths/gp3-mobile-nav.spec.ts` | 5 | Estable |
| `tests/golden-paths/gp4-viewport-bleed.spec.ts` | 4 | Estable |
| `tests/golden-paths/gp5-no-flash.spec.ts` | 6 | Estable |

---

## Demostración RED — GP-10 (gate RC-8)

**Comando:** `npx playwright test tests/golden-paths/gp10-nav-section-links.spec.ts`

**Resultado (2026-06-15):**

```
1 failed
[chromium] › gp10-nav-section-links.spec.ts › GP-10: [gate RC-8] FPL a /#proyectos aterriza en sección correcta

Error: #proyectos.top=1440px debe ser < viewH=720px [pinSpacer=true, scrollY=2166] (RC-8)

expect(received).toBeLessThan(expected)
Expected: < 720
Received:   1440
```

**Interpretación de los datos:**
- `pinSpacer=true` — GSAP instaló el pin-spacer de BlockchainV2 correctamente a 1280px de viewport (desktop)
- `proyectosTop=1440px` — `#proyectos` fue desplazado 1440px por debajo del top del viewport por el pin-spacer
- `viewH=720px` — viewport de 720px de altura
- `scrollY=2166` — el browser auto-scroll llegó a la posición pre-spacer de `#proyectos`; el viewport quedó ahí mientras el spacer desplazaba la sección hacia abajo
- El `isFirstPath` guard (líneas 73–76 de LenisProvider.tsx) impidió que `lenis.scrollTo` corrija la posición → viewport apunta a Blockchain en lugar de Proyectos

**Cadena causal confirmada:**
```
FPL a /#proyectos
  → browser auto-scroll a #proyectos (scrollY=2166, antes de GSAP)
  → GSAP instala pin-spacer → #proyectos desplazado hacia abajo
  → useEffect([pathname]): isFirstPath=true → return SIN lenis.scrollTo
  → viewport en scrollY=2166 → ya no apunta a #proyectos → apunta a Blockchain
  → proyectosTop=1440px >> viewH=720px → RED ✓
```

---

## Estructura del test gate

**Archivo:** `tests/golden-paths/gp10-nav-section-links.spec.ts`

**Estrategia:**
- `page.goto('/#proyectos', { waitUntil: 'domcontentloaded' })` — evita que el hash-scroll (que revela imágenes lazy) bloquee la espera de load
- `waitForFunction('#proyectos && #blockchain', 8000)` — React hidratado y secciones en DOM
- `waitForTimeout(2500)` — GSAP se instala (<100ms); 400ms del fix ya habrían corrido si existiera el fix
- `evaluate()` → `proyectosTop`, `viewH`, `pinSpacerExists`, `scrollY`
- `expect(proyectosTop).toBeLessThan(viewH)` — RED en estado actual, GREEN post-fix

**Por qué `waitForTimeout` en lugar de `waitForFunction('.pin-spacer')`:**
- `waitForFunction('.pin-spacer')` sin catch causa timeout y cierre del contexto cuando el MCP browser usa viewport < 768px (isMobile=true → sin pin)
- `waitForTimeout(2500)` es agnóstico a la presencia del spacer — el assert final captura el estado real independientemente de si hay spacer o no

---

## Scope de CONTROLLED IMPLEMENTATION (resumen)

Dos cambios, dos archivos, tres líneas:

| # | Archivo | Línea | Cambio |
|---|---|---|---|
| 1 | `components/v2/NavV2.tsx` | 67–68 | Eliminar `acerca` y `roadmap` del mapa del observer |
| 2 | `components/v2/LenisProvider.tsx` | 76 | `return` → `if (!window.location.hash) return` |

**Gate de salida:** GP-10 pasa de RED a GREEN. GP-1 a GP-5 sin regresiones.

---

## Exit criteria

- [x] GP-10 creado en `tests/golden-paths/`
- [x] GP-10 demostrado en RED contra código actual (1440px > 720px — assertion falla correctamente)
- [x] RC-6/GP-10B descartados con nota explícita en REMEDIATION_PLAN y GOLDEN_PATHS
- [x] Lección documentada en `lore/testing.md` y `lore/index.md`
- [x] Scope final confirmado: RC-7a + RC-8 (2 archivos, 3 líneas)

**STOP — aprobación humana requerida antes de CONTROLLED IMPLEMENTATION.**
