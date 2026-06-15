# HISTORICAL AUDIT — Etapa 3 (RC-6 + RC-7 + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Basado en el HISTORICAL_AUDIT.md de Etapa 1 como baseline — no se repite lo ya cubierto.
> Esta fase se enfoca exclusivamente en los deltas relevantes para RC-6, RC-7 y RC-8.
> Toda la información es memoria histórica + revalidación contra código actual.

---

## Fuentes consultadas (delta sobre Etapa 1)

| Fuente | Relevancia para Etapa 3 |
|---|---|
| `reports/HISTORICAL_AUDIT.md` | Baseline completo — PA-4, RH-2 directamente relevantes |
| `reports/ROOT_CAUSE_ANALYSIS.md` | RC-6, RC-7 analizados; S-04 hipótesis B anticipó RC-8 |
| `reports/DEPENDENCY_MAP.md` | DM-5 mapea LenisProvider ↔ NavV2; tabla anchor click handler |
| `reports/REMEDIATION_PLAN.md` | RC-6, RC-7 en Etapa 2; Etapa 3 note (2026-06-15) |
| `PRE_WORKFLOW_LEADS.md` 🔴 #30 | Guard `defaultPrevented` — riesgo activo en cualquier cambio a handleAnchorClick |
| `lore/scroll.md` | "LenisProvider intercepta clicks de anchor que el componente ya manejó" |
| `components/v2/LenisProvider.tsx` | Revalidado: fix para timing RC-8 existe (líneas 85-97) pero solo para soft nav |
| `components/v2/NavV2.tsx` | Revalidado: RC-7 dead IDs + activeId never applied to render |

---

## A. Patrones recurrentes (nuevos o amplificados para Etapa 3)

---

### PA-E3-1 — Fix aplicado a un path de código, dejando el path simétrico sin corregir

**Fuentes:** `LenisProvider.tsx` líneas 74-97 + ROOT_CAUSE_ANALYSIS.md S-04 hipótesis B

**Descripción:** Un bug se corrige para el caso "camino normal" pero no para el caso "primer load". El código resultante tiene lógica correcta en un branch y lógica errónea en el branch simétrico.

**Revalidación en código actual:**
- `LenisProvider.tsx` líneas 85-88: el comentario documenta explícitamente el bug de RC-8 y su fix:
  ```
  // otherwise pin spacer shifts #proyectos position and scroll lands in Blockchain section.
  ```
  El timeout 400ms → `ScrollTrigger.refresh()` → `lenis.scrollTo(hash)` existe y funciona.
- `LenisProvider.tsx` líneas 73-76: `isFirstPath.current` hace early return antes de llegar al bloque del hash. El fix de RC-8 ya existe pero es dead code para full page loads.
- **Este es el patrón más claro de esta auditoría:** RC-8 ya está resuelto para soft navigation; el desarrollador olvidó el caso FPL. El fix necesario es cirúrgico: mover o duplicar el handler de hash antes del early return de `isFirstPath`.

**Severidad:** Alta. El código tiene documentación del bug y del fix en el mismo archivo — pero el fix no se activa en el path donde ocurre el síntoma.

---

### PA-E3-2 — Dead state: estado calculado que nunca se aplica al render

**Fuentes:** `NavV2.tsx` DM-4 análisis + ROOT_CAUSE_ANALYSIS.md S-08

**Descripción:** Un `useState` se calcula correctamente pero el valor nunca se usa en el JSX. El sistema de estado activo del nav está implementado a medias — calcula qué sección es activa, pero ningún elemento del nav usa ese valor para cambiar su apariencia.

**Revalidación en código actual:**
- `NavV2.tsx` línea 28: `const [activeId, setActiveId] = useState<string | null>(null)`
- `NavV2.tsx` líneas 63-80: IntersectionObserver actualiza `activeId` correctamente cuando las secciones cruzan el viewport.
- Ninguna línea del JSX (270-370) referencia `activeId` como condición de estilo o clase.
- `app/globals.css` línea ~353: clases `.nav-link` y `.nav-link.is-active` existen pero **ningún elemento del nav las usa** (usan inline styles).
- El observer también registra IDs `acerca` y `roadmap` que no existen en el DOM de ninguna página — dead observation.

**Severidad:** Media. No produce un bug visual activo (el nav simplemente nunca muestra un link como activo), pero es código que mantiene un observer y estado sin beneficio.

---

## B. Regresiones históricas con riesgo activo para Etapa 3

---

### RH-E3-1 🔴 — Guard `defaultPrevented` en LenisProvider es un invariante frágil

**Referencia:** `PRE_WORKFLOW_LEADS.md` 🔴 #30 · `HISTORICAL_AUDIT.md` RH-2

**Riesgo específico para Etapa 3:** El fix de RC-6 requiere añadir `e.preventDefault()` dentro de `handleAnchorClick` cuando `!target`. Cualquier modificación de `handleAnchorClick` tiene riesgo de afectar el guard `if (e.defaultPrevented) return` que protege la interacción "Colaborar" + overlay de HeroV2.

**Análisis del riesgo real:**
- El fix de RC-6 opera en la rama `if (!target) return` → añadir `e.preventDefault()` ahí.
- Esa rama se ejecuta DESPUÉS de `if (e.defaultPrevented) return` (línea 32).
- El HeroV2 "Colaborar" llama `e.preventDefault()` ANTES de que llegue a `handleAnchorClick` → el guard de línea 32 lo descarta antes de llegar a la rama de RC-6.
- **Conclusión: el fix de RC-6 no puede romper el guard del HeroV2**, ya que opera en branches distintos. El riesgo es BAJO para RC-6 específicamente — pero cualquier otro cambio en la función que reordene las condiciones sí es riesgo ALTO.

**Validación requerida:** tras el fix de RC-6, correr el test de GP-5 (flash en carga) para confirmar que "Colaborar" en la landing sigue funcionando.

---

### RH-E3-2 — Fix de timing RC-8 depende de un timeout de 400ms

**Referencia:** `LenisProvider.tsx` líneas 86-97

**Descripción:** El fix existente para el timing de RC-8 (soft nav) usa `setTimeout(400)` antes de `ScrollTrigger.refresh()`. El valor 400ms es un "número mágico" — asume que GSAP + React tienen 400ms para configurar todos los ScrollTriggers de la nueva página (incluyendo el pin de BlockchainV2) antes de llamar refresh.

**Riesgo:** Si en el futuro hay más componentes con ScrollTrigger pesados, 400ms puede no ser suficiente. En el otro extreme, si la página es simple, 400ms es tiempo de espera innecesario.

**Para RC-8 (FPL):** el mismo timeout de 400ms debería ser suficiente, ya que el contexto es idéntico (esperar a que GSAP configure los pins antes de hacer scroll). El riesgo de este fix es el mismo que ya está aceptado en el path de soft nav.

---

## C. Áreas frágiles específicas de Etapa 3

---

### AF-E3-1 — LenisProvider.tsx `handleAnchorClick`: tres tipos de anchors, lógica de branching compleja

**Evidencia:** `LenisProvider.tsx` líneas 31-52

```
a[href^="#"]  → si target existe → scroll suave
              → si target null   → return (sin preventDefault) [BUG RC-6]

a[href^="/#"] + pathname === '/' → convierte a hash → scroll suave
              + pathname !== '/' → no interceptado [correcto — FPL]
```

**Fragilidad:** La función tiene tres ramas implícitas no documentadas. Un test o cambio que olvide uno de los tres casos puede introducir regresiones silenciosas. Cualquier nuevo tipo de link en el nav (ej. `href="/blog"` sin hash) no entraría en ninguna rama — correcto por omisión, pero no evidente.

---

### AF-E3-2 — `isFirstPath.current` controla dos responsabilidades distintas

**Evidencia:** `LenisProvider.tsx` líneas 73-121

`isFirstPath.current = true` en el primer `useEffect([pathname])` cumple dos funciones:
1. Evitar scroll restoration en la carga inicial (correcto — no hay posición guardada).
2. (inadvertidamente) Evitar el hash handling en la carga inicial (incorrecto — RC-8).

Si el fix de RC-8 separa estos dos comportamientos (handle hash incluso en first path, pero skip el scroll restoration), la lógica de `isFirstPath` se vuelve más explícita pero más compleja.

---

## D. Hallazgo crítico: el fix de RC-8 ya existe en producción para soft nav

**Archivo:** `LenisProvider.tsx` líneas 82-97 con comentario en 85-88.

El comentario explica el problema exacto y documenta la solución. El fix está completo y funciona para navegaciones client-side. La única razón por la que no funciona en FPL es `isFirstPath.current` (línea 73). 

**Implicación para el plan de remediación:** RC-8 es el fix de menor scope de este ciclo — es una modificación quirúrgica de una condición en una función que ya tiene la lógica correcta. No requiere inventar nada nuevo; solo extender el handler existente al caso FPL.

---

## E. Resumen ejecutivo

| Categoría | Ítems | Críticos para Etapa 3 |
|---|---|---|
| Patrones recurrentes (nuevos) | 2 (PA-E3-1, PA-E3-2) | PA-E3-1 (fix parcial) |
| Regresiones históricas con riesgo | 2 (RH-E3-1, RH-E3-2) | RH-E3-1 🔴 (guard defaultPrevented) |
| Áreas frágiles | 2 (AF-E3-1, AF-E3-2) | AF-E3-1 (branching de handleAnchorClick) |
| Hallazgos críticos | 1 (Sección D) | Fix de RC-8 ya existe — solo necesita activarse en FPL |

**Mapa síntoma → histórico para Etapa 3:**

| Síntoma | Causa raíz | Evidencia histórica |
|---|---|---|
| URL pollution `#contacto` | RC-6 (preventDefault faltante) | PA-4 (Etapa 1) + RH-E3-1 (riesgo guard) |
| Nav link activo nunca se ve | RC-7 (activeId dead state) | PA-E3-2 + AF-3 (Etapa 1) |
| Aterriza en sección incorrecta (FPL) | RC-8 (isFirstPath bypasea hash handling) | PA-E3-1 + Sección D (fix ya existe para soft nav) |

---

## Exit criteria

- [x] Patrones recurrentes con referencia a evidencia citada
- [x] Regresiones históricas con riesgo activo identificado
- [x] Áreas frágiles mapeadas
- [x] Hallazgo crítico documentado (fix RC-8 ya existe en el código)
- [x] Riesgo de RH-E3-1 analizado: fix RC-6 opera en branch distinto al del guard defaultPrevented → bajo riesgo de regresión en HeroV2

**STOP — aprobación humana requerida antes de SYSTEM INVENTORY.**
