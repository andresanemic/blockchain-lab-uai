# PRE_WORKFLOW_LEADS — Leads de este proyecto para Root Cause Analysis

Entradas de `soluciones.md` con scope ESTE-PROYECTO.
No son soluciones confirmadas para el estado actual del código — son pistas históricas.
🔴 = intervención pasada que pudo CAUSAR o enmascarar un bug actual. Validar antes de actuar.

---

## 🔴 #30 — Overlay de transición "Colaborar" + LenisProvider en paralelo

**Síntoma original:** Al hacer click en "Colaborar" del Hero, Lenis lanzaba su scroll suave de 1.6s en paralelo con el overlay de fade, haciendo el overlay imperceptible.

**Solución aplicada:** Se añadió `if (e.defaultPrevented) return` como primera línea del handler de Lenis en `LenisProvider.tsx`. El overlay usa `#FFFFFF` (no cream).

**Por qué 🔴:** Este guard modifica el comportamiento global de `LenisProvider` para todos los clicks en `a[href^="#"]`. Si algún componente nuevo o existente no llama `e.preventDefault()` correctamente, Lenis ignora su click. Además, la lógica de `lenis.scrollTo(target, { immediate: true, force: true })` dentro del `onComplete` del overlay asume que la instancia de Lenis está disponible en ese momento. Validar que el contrato `defaultPrevented` sigue siendo correcto en el estado actual de `LenisProvider`.

---

## 🔴 #27 (TAMBIÉN EN lore/animation.md) — GSAP sobreescribe `display:none` del nav desktop en móvil

**Síntoma original:** NavV2 aparecía visible en móvil aunque tuviera clase `hidden`. GSAP animaba el nav con `fromTo` sin verificar el viewport.

**Solución aplicada:** Guard `window.innerWidth >= 768` en el `useEffect` de NavV2 + regla CSS `nav.hidden { display: none !important }` en media query.

**Por qué 🔴:** El guard por `window.innerWidth` se evalúa solo al montar el componente (el `useEffect` tiene deps vacíos). Si el viewport cambia después del mount (resize, rotate), el guard no se re-evalúa. Además, hardcodear `768` como breakpoint puede desincronizarse con los breakpoints del nav si cambian. Este es el componente directamente involucrado en `remediacion/navbar-desktop`.

---

## #6 — Grilla de fondo desalineada entre secciones

**Síntoma original:** Las líneas de la grilla no continuaban entre secciones — había un desfase al cruzar el borde.

**Solución aplicada:** `backgroundAttachment: 'fixed'` en `GridGlowLayers.tsx`.

**Notas:** Patrón genérico aplicado aquí. Verificar que ninguna sección tiene ancestros con `transform`, `filter` o `will-change` que rompan el `fixed` localmente. Si alguna sección del sitio tiene la grilla desalineada, buscar esos ancestros.

---

## #7 — Glow del cursor: implementación de dos capas con mask-image

**Síntoma original:** Implementación naive con `position:fixed` causaba repaints globales en cada `mousemove`.

**Solución aplicada:** Dos capas absolutas en `GridGlowLayers.tsx` + `mask-image` radial actualizado en `useGridGlow.ts`. El glow "se congela" al salir — intencional.

**Notas:** Si el glow se comporta de forma inesperada en alguna sección, verificar que la sección usa `useGridGlow` y `<GridGlowLayers>` correctamente, y que el `onMouseMove` está en el elemento `<section>` raíz.

---

## #29 — Padding uniforme genera demasiado espacio entre secciones en móvil

**Síntoma original:** Grandes bloques de espacio vacío entre secciones en móvil.

**Solución aplicada:** Patrón `isMobile ? '48px 24px' : 'clamp(...)'` en todas las secciones.

**Notas:** Si se crea una sección nueva sin variante `isMobile` en el padding, heredará el problema. Verificar que toda sección nueva sigue el patrón canónico de espaciado de `design/tokens.md`.

---

## #33 — Descripción de área en AreasV2 se superpone al contenido en móvil

**Síntoma original:** Al tocar una fila en AreasV2, la descripción con `position:absolute` flotaba sobre las filas siguientes.

**Solución aplicada:** En móvil: accordion inline con `maxHeight` transition. En desktop: mantiene `position:absolute`. Hover deshabilitado en móvil — solo `onClick`.

**Notas:** Si el comportamiento del accordion parece raro o si la descripción no aparece al tocar en móvil, verificar la lógica `isMobile && setHovered(...)` en AreasV2. El `maxHeight` debe ser suficientemente grande para el texto más largo de las 7 áreas.

---

## #34 — H2 de ProcessV2 rompe mal en móvil

**Síntoma original:** "producción." quedaba sola en una cuarta línea en móvil por el `<br/>` manual del desktop.

**Solución aplicada:** JSX condicional: sin `<br/>` en móvil, con `<br/>` en desktop.

**Notas:** Patrón que se repite en múltiples secciones (ver también #39 / ImpactV2). Si se añade texto a ProcessV2, verificar que el H2 móvil sigue haciendo wrap correctamente.

---

## #35 — Artefacto de ProcessV2 transparente en la parte inferior + botones flotantes en móvil

**Síntoma original:** (A) El fondo cream traspasaba por la parte inferior del artefacto. (B) Los botones ← → flotaban en el medio del panel en lugar de estar pegados al fondo.

**Solución aplicada:** `background: '#FFFFFF'` explícito en el artefacto + `flexGrow: isMobile ? 1 : 0` (longhand, no shorthand) en el panel izquierdo.

**Notas:** Si ProcessV2 muestra transparencia en móvil o los botones no están al fondo, verificar que `background` y `flexGrow` siguen presentes. El shorthand `flex` está prohibido aquí (ver #36 en lore).

---

## #37 — Card TIM con ícono 180px en móvil — patrón `isFeatureLayout`

**Síntoma original:** La feature card de TIM tenía ícono de 180px en móvil, ocupando casi toda la card.

**Solución aplicada:** `const isFeatureLayout = feature && !isMobile` — en móvil todas las cards son uniformes (ícono 40px).

**Notas:** Si se añade una nueva feature card a ProjectsV2, verificar que también usa `isFeatureLayout` y no la flag `feature` directamente para dimensionar el ícono.

---

## #39 — H2 de ImpactV2 con palabras sueltas en líneas por `<br/>` manual en móvil

**Síntoma original:** "nueva" quedaba sola en una línea por los `<br/>` manuales del desktop.

**Solución aplicada:** JSX condicional: sin `<br/>` en móvil.

**Notas:** Mismo patrón que #34. Si se edita el texto del H2 de ImpactV2 en cualquier breakpoint, verificar el comportamiento en el otro.
