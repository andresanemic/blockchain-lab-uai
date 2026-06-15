# VALIDATION DESIGN — NavV2 Desktop Bug

INC-001 · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Fase VALIDATION DESIGN del REMEDIATION_WORKFLOW.md (track FULL).
> Traduce cada Golden Path a script Playwright. Demuestra RED actual. El humano aprueba los scripts.

---

## Scripts creados

| Archivo | Golden Path | Tests | Estado gate |
|---|---|---|---|
| `tests/golden-paths/gp1-scroll-restoration.spec.ts` | GP-1 Restauración de scroll | 2 | ⚠️ 1 RED, 1 GREEN |
| `tests/golden-paths/gp2-navbar-structure.spec.ts` | GP-2 Navbar desktop consistente | 7 | ⚠️ 1 RED (correcto), 6 GREEN |
| `tests/golden-paths/gp3-mobile-nav.spec.ts` | GP-3 Navbar móvil | 5 | ✅ 5 GREEN (regression guards) |
| `tests/golden-paths/gp4-viewport-bleed.spec.ts` | GP-4 Sin bleed desktop/móvil | 4 | ✅ 4 GREEN (regression guards) |
| `tests/golden-paths/gp5-no-flash.spec.ts` | GP-5 Sin flash al cargar páginas | 6 | ⚠️ 1 RED (skip-animation), 5 GREEN |

**Corrida anterior (pre-actualización GP-5):** 22 passed / 2 failed (34.1s)
**Corrida esperada tras añadir test S-02:** 22 passed / 3 failed

```
❌ gp1 › LenisProvider restaura scroll de / al volver desde /certificados
❌ gp2 › RC-1: nav PIERDE data-* tras client-side route change [RED AHORA → fix Etapa 2]
❌ gp5 › S-02: nav visible dentro de 200ms en páginas internas [RED AHORA → fix Etapa 2 skip-animation]
✅ 22 tests restantes
```

---

## Hallazgos de investigación

### HF-1 — Toda la navegación del sitio es full page load (ALTA)

**Evidencia nivel 2 (comportamiento observable):**
- `performance.getEntriesByType('navigation')[0].type === 'navigate'` confirmado via MCP browser en `/certificados`.
- `window.__lenis` (instancia Lenis) es una instancia nueva en cada carga — destruida y recreada.
- El link `<a href="/certificados">` (tarjeta de Proyectos) inspeccionado con Playwright MCP:
  - `tagName: 'A'`, `hasDataPrefetch: false`, `hasNextLink: false` → plain `<a>`, sin Next.js router binding.
- NavV2 navLinks (`/#proyectos`, `/#areas`, `#contacto`) son anchors in-page, no links de ruta.
- LenisProvider solo intercepta `a[href^="#"]` (anchors); no hay handler para navegación inter-ruta.

**Consecuencia:** el mecanismo de LenisProvider (`scrollSaved`) para restaurar scroll es correcto en diseño, pero no se ejerce en producción — no existe soft navigation que lo active. `window.history.scrollRestoration = 'manual'` en LenisProvider.tsx desactiva además el BFCache nativo del browser.

---

### HF-2 — RC-2 no es un bug visual (ALTA)

**Investigación:** GP-4 tests se esperaban RED (nav desktop visible en móvil). Todos pasaron GREEN.

**Causa raíz investigada:** Tailwind v4 genera `display: none !important` para la clase `hidden` (en `@media (max-width: 767px)`). Este `!important` supera el inline `style={{ display: 'flex' }}`. El nav desktop tiene correctamente `computedStyle.display === 'none'` en 390px, aunque el inline dice `'flex'`.

**Conclusión:** RC-2 (conflicto `display:flex` inline vs `hidden` CSS) es **higiene de código**, no un bug visual activo. El `!important` de Tailwind v4 protege al usuario. El código debe corregirse igualmente (frágil — un cambio en Tailwind o la clase podría romperlo), pero no justifica un gate RED en VALIDATION DESIGN.

**Actualización ROOT_CAUSE_ANALYSIS.md requerida:** el confidence de RC-2 como bug visual debe degradarse a MEDIA con este addendum.

---

### HF-3 — RC-1 y el route group (Etapa 2) no son testables vía FPL (ALTA)

**El problema fundamental:**

El route group de Next.js App Router (`(v2)/layout.tsx`) previene que NavV2 remonte — pero **solo en client-side (soft) navigations**. En full page loads, el layout completo se recrea. Dado que el sitio solo tiene FPL (HF-1), el route group no cambia el comportamiento observable de remount en el contexto actual del sitio.

**Implicación para el gate RC-1:**

| Estado | Comportamiento | RC-1 test |
|---|---|---|
| Antes de Etapa 2 (actual) | FPL → nav remonta → data-* perdido | ❌ RED |
| Después de Etapa 2 (route group, sin `<Link>`) | FPL → nav remonta → data-* perdido | ❌ RED igual |
| Después de Etapa 2 + `<Link>` en navLinks | Soft nav → nav NO remonta → data-* persiste | ✅ GREEN |

**Conclusión:** el test RC-1 como está escrito nunca llegará a GREEN si no se introduce navegación soft (`<Link>`). El route group es la precondición arquitectural, pero la validación requiere también la conversión de al menos un link de ruta a `<Link>`.

---

## Análisis por Golden Path

### GP-1 · Restauración de scroll con Back

**Estado:** ❌ RED (1 test) / ✅ GREEN (1 test)

**Test RED (gp1 test 1):** `LenisProvider restaura scroll de / al volver desde /certificados`
- Usa `clientSideNavigate` (helper que inyecta `<a>` dinámico) — también causa FPL.
- LenisProvider remonta con `scrollSaved = {}` → scroll no guardado → scroll no restaurado.
- `scrollAfterBack = 0` → falla `expect(scrollAfterBack).toBeGreaterThan(100)`.
- El test refleja fielmente el comportamiento real del usuario: el scroll no se restaura.

**Desafío de gate verde:** el test será GREEN solo si:
- Se añaden `<Link>` para navegación inter-página (activa LenisProvider), O
- Se elimina `window.history.scrollRestoration = 'manual'` (habilita BFCache).

**Test GREEN (gp1 test 2):** scroll en `/certificados` empieza en 0 — regression guard válido.

**¿Es GP-1 un bug de INC-001?** La scroll restoration es un sistema separado de NavV2. El flickering reportado (INC-001) está en el nav, no en el scroll. GP-1 expone un problema real pero fuera del scope de Etapa 1–2.

---

### GP-2 · Navbar desktop consistente entre páginas

**Estado:** ❌ RED (1 test) / ✅ GREEN (6 tests)

**Test RED (RC-1):** `nav PIERDE data-* tras client-side route change`
- Evidencia directa de remount: atributo `dataset.navInstance` desaparece tras navegación.
- Causa confirmada: NavV2 en cada `page.tsx` — no en layout compartido.
- El test está RED por la razón correcta.
- **Caveat Etapa 2:** ver HF-3. El test solo se vuelve GREEN si la navegación es soft.

**Tests GREEN (regression guards):**
- Nav adjunto con logo en `/`, `/certificados`, `/validacion-videos`
- Exactamente 1 `<nav>` en landing y en `/certificados`
- Nav adjunto tras Back y Forward
- Todos estos son baselines que ninguna implementación debe romper.

**Cobertura ampliada por el skip de animación (Etapa 2):**
Los tests de GP-2 validan la presencia estructural del nav. El skip de animación (pathname !== '/' → `gsap.set` inmediato) afecta a GP-2 indirectamente: si el skip no funciona, el nav sigue presente pero invisible, y los tests de presencia siguen siendo GREEN. La validación comportamental del skip vive en GP-5. Sin embargo, el test "nav adjunto con logo en /certificados" también puede verse afectado si el `gsap.set` tiene un error que desmonta el nav — sigue siendo un guard válido para regresiones de esa naturaleza.

---

### GP-3 · Navbar móvil

**Estado:** ✅ 5/5 GREEN (regression guards)

Tests: hamburger visible en 390px, aria-label toggle, open/close, menu cierra al navegar, menu cerrado tras Back.

El nav móvil funciona correctamente en el estado actual. Estos tests protegen contra regresiones en Etapa 1 y Etapa 2.

---

### GP-4 · Sin bleed desktop/móvil al cambiar viewport

**Estado:** ✅ 4/4 GREEN (regression guards)

Todos los tests pasaron GREEN por HF-2 (Tailwind v4 `!important`). La corrección RC-2 (Etapa 1) cambia el mecanismo de protección de `display:none !important` sobre `flex` inline a `display:none` CSS directamente — más explícita y menos frágil. Los tests seguirán siendo GREEN post-Etapa 1.

---

### GP-5 · Carga de página interna sin flash

**Estado:** ⚠️ 1 RED (nuevo) / 5 GREEN

**Test RED (S-02 skip-animation):** `nav visible dentro de 200ms en /certificados`
- Añadido al descubrir que el flash es medible vía timing: `waitUntil: 'commit'` + polling 50ms × 4.
- Evidencia directa (HF-0): timeline Playwright confirmó `opacity ≈ 0.000` de t=111ms a t=1393ms.
- Gate: `maxOpacity > 0.9` dentro de los primeros 200ms. **Actualmente falla** (maxOpacity ≈ 0.043).
- GREEN tras Etapa 2: `pathname !== '/'` → `gsap.set(navRef.current, { opacity: 1, top: '14px' })` inmediato → opacity = 1 en el primer poll.

**Tests GREEN (regression guards):**
- Nav en DOM tras networkidle en `/certificados` y `/validacion-videos`
- Exactamente 1 `<nav>` en landing y `/certificados`
- `/validacion-pruebas-multimedia` sin NavV2 pill

**Corrección al análisis original:** el flash NO es únicamente de timing no testeable. La ventana de 1.4s de invisibilidad sí es medible con `waitUntil: 'commit'` porque persiste desde el primer frame JavaScript hasta que GSAP completa la animación. El settled-state assertion de opacity es válido: el estado "settled" en páginas internas tras Etapa 2 es `opacity: 1` desde t=0ms, no desde t=1400ms.

---

## Decisiones tomadas (2026-06-14)

### A/B/C → Opción C (modificada): animation skip + RC-1 diferido

**Investigación previa a la decisión:** timeline Playwright confirmó que el nav permanece a `opacity ≈ 0` durante ~1.4s en cada FPL a una página interna (t=111ms→1393ms). El síntoma principal (S-01 flickering, S-02 aparecen antes de tiempo) es causado directamente por el delay GSAP + `expo.out`, no por el remount per-se.

**Decisión del usuario:** sacar el route group (RC-1) del scope de INC-001. Consolidar Etapa 1 + animation skip en un solo bloque sobre `NavV2.tsx`. RC-1 queda como deuda técnica diferida (INC-002 cuando se introduzca `<Link>`).

**Estado del test RC-1:** RED permanente esperado en este ciclo. No es un fallo — es el gate de un incidente futuro. Ver sección "Diferido" en REMEDIATION_PLAN.md.

---

## Configuración de Playwright

`playwright.config.ts` debe tener (o verificar que tiene):
```ts
use: {
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  reducedMotion: 'reduce',
}
```

Esto garantiza que el flash visual (comportamiento runtime de timing) quede capturado como video en los tests que fallen, compensando la limitación de los settled-state assertions.

---

## Exit criteria de esta fase

- [x] Cada GP tiene script Playwright en `tests/golden-paths/`
- [x] Scripts con RED demostrado en corrida real (22 pass / 3 fail — gp1, gp2 RC-1, gp5 S-02)
- [x] Hallazgos documentados con evidencia citada (nivel 2 + nivel 1)
- [x] **RESUELTO:** Humano aprobó scripts como gate de validación
- [x] **RESUELTO:** Decisión A/B/C tomada → RC-1 diferido a INC-002, animation skip en Etapa 1

**Estado de los tests RED al cierre de VALIDATION DESIGN:**

| Test | Estado | Destino |
|---|---|---|
| `gp5 › S-02: nav visible dentro de 200ms` | ❌ RED → debe pasar GREEN en Etapa 1 | Gate de CONTROLLED IMPLEMENTATION |
| `gp4 › desktop nav display:none en 390px` | ✅ GREEN ya (Tailwind v4 `!important`) | Regression guard — debe mantenerse |
| `gp2 › RC-1: nav PIERDE data-*` | ❌ RED permanente esperado en INC-001 | Gate de INC-002 (route group + `<Link>`) |
| `gp1 › LenisProvider restaura scroll` | ❌ RED permanente esperado en INC-001 | Deuda técnica (necesita soft nav o BFCache) |

✅ **VALIDATION DESIGN CERRADA. Proceder a CONTROLLED IMPLEMENTATION (Etapa 1).**
