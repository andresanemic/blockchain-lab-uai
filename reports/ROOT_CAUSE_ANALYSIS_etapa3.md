# ROOT CAUSE ANALYSIS — Etapa 3 (RC-6 + RC-7 + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Delta sobre `ROOT_CAUSE_ANALYSIS.md` de Etapa 1.
> RC-6 y RC-7 ya tenían hipótesis en Etapa 1 con Confidence MEDIA/ALTA.
> Este documento eleva a ALTA con evidencia de suficiencia y separa RC-7a/7b.
> RC-8 es nuevo — análisis completo desde cero.

---

## Síntomas de Etapa 3

| # | Síntoma | RC asignada |
|---|---|---|
| S-04b | URL queda con `#contacto` appended sin navegación desde páginas internas | RC-6 |
| S-08b | Links del nav nunca muestran cuál sección está activa | RC-7b |
| S-N1 | Navegar a `/#proyectos` desde página interna aterriza en sección incorrecta | RC-8 |

---

## RC-6 — `e.preventDefault()` faltante cuando querySelector retorna null

### Causa raíz

`LenisProvider.tsx` línea 49: `if (!target) return` sin llamar `e.preventDefault()` antes. Cuando el usuario hace click en `href="#contacto"` desde una página donde el elemento `#contacto` no existe en el DOM, el handler retorna sin prevenir el comportamiento nativo del browser. El browser procesa el click y appende el hash a la URL.

### Evidencia de necesidad

- **Nivel 1 (código):** `LenisProvider.tsx` línea 49 — ausencia de `e.preventDefault()` antes del `return`. La línea 50 (que sí llama `e.preventDefault()`) solo se alcanza cuando `target !== null`.
- **Nivel 1 (código):** `NavV2.tsx` líneas 246 (CTA desktop) y 350 (CTA móvil) — ambos usan `href="#contacto"`.
- **Nivel 1 (código):** `app/certificados/page.tsx` no incluye `ContactV2` — el elemento `id="contacto"` no existe en el DOM de `/certificados`. Verificado en ROOT_CAUSE_ANALYSIS.md Etapa 1 ("sin sección #contacto en su DOM").

### Evidencia de suficiencia

La cadena causal desde el click hasta el URL pollution es lineal sin ramificaciones alternativas:

```
click en "#contacto" desde /certificados
  → Guard 0 (defaultPrevented): false → pasa
  → Branch 1 (a[href^="#"]): link encontrado, hash = "#contacto"
  → Guard 1 (!link || !hash || hash==='#'): pasa
  → Guard 2: querySelector("#contacto") = null → if (!target) return  ← punto de fuga
  → Browser procesa el click → appende "#contacto" a la URL
```

No existe ningún otro mecanismo entre el `return` de línea 49 y la acción del browser que pueda interceptar o corregir el URL pollution. Añadir `e.preventDefault()` en línea 49 es condición suficiente para eliminar el síntoma: el browser no recibirá el evento sin `preventDefault` y no modificará la URL.

**Interacción con Guard 0 (RH-E3-1):** el HeroV2 "Colaborar" llama `e.preventDefault()` en su propio handler antes de que el evento llegue a `document`. Cuando eso ocurre, Guard 0 en línea 32 descarta el evento antes de llegar a Guard 2. El fix de RC-6 opera exclusivamente en Guard 2 — los dos branches son mutuamente excluyentes en todos los casos conocidos.

**Confidence: ALTA.** Evidencia nivel 1 en tres puntos independientes (handler, CTA, DOM de certificados). La cadena causal es código puro, sin inferencia de comportamiento runtime.

---

## RC-8 — `isFirstPath` guard bypasea el hash handling en Full Page Load

### Causa raíz

`LenisProvider.tsx` líneas 73–76: el bloque `if (isFirstPath.current)` hace early return en la primera ejecución de `useEffect([pathname])`. Esto bypasea el bloque `if (hash)` de líneas 82–99, que es el único mecanismo que llama `ScrollTrigger.refresh()` antes de `lenis.scrollTo(hash)`. En FPL, el browser hace auto-scroll nativo al hash antes de que GSAP instale el pin-spacer de BlockchainV2. Cuando el pin-spacer se instala, desplaza las posiciones del documento — el viewport permanece en la posición del auto-scroll nativo, que ya no corresponde a la sección correcta.

### Evidencia de necesidad

- **Nivel 1 (código):** `LenisProvider.tsx` líneas 73–76 — `isFirstPath.current = true → return` en la primera ejecución del efecto. El bloque `if (hash)` de línea 82 nunca se alcanza en esa ejecución.
- **Nivel 1 (código):** `LenisProvider.tsx` líneas 85–88 — el comentario en el código documenta el síntoma exacto y la causa: *"Wait for new page's GSAP (including BlockchainV2 pin) to fully set up, then refresh trigger positions BEFORE scrolling — otherwise pin spacer shifts #proyectos position and scroll lands in Blockchain section."* El desarrollador identificó el problema y lo resolvió para soft nav; el caso FPL no fue cubierto.
- **Nivel 2 (comportamiento):** reportado por el usuario — click en "Proyectos" desde `/certificados` lleva a la landing pero aterriza en sección "Blockchain".
- **Nivel 4 (arquitectura):** `BlockchainV2.tsx` usa `pin: true` con `PIN_MULT=2` en su ScrollTrigger. El pin-spacer creado tiene altura `≈ 2 × section.height`, desplazando todos los elementos siguientes (incluyendo `#proyectos`) hacia abajo en el documento.

### Evidencia de suficiencia

La cadena causal en FPL a `/#proyectos` tiene dos fases:

**Fase 1 — por qué aterriza en lugar incorrecto:**
```
Browser navega a /#proyectos (FPL desde /certificados)
  → React renderiza landing
  → Browser auto-scroll nativo a #proyectos  ← antes de GSAP
  → useEffect([]) de LenisProvider: instala Lenis, ticker
  → useEffect([pathname]) de LenisProvider:
      isFirstPath=true → return  ← hash handling skipped
  → BlockchainV2 useGSAP: instala pin-spacer (altura ≈ 2× sección)
  → #proyectos ahora está más abajo en el documento
  → viewport permanece en posición del auto-scroll → ya no es #proyectos
```

**Fase 2 — por qué el fix es suficiente:**
```
Fix propuesto: if (isFirstPath.current) {
  isFirstPath.current = false
  if (hash) { [ejecutar hash handling] }  ← nuevo
  return  // [scroll restoration sigue skipped: correcto]
}

Con fix, en FPL a /#proyectos:
  → setTimeout(400ms) → BlockchainV2 ya instaló su pin-spacer
  → ScrollTrigger.refresh() → recalcula posiciones con spacer ya presente
  → rAF → lenis.scrollTo('#proyectos') → usa posiciones actualizadas
  → viewport llega a la sección correcta
```

El timeout de 400ms ya está validado en producción para el caso de soft nav (mismo archivo, mismo componente). No es un número arbitrario nuevo — es el umbral ya probado que garantiza que GSAP ha completado el setup de ScrollTriggers antes del refresh.

**Disponibilidad de `lenisRef.current` en el fix:** `useEffect([])` (línea 14, donde se instancia Lenis y se asigna `lenisRef.current`) se declara antes que `useEffect([pathname])` (línea 73) en el mismo componente. React ejecuta los efectos de un mismo componente en orden de declaración en el primer render. El setTimeout de 400ms añade margen adicional. `lenisRef.current` está disponible cuando el scrollTo se ejecuta.

**Confidence: ALTA.** Confluyen nivel 1 (código con el early return), nivel 1 (comentario en el mismo código que documenta el bug para soft nav), nivel 2 (comportamiento reportado por el usuario), y nivel 4 (arquitectura del pin de BlockchainV2 como causa del desplazamiento).

---

## RC-7a — IDs `acerca` y `roadmap` en el observer no existen en el DOM

### Hipótesis

El mapa del IntersectionObserver en NavV2 (E2, línea 64) incluye 8 IDs. Dos de ellos — `acerca` y `roadmap` — no corresponden a ningún componente v2 actual. `document.getElementById('acerca')` y `document.getElementById('roadmap')` retornan `null` en todas las páginas. El observer intenta observarlos, falla silenciosamente, y continúa.

### Evidencia

- **Nivel 1 (código):** grep en `components/v2/` — ningún componente define `id="acerca"` ni `id="roadmap"`. Confirmado en DM-4 del DEPENDENCY_MAP de Etapa 1.
- **Nivel 1 (código):** `NavV2.tsx` línea 76: `const el = document.getElementById(id); if (el) observer.observe(el)` — el guard `if (el)` previene un error, pero la entry en el mapa sigue siendo dead code.

### Clasificación de scope

**Remediación de dead code.** No produce ningún síntoma de usuario visible — el observer no falla, solo ignora los IDs inexistentes. `activeId` nunca se actualiza desde estas entries (correcto por omisión). El fix (eliminar `acerca` y `roadmap` del mapa) reduce de 8 a 6 entries activas sin cambio de comportamiento observable.

**Confidence: ALTA** de que son dead code.  
**Confidence de impacto si se corrige: nula en términos de síntomas** — es exclusivamente higiene de código.

**Decisión de scope:** diferida a REMEDIATION PLAN. Incluir en Etapa 3 solo si el ciclo se decide extender a limpieza general de NavV2; de lo contrario, diferir como deuda técnica de bajo riesgo.

---

## RC-7b — `activeId` calculado pero no aplicado al render

### Hipótesis

NavV2 calcula `activeId` correctamente vía IntersectionObserver pero ningún elemento del JSX usa ese valor. Los links del nav usan inline styles estáticos — el color no cambia según qué sección está activa. Las clases CSS `.nav-link` y `.nav-link.is-active` existen en `globals.css` pero ningún elemento de NavV2 las usa. El sistema de "link activo" está implementado a medias.

### Evidencia

- **Nivel 1 (código):** `NavV2.tsx` línea 28 — `activeId` declarado.
- **Nivel 1 (código):** búsqueda de `activeId` en el JSX de NavV2 (líneas 148–370) — solo aparece en la declaración del `useState`. No hay ninguna referencia en el render de los links ni en sus estilos.
- **Nivel 1 (código):** `NavV2.tsx` líneas 213–238 — los links usan `style={{ color: 'rgba(247,245,242,0.72)' }}` estático, con hover via `onMouseEnter`/`onMouseLeave`. Sin condición sobre `activeId`.
- **Nivel 1 (código):** `navLinks` array incluye `sectionId` en cada entry — existe como dato semántico preparado para ser consumido, pero nunca se usa en el render.

### Clasificación de scope

**Completar una feature a medias.** A diferencia de RC-7a, aquí hay un síntoma de usuario (S-08b: los links del nav nunca muestran cuál sección está activa), pero este síntoma no fue reportado en el intake de Etapa 3 — fue identificado durante el análisis de Etapa 1 como efecto colateral de RC-1. No es un bug de regresión: el nav nunca tuvo este comportamiento funcionando en producción.

El fix requiere añadir lógica de render condicional (≈ 3–4 líneas en el JSX de los links). No toca animaciones GSAP ni LenisProvider — impacto contenido a NavV2 render.

**Confidence: ALTA** de que el estado nunca se aplica.  
**Confidence de que es un bug vs feature pendiente: MEDIA** — el navLinks tiene `sectionId` como señal de intención, pero el comportamiento nunca funcionó.

**Decisión de scope:** diferida a REMEDIATION PLAN. Las opciones son: (A) incluir en Etapa 3 como completar una feature relacionada con los navLinks; (B) diferir a INC separado cuando se decida el comportamiento exacto de estados activos del nav (puede requerir diseño — ¿qué pasa en páginas internas donde no hay secciones?).

---

## Mapa síntoma → causa raíz (Etapa 3)

| Síntoma | Causa raíz | Confidence | Punto de intervención |
|---|---|---|---|
| S-04b URL pollution #contacto | RC-6 — `preventDefault` faltante | **ALTA** | `LenisProvider.tsx` línea 49: `if (!target) { e.preventDefault(); return }` |
| S-N1 sección incorrecta en FPL | RC-8 — `isFirstPath` bypasea hash handling | **ALTA** | `LenisProvider.tsx` líneas 73–76: extraer `if (hash)` antes del early return |
| S-08b activeId nunca visible | RC-7b — dead state sin render | **ALTA** | `NavV2.tsx` render de links: añadir condición `activeId === link.sectionId` |
| Dead code observer | RC-7a — IDs `acerca`/`roadmap` inexistentes | **ALTA** | `NavV2.tsx` línea 64–68: eliminar 2 entries del mapa |

---

## Exit criteria

- [x] RC-6: causa necesaria identificada (nivel 1) + causa suficiente argumentada (cadena causal sin alternativas entre `return` y acción del browser)
- [x] RC-8: causa necesaria identificada (nivel 1 + comentario en código + nivel 2 usuario + nivel 4 arquitectura) + causa suficiente argumentada (fix extiende mecanismo ya validado en soft nav; timeout 400ms ya probado; `lenisRef` disponible por orden de declaración de efectos)
- [x] RC-7a: hipótesis separada con Confidence y scope explícito (dead code, sin síntoma de usuario, decisión diferida)
- [x] RC-7b: hipótesis separada con Confidence y scope explícito (feature incompleta, síntoma de usuario identificado, decisión diferida)
- [x] Interacción RC-6 con Guard 0 (`defaultPrevented`) analizada — branches mutuamente excluyentes, sin riesgo de regresión en HeroV2

**STOP — aprobación humana requerida antes de DEPENDENCY MAP.**
