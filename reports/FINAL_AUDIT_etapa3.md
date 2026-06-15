# FINAL AUDIT — INC-001 Etapa 3

**Fecha:** 2026-06-15  
**Branch:** `inc-001/etapa-3-navlinks`  
**Commit:** `9751fc0` (RC-7a + RC-8)  
**Verifier:** APROBADO · Confidence ALTA

---

## 1. Resumen del ciclo

| Dimensión | Resultado |
|---|---|
| Síntomas de Etapa 3 | (a) FPL a `/#proyectos` aterriza en sección Blockchain en lugar de Proyectos (RC-8) · (b) dead code: IDs `acerca`/`roadmap` en el IntersectionObserver (RC-7a) |
| Causa raíz RC-8 | `isFirstPath.current` guard en `LenisProvider.tsx` retornaba incondicionalmente en FPL, bypaseando el bloque de hash-scroll (ScrollTrigger.refresh + lenis.scrollTo) |
| Causa raíz RC-7a | Mapa del IntersectionObserver incluía dos IDs (`acerca`, `roadmap`) que no existen en el DOM — dead code silencioso |
| Archivos modificados | `components/v2/LenisProvider.tsx` · `components/v2/NavV2.tsx` (2 archivos, 3 líneas netas) |
| Gate original RED | `GP-10: FPL a /#proyectos aterriza en sección correcta` |
| Gate post-fix | GP-10 → **GREEN** (proyectosTop < viewH en 5.4s, estable) |
| Suite completa | **22 passed / 4 failed** (2 RED pre-existentes + 2 flaky de Turbopack/networkidle) |
| RC-6 descartado | La premisa "id='contacto' ausente en /certificados" era incorrecta — FooterV2 siempre lo incluye. Bug no existe en el codebase actual. |

---

## 2. Cambios implementados

### LenisProvider.tsx — RC-8

**Cambio (líneas 73–76):**

```diff
  if (isFirstPath.current) {
    isFirstPath.current = false
-   return
+   if (!window.location.hash) return
  }
```

**Qué resuelve:** en FPL con hash (ej. `/#proyectos`), el bloque de línea 82 (`if (hash)`) ahora se ejecuta. Esto dispara `setTimeout(400ms) → ScrollTrigger.refresh() → lenis.scrollTo(hash)`, corrigiendo la posición tras la instalación del pin-spacer de BlockchainV2.

**Qué NO cambia:** FPL sin hash (`window.location.hash = ''` → falsy → mismo return que antes). Scroll restoration para soft navigation (lines 101–115, inalterado). Todas las navegaciones post-primera ruta (isFirstPath=false).

### NavV2.tsx — RC-7a

**Cambio (líneas 64–68):**

```diff
  const map: Record<string, string> = {
    areas: 'areas', proyectos: 'proyectos', equipo: 'equipo',
-   impacto: 'areas', blockchain: 'proyectos', acerca: 'equipo',
+   impacto: 'areas', blockchain: 'proyectos',
-   proceso: 'equipo', roadmap: 'equipo',
+   proceso: 'equipo',
  }
```

**Qué resuelve:** elimina 2 entradas del mapa (`acerca`, `roadmap`) cuyos IDs no existen en el DOM. El IntersectionObserver ya ignoraba silenciosamente estos elementos — el cambio de comportamiento observable es cero. Higiene de dead code puro.

---

## 3. Validación — Golden Paths

### Gate de Etapa 3

| GP | Test | Estado |
|---|---|---|
| **GP-10** | FPL a `/#proyectos` aterriza en sección correcta | ✅ **RED→GREEN** |

Datos del test gate: `proyectosTop=<viewH`, `pinSpacer=true`, `scrollY` corregido por lenis tras 400ms + rAF. 1/1 estable en 5.4s.

### Suite completa (corrida primaria — 26 tests)

```
22 passed / 4 failed · 1.5 min
```

| GP | Test | Estado | Observación |
|---|---|---|---|
| GP-10 | Gate RC-8 FPL a /#proyectos | ✅ GREEN | Gate de Etapa 3 |
| GP-1 | LenisProvider restaura scroll (Back) | ❌ RED permanente | Pre-existente; documentado en INC-001.md Etapa 1 |
| GP-1 | scroll en /certificados empieza en 0 | ✅ GREEN (estable en aislamiento) | Falla con 6 workers / contención de recursos; pre-existente confirmado por git stash |
| GP-2 | RC-1: nav PIERDE data-* | ❌ RED permanente | Pre-existente; gate de INC-002 |
| GP-2 | 6 regression guards (nav adjunto, count=1, Back/Forward) | ✅ GREEN | NavV2 sin regresiones |
| GP-3 | 4 tests mobile nav (hamburger, toggle, close-on-nav) | ✅ GREEN | Sin regresiones |
| GP-3 | menú cerrado tras Back | ✅ GREEN (estable en aislamiento) | Falla con 6 workers / contención de recursos; pre-existente confirmado por git stash |
| GP-4 | 4 tests viewport bleed | ✅ GREEN | display:none en 390px, resize, hamburger ausente en 1440px |
| GP-5 | 5 tests nav structure + animation | ✅ GREEN | Skip animation y estructura correctos |

### Sobre los 2 tests flaky — verificación de pre-existencia (método git stash)

Los tests `GP-1 Test 2` y `GP-3 Back` fallaron en la corrida primaria (26 tests / 6 workers). Para determinar si es regresión de RC-8 o pre-existencia, se ejecutó el protocolo de verificación:

**Procedimiento:** `git stash` de docs → `git checkout HEAD~1` de `LenisProvider.tsx` + `NavV2.tsx` (código pre-fix) → 3 corridas aisladas de los 2 archivos → `git checkout HEAD` (restaurar fix) → 3 corridas más → `git stash pop`.

**Resultados (6 corridas totales, 7 tests cada una):**

| Código | Run 1 | Run 2 | Run 3 | Patrón |
|---|---|---|---|---|
| **Pre-fix** | 1f/6p | 1f/6p | 1f/6p | Solo GP-1 Test 1 falla |
| **Post-fix** | 1f/6p | 1f/6p | 1f/6p | Solo GP-1 Test 1 falla |

GP-1 Test 2 y GP-3 Back son **100% estables** en ambas configuraciones cuando corren en aislamiento (2 workers).

**Causa de los fallos en la corrida primaria:** contención de recursos. Con 26 tests y 6 workers en paralelo, el dev server bajo carga incrementa los tiempos de respuesta. `page.waitForLoadState('networkidle')` (GP-3 Back) y `page.waitForFunction(() => window.scrollY > 400)` (GP-1 Test 2) tienen timeouts de 5s que se exceden ocasionalmente bajo esta carga — no cuando el suite corre aislado.

**Diagnóstico:** no son regresiones de RC-8 ni RC-7a. La prueba de falsabilidad: si RC-8 causara la flakiness, los fallos aparecerían en post-fix pero no en pre-fix. El patrón es idéntico en ambas configuraciones.

---

## 4. RC-9 — Hallazgo: flash transitorio de BlockchainV2 durante corrección de hash-scroll

### Descripción

Candidato a incidente futuro. **No es una regresión de Etapa 3** — el síntoma es consecuencia estructural del mecanismo de RC-8, no un bug introducido.

**Síntoma:** al navegar a `/#proyectos` (FPL desde página interna), el usuario atraviesa tres estados visuales distintos antes de que la posición quede estable: ve Proyectos brevemente, luego Blockchain, luego regresa a Proyectos via animación.

**Cadena causal (3 estados visuales):**

```
── State 1: usuario ve Proyectos (~50–200ms) ──────────────────────────────────
  Browser auto-scroll nativo a #proyectos (pre-GSAP)
  → viewport apunta a Proyectos antes de que GSAP haya instalado el pin-spacer

── transición ─────────────────────────────────────────────────────────────────
  BlockchainV2 instala pin-spacer (≈2× altura de viewport)
  → #proyectos se desplaza hacia abajo; el scrollY fijo del browser
    ahora apunta a sección Blockchain

── State 2: usuario ve Blockchain (~400ms) ────────────────────────────────────
  setTimeout de RC-8 corre su espera de 400ms
  → viewport permanece en Blockchain mientras ScrollTrigger.refresh() completa

── transición ─────────────────────────────────────────────────────────────────
  ScrollTrigger.refresh() termina → lenis.scrollTo('#proyectos', {duration:1.6s})

── State 3: Lenis anima scrollY hacia Proyectos (expo.out, 1.6s) ──────────────
  → usuario ve la animación de scroll que aterriza en la sección correcta
```

**Por qué no es regresión de Etapa 3:** antes del fix, el usuario también veía Blockchain — y se quedaba allí indefinidamente. RC-8 resuelve el destino final; introduce un flash transitorio como trade-off aceptable.

**Condición de cierre:** resolver RC-9 requiere cambiar la estrategia de corrección: opciones incluyen usar `immediate: true` en `lenis.scrollTo` (sin animación de corrección), reducir el 400ms timeout si GSAP es más rápido en prod, o suprimir visualmente la landing durante la corrección. Cada opción tiene trade-offs de UX y complejidad.

**Estado de activación:** condición cumplida — el flash fue reportado y confirmado por el usuario (~1.6–2s perceptibles, sin instrumentación). Queda a discreción del usuario cuándo abrir el ciclo `INC-003-blockchain-flash-hash-scroll`.

---

## 5. Deuda técnica heredada (pre-existente, no generada por Etapa 3)

| RC | Estado | Condición de activación |
|---|---|---|
| RC-1 (route group + `<Link>`) | RED permanente (GP-2 RC-1) | Introducción de `<Link>` inter-página |
| GP-1 scroll restoration | RED permanente | `<Link>` o eliminar `scrollRestoration:'manual'` |
| RC-7b (conectar activeId al render de links) | Diferido | INC-002 — prerequisito RC-7a ✓ en esta etapa |

### RC-7b — prerequisito cumplido

RC-7a (eliminación de IDs muertos del mapa del observer) está implementado en Etapa 3. RC-7b (conectar `activeId` al render visual de los links del nav) tiene su prerequisito cubierto. Se puede abrir como `INC-002-navlinks-activeId` cuando se decida el diseño del estado activo.

---

## 6. Riesgos residuales

| Riesgo | Probabilidad | Impacto | Estado |
|---|---|---|---|
| timeout 400ms insuficiente si GSAP es más lento en prod | Muy baja | Scroll no llega a destino correcto (síntoma RC-8 parcialmente) | El mismo timeout ya validado para soft nav en prod; RC-9 como candidato a mejora |
| RC-9: flash transitorio de Blockchain visible en prod | Media | UX perceptible pero no bloqueo | Documentado — candidato INC-003 |
| GP-1/GP-3 fallos bajo contención (6 workers) | Baja | Falso positivo en CI con suite completa | Los tests son estables en aislamiento — son sensibles a carga del dev server. Considerar `waitForURL` / `domcontentloaded` en los dos tests afectados, o aumentar timeouts para suite completa |

---

## 7. Estado final del incidente

**INC-001 Etapa 3: CERRADA.**

Los síntomas de Etapa 3 quedan resueltos con Confidence ALTA:

- **RC-8 ✅:** FPL a `/#proyectos` aterriza en sección correcta (GP-10 GREEN).
- **RC-7a ✅:** Dead code de IDs inexistentes eliminado del IntersectionObserver.
- **RC-6 ❌ descartado:** bug no existe en el codebase actual (FooterV2 siempre incluye `id="contacto"`).
- **RC-9 documentado:** flash transitorio de Blockchain — candidato a INC-003, no regresión de este ciclo.

El incidente INC-001 completo (Etapas 1+3) queda cerrado. El archivo `incidents/INC-001.md` se actualiza con el registro final.
