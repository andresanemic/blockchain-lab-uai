# ROOT CAUSE ANALYSIS — NavV2 Desktop Bug

INC-001 (en preparación) · Branch: `remediacion/navbar-desktop` · Fecha: 2026-06-14

> Cada síntoma del intake tiene al menos una hipótesis con Confidence y evidencia citada.
> Ninguna causa raíz se asume sin evidencia de código o comportamiento observable.
> Regla: sin evidencia citada → Confidence BAJA por defecto.

---

## Síntomas del intake (checklist de cobertura)

1. [ ] Flickering visual
2. [ ] Elementos que aparecen antes de tiempo
3. [ ] Elementos que desaparecen incorrectamente
4. [ ] Problemas de navegación
5. [ ] Problemas con Back
6. [ ] Problemas con Forward
7. [ ] Scroll restoration inconsistente
8. [ ] Estados inconsistentes tras múltiples navegaciones
9. [ ] Elementos desktop visibles temporalmente en móvil
10. [ ] Elementos móviles visibles temporalmente en desktop
11. [ ] Navbar con historial de regresiones

---

## Causas raíz identificadas

Antes de los síntomas: las causas raíz se cruzan entre sí. Se documentan primero para referencia.

---

### RC-1 — NavV2 remonta en cada navegación de ruta

**Mecanismo:** NavV2 se importa directamente en `app/page.tsx` (línea 17), `app/certificados/page.tsx` (línea 20) y `app/validacion-videos/page.tsx` (línea 19). No está en `app/layout.tsx` (leído: solo contiene `LenisProvider`). En Next.js App Router, los componentes específicos de ruta se desmontan al salir y se remontan al entrar. Cada navegación entre páginas v2 produce un ciclo completo unmount → mount de NavV2.

**Consecuencias directas:**
- Los cuatro `useState` vuelven a sus valores iniciales (`false`, `false`, `false`, `null`).
- Los cinco `useEffect` corren de nuevo, incluyendo E3 que dispara la animación GSAP de entrada.
- Los listeners (`scroll`, `resize`, `IntersectionObserver`) se destruyen y recrean.

**Evidencia:** código actual — `app/layout.tsx` (layout raíz sin NavV2), tres `page.tsx` con `import NavV2` directo.
**Confidence: ALTA** — evidencia de código puro, sin inferencia de comportamiento.

---

### RC-2 — Inline `style={{ display: 'flex' }}` sobrescribe `className="hidden md:flex"` en el nav desktop

**Mecanismo:** El `<nav>` desktop en `NavV2.tsx` línea 119 tiene `className="hidden md:flex"`. La clase `hidden` establece `display: none` vía CSS. El mismo elemento tiene `style={{ display: 'flex' }}` en la línea 133. En CSS, los inline styles tienen mayor especificidad que cualquier clase. El resultado: el nav desktop tiene `display: flex` en **todos los viewports**, incluyendo móvil. La clase `hidden` no tiene efecto real.

La única barrera de visibilidad en móvil es `style={{ opacity: 0 }}` (línea 128) — que persiste solo mientras GSAP no lo anime. Si GSAP corre en móvil, el nav desktop aparece.

**Evidencia:** código actual — `NavV2.tsx` línea 119 (`className`), línea 128 (`opacity: 0`), línea 133 (`display: 'flex'`). Contradicción interna en el mismo elemento, verificable sin ejecutar el código.
**Confidence: ALTA** — contradicción de código estático, sin inferencia de comportamiento.

---

### RC-3 — Guard de viewport en E3 es mount-time-only; no responde a resize

**Mecanismo:** `NavV2.tsx` líneas 76–83: `useEffect(() => { if (window.innerWidth >= 768) { gsap.fromTo(...) } }, [])`. El array de dependencias vacío garantiza que este efecto corre exactamente una vez por mount. Si el usuario monta el componente en desktop (guard pasa, GSAP corre, nav desktop a `opacity: 1`) y luego reduce el viewport a móvil, el nav desktop queda a `opacity: 1` — visible en el viewport móvil. El listener de resize E5 (líneas 110–113) solo cierra `menuOpen`, no revierte la opacidad del nav desktop.

**Evidencia:** código actual — `NavV2.tsx` líneas 76–83 (guard mount-only), líneas 110–113 (resize listener sin lógica de opacidad). Inferencia directa de código, sin necesidad de observación.
**Confidence: ALTA** — dos efectos con responsabilidades distintas y no coordinadas en el mismo componente.

---

### RC-4 — Tween GSAP de entrada sin cleanup: puede correr contra nodo desmontado

**Mecanismo:** `NavV2.tsx` E3 usa `gsap.fromTo(navRef.current, ...)` directamente en un `useEffect` — no usa `useGSAP`. `useGSAP` haría cleanup automático de tweens al desmontar. Sin él, si el usuario navega durante los 1.4 segundos de duración del tween (0.3s delay + 1.1s duration), GSAP continúa intentando actualizar `navRef.current` que puede haber sido desmontado por React. GSAP escribe en el estilo del nodo; si el nodo está desmontado, la escritura es silenciosa pero el tween no se cancela.

**Evidencia:** código actual — `NavV2.tsx` líneas 76–83 (`gsap.fromTo` raw, sin cleanup, sin `gsap.killTweensOf`). Ausencia del patrón `return () => gsap.killTweensOf(navRef.current)` en el cleanup del efecto.
**Confidence: MEDIA** — el mecanismo está en el código; el síntoma concreto (qué ocurre visualmente) requiere observación de comportamiento. La ventana de 1.4s es real; si la navegación es rápida el efecto se manifiesta.

---

### RC-5 — Ausencia de coordinación entre scroll restoration de LenisProvider y entrance animation de NavV2

**Mecanismo:** En cada navegación, dos operaciones asíncronas corren sin coordinación:
1. LenisProvider (`LenisProvider.tsx` líneas 102–115): `requestAnimationFrame` → `lenis.scrollTo(savedPos, {immediate:true})` → `setTimeout(100ms)` → `ScrollTrigger.refresh()`.
2. NavV2 E3: `useEffect([])` → `gsap.fromTo(navRef, ..., delay: 0.3)`.

Ambos se disparan tras el mount. El orden exacto en que React ejecuta los efectos de dos componentes distintos no está garantizado. Si LenisProvider restaura el scroll mientras NavV2 está animando el nav desde `top: -34px`, el nav puede posicionarse incorrectamente (GSAP calcula la posición relativa al viewport que puede estar en mitad de un scroll).

**Evidencia:** código actual — `LenisProvider.tsx` líneas 102–115 (rAF + setTimeout), `NavV2.tsx` líneas 76–83 (useEffect con delay). Inferencia de interacción asíncrona; no hay evidencia de colisión directa observable en código estático.
**Confidence: MEDIA** — el mecanismo de carrera existe en el código; la manifestación exacta requiere observación de timing.

---

### RC-6 — CTA `#contacto` desde páginas internas no es manejado correctamente por LenisProvider

**Mecanismo:** `LenisProvider.tsx` líneas 34–48: el handler captura clicks en `a[href^="#"]`. El CTA del nav tiene `href="#contacto"`. En landing (`/`), `document.querySelector('#contacto')` encuentra el elemento y Lenis hace scroll suave. En páginas internas (`/certificados`, `/validacion-videos`), no existe `#contacto` en el DOM, `querySelector` devuelve `null`, el handler retorna sin `e.preventDefault()`. El browser entonces procesa el click normalmente: append `#contacto` a la URL y dispara un evento `hashchange`. La URL queda como `/certificados#contacto` — el hash persiste en el pathname que LenisProvider observa, potencialmente interfiriendo con la lógica de scroll restoration.

**Evidencia:** código actual — `LenisProvider.tsx` líneas 47–50 (retorno sin preventDefault si `!target`), `NavV2.tsx` líneas 215 y 310 (href="#contacto" en desktop y móvil), `app/certificados/page.tsx` (sin sección `#contacto` en su DOM).
**Confidence: MEDIA** — la ruta de código es trazable; la manifestación (URL con hash incorrecto) requiere observación.

---

## Hipótesis por síntoma

---

### S-01 · Flickering visual

**Hipótesis principal:** RC-1 (NavV2 remonta en cada navegación). El nav desaparece al desmontarse la instancia saliente y reaparece —con animación de entrada de 1.4s— en la instancia entrante. El intervalo entre desmount y el inicio de la animación GSAP (que incluye un delay de 0.3s) produce un período de ausencia visual del nav.

**Evidencia:** código — `NavV2.tsx` líneas 76–83 (delay: 0.3, duration: 1.1). Comportamiento observable reportado por el humano ("flickering visual").
**Confidence: ALTA.**

**Hipótesis secundaria:** RC-4 (tween en curso al navegar). Si la navegación ocurre durante los 1.4s de animación, el nodo se desmonta mientras el tween GSAP sigue corriendo. El siguiente mount inicia una nueva animación. El solapamiento produce un "parpadeo" adicional.
**Confidence: MEDIA** (requiere que el usuario navegue en menos de 1.4s desde el mount).

---

### S-02 · Elementos que aparecen antes de tiempo

**Hipótesis:** RC-1 + animación de entrada con delay. Cuando NavV2 remonta, el nav desktop empieza en `opacity: 0` (línea 128) durante los 0.3s de delay. Después aparece con la animación. En la landing, el nav "aparece" 0.3s después del paint — perceptible. En páginas internas, el efecto se repite en cada navegación.

Adicionalmente: el nav desktop tiene `top: '14px'` en su inline style (línea 126) pero GSAP lo pone en `top: -34px` como estado inicial (línea 79). Si hay algún frame entre el mount del componente y la ejecución del `useEffect`, el nav aparece brevemente en `top: 14px` con `opacity: 0`. Técnicamente invisible, pero si `opacity` no se aplica antes del primer paint (hidrataciónmismatch), podría ser visible.

**Evidencia:** código — `NavV2.tsx` línea 128 (`opacity: 0` inline), línea 79 (`top: '-34px'` en fromTo inicial), línea 82 (`delay: 0.3`).
**Confidence: ALTA** para el delay perceptible; **MEDIA** para el frame pre-effect.

---

### S-03 · Elementos que desaparecen incorrectamente

**Hipótesis A:** RC-1 (remount). El nav desaparece visualmente en el momento del desmount de la instancia saliente. No hay fade-out — desaparece instantáneamente. El nav entrante no aparece hasta 0.3s después.

**Hipótesis B:** RC-4 (tween sin cleanup). Si la navegación ocurre a mitad del tween de entrada (durante los 1.4s), el tween continúa pero el nodo puede ya no estar en el DOM. GSAP puede cancelar silenciosamente el tween si detecta que el elemento está desconectado, produciendo que el nav quede en un estado intermedio de opacidad y desaparezca.

**Evidencia:** código — ausencia de `return () => gsap.killTweensOf(navRef.current)` en `NavV2.tsx` E3 (líneas 76–83). Comportamiento observable reportado ("elementos que desaparecen incorrectamente").
**Confidence: ALTA** para hipótesis A (desmount instantáneo); **MEDIA** para hipótesis B (requiere observación de timing).

---

### S-04 · Problemas de navegación

**Hipótesis A:** RC-6 (CTA `#contacto` desde páginas internas). Click en "Colaborar" desde `/certificados` no encuentra `#contacto`, browser appende el hash a la URL sin scroll. La página no se mueve pero la URL cambia. Si el usuario luego hace Back, vuelve a `/certificados#contacto` en lugar de `/certificados`.

**Hipótesis B:** Links `href="/#proyectos"` desde páginas internas. LenisProvider no los intercepta (pathname ≠ `/`). Next.js Router navega a `/#proyectos`. LenisProvider detecta el cambio de pathname, espera 400ms, llama `ScrollTrigger.refresh()` y luego intenta `lenis.scrollTo('#proyectos')`. Si BlockchainV2 tiene un pin activo en la landing y `ScrollTrigger.refresh()` aún no completó el recálculo, `#proyectos` puede estar en una posición incorrecta (el spacer del pin desplaza su offset).

**Evidencia hipótesis A:** código — `LenisProvider.tsx` línea 48 (`if (!target) return` sin preventDefault), `NavV2.tsx` líneas 215 y 310.
**Evidencia hipótesis B:** código — `LenisProvider.tsx` líneas 85–97 (setTimeout 400ms → refresh → scrollTo), `BlockchainV2.tsx` línea 168 (pin activo en landing con `invalidateOnRefresh: true`).
**Confidence A: MEDIA** · **Confidence B: MEDIA** — rutas de código identificadas; el síntoma exacto requiere observación.

---

### S-05 · Problemas con Back

**Hipótesis:** RC-5 (falta de coordinación). Al hacer Back, LenisProvider restaura el scroll (rAF → `lenis.scrollTo(savedPos, {immediate:true})`). Simultáneamente, NavV2 remonta y lanza la animación GSAP de entrada (`delay: 0.3s`). Durante los primeros 300ms, el nav está en `opacity: 0` y `top: -34px` mientras la página ya tiene su scroll restaurado. El usuario ve la página en la posición correcta pero sin nav durante un flash.

**Hipótesis secundaria:** Si la navegación Back ocurre desde una página donde el scroll nunca superó 0 (e.g., `/certificados` vista rápidamente), `scrollSaved` no tiene entry (`pos > 0` en `LenisProvider.tsx` línea 68). LenisProvider hace `scrollTo(0)` — correcto. Pero si el usuario estaba scrolleado en `/certificados` y el guardado falló por algún motivo (e.g., Lenis instance no lista), el Back toma al usuario al tope de `/certificados`.

**Evidencia:** código — `LenisProvider.tsx` líneas 66–70 (guard `pos > 0`), líneas 106–115 (restore en rAF). `NavV2.tsx` línea 82 (delay: 0.3). Comportamiento observable reportado ("problemas con Back").
**Confidence: MEDIA** — mecanismo en código identificado; el síntoma visual exacto (es el delay del nav o la posición de scroll) requiere observación.

---

### S-06 · Problemas con Forward

**Hipótesis:** Forward navigation no está en el mapa de `scrollSaved`. El mecanismo de LenisProvider guarda la posición al *salir* de una ruta. Si el usuario navega A → B → Back (a A) → Forward (a B), la posición de B al hacer Forward puede no estar en `scrollSaved` porque la guardamos al *salir* de B (hacia A), no al entrar a B. Esto depende del orden de visita.

Caso concreto: usuario va `/` → `/certificados` (scroll en certificados) → Back → Forward a `/certificados`. Al volver a `/certificados` la primera vez (Back), LenisProvider restaura desde `scrollSaved['/certificados']` (guardado al salir). Pero al hacer Forward de vuelta a `/certificados`, `scrollSaved['/certificados']` tiene la posición del back, no la del forward. El resultado puede ser correcto o inconsistente según el orden.

**Evidencia:** código — `LenisProvider.tsx` líneas 65–70 (save en return del efecto), líneas 100–115 (restore). El mecanismo solo distingue entre "hay savedPos" y "no hay savedPos", sin saber si el evento es Back o Forward del browser.
**Confidence: BAJA** — la hipótesis es plausible a partir del código pero el comportamiento exacto con Forward requiere observación directa. No hay evidencia de código que confirme el fallo específico para Forward vs Back.

---

### S-07 · Scroll restoration inconsistente

**Hipótesis:** RC-5. La restauración de scroll (`LenisProvider.tsx` línea 109: `lenis.scrollTo(savedPos, {immediate:true})` dentro de un rAF) corre en paralelo con la animación GSAP del nav (delay 0.3s + 1.1s). Ambas modifican el estado del viewport en el mismo ciclo de navegación. Si la restauración de scroll reposiciona la página mientras el pin de BlockchainV2 está activo, `ScrollTrigger.refresh()` (llamado 100ms después) puede recalcular las posiciones del pin — moviendo efectivamente el scroll a una posición diferente de la guardada.

**Evidencia:** código — `LenisProvider.tsx` línea 114 (`setTimeout(() => ScrollTrigger.refresh(), 100)` después del scrollTo immediato), `BlockchainV2.tsx` líneas 165–188 (pin con `invalidateOnRefresh: true`). La secuencia: scrollTo → 100ms → refresh → `onRefresh` del pin → posible reposicionamiento.
**Confidence: MEDIA** — la cadena causal está en el código; el resultado final (posición equivocada) requiere observación.

---

### S-08 · Estados inconsistentes tras múltiples navegaciones

**Hipótesis A:** RC-1 (remount). En cada mount, `activeId` vuelve a `null`. El IntersectionObserver (E2, líneas 55–72) observa IDs que no existen en páginas internas. `activeId` nunca se actualiza en `/certificados` o `/validacion-videos`. Los links del nav no muestran ninguno como "activo" aunque el usuario esté en esa página. El estado visual es inconsistente con la ubicación real.

**Hipótesis B:** RC-1 + estado de scroll. Si el usuario estaba scrolleado en la landing con `expanded: true`, navega a `/certificados` (nav remonta con `expanded: false`), y el scroll restoration lleva la página a una posición scrolleada, hay un frame donde el nav está visualmente colapsado aunque el scroll dice que debería estar expandido. El listener de scroll E1 (línea 41) corre después del mount y corregirá esto, pero hay un flash.

**Evidencia hipótesis A:** código — `NavV2.tsx` líneas 55–72 (IDs hardcodeados: `areas`, `proyectos`, `equipo`, `impacto`, `blockchain`, `acerca`, `proceso`, `roadmap`). Ninguno de estos IDs existe en `app/certificados/page.tsx` (verificado) o `app/validacion-videos/page.tsx` (verificado por grep).
**Evidencia hipótesis B:** código — `NavV2.tsx` líneas 20 (expanded init false), 41–52 (scroll listener que corrige).
**Confidence A: ALTA** (evidencia de código directa) · **Confidence B: MEDIA** (frame de inconsistencia, brevísimo, requiere observación).

---

### S-09 · Elementos desktop visibles temporalmente en móvil

**Hipótesis principal (RC-2):** El nav desktop (`<nav className="hidden md:flex">`) tiene `style={{ display: 'flex' }}` inline (`NavV2.tsx` línea 133) que anula la clase `hidden` en todos los viewports. En móvil, el nav desktop tiene `display: flex` siempre — solo está visualmente oculto porque `style={{ opacity: 0 }}` (línea 128) y el guard impide que GSAP lo anime. Pero si hay cualquier situación que eleve la opacidad (resize desde desktop, error en el guard, u otro código), el nav desktop aparece en móvil.

**Hipótesis de resize (RC-3):** Usuario en desktop (GSAP corrió, `opacity: 1`) → reduce ventana a móvil → resize listener E5 (líneas 110–113) cierra `menuOpen` pero no revierte la opacidad del nav desktop → nav desktop queda visible (`opacity: 1`, `display: flex`) en el viewport móvil.

**Evidencia:** código — `NavV2.tsx` línea 119 (`className="hidden md:flex"`), línea 128 (`opacity: 0`), línea 133 (`display: 'flex'`). La contradicción es verificable sin ejecutar el código. `NavV2.tsx` líneas 110–113 (resize listener sin lógica de opacidad del nav desktop).
**Confidence: ALTA** — evidencia de código directo, dos hipótesis con evidencia distinta.

---

### S-10 · Elementos móviles visibles temporalmente en desktop

**Hipótesis:** En NavV2, el nav móvil (`<div className="flex md:hidden">`, línea 223) no tiene inline `display` override. La clase `md:hidden` lo oculta en desktop correctamente vía CSS. No hay animación GSAP sobre este elemento. En NavV2, este síntoma probablemente **no se origina**.

Si el síntoma ocurre, la causa más probable está en otros componentes del sistema (HeroV2, BlockchainV2, secciones con visibilidad condicional) que usan el patrón `isMobile ? A : B` y pueden tener el flash de SSR descrito en lore/animation.md (estado inicial false en SSR → flash en cliente). Fuera del scope de análisis de NavV2.

**Evidencia:** código — `NavV2.tsx` línea 223 (sin inline display override en el elemento móvil). Ausencia de GSAP sobre el div móvil en el código.
**Confidence: BAJA** para que NavV2 sea la causa. El síntoma puede existir en otros componentes, pero no hay evidencia de que NavV2 lo genere.

---

### S-11 · Navbar con historial de regresiones

**Hipótesis:** El patrón `opacity: 0` como único mecanismo de ocultamiento (RC-2) hace que cualquier cambio de GSAP en el pasado o futuro que toque la opacidad del nav desktop pueda revelar el nav en móvil. La fragilidad estructural (dos mecanismos en conflicto: CSS `display:none` vs inline `display:flex`) es la causa raíz de las regresiones repetidas.

Adicionalmente: el guard de viewport en E3 tiene alcance limitado (mount-only). Cada vez que se añade funcionalidad al nav (nueva animación, nuevo estado), existe riesgo de saltar el guard o interactuar con él de forma inesperada.

**Evidencia:** `PRE_WORKFLOW_LEADS.md` entradas 🔴 #27 y #30 (dos intervenciones previas directamente relacionadas). Código actual — la contradicción `display:flex` inline vs `hidden` clase sigue presente a pesar del fix de #27.
**Confidence: ALTA** — patrón histórico confirmado + código actual que explica por qué el patrón se repite.

---

## Mapa síntoma → causa raíz

| Síntoma | Causa raíz primaria | Causa raíz secundaria | Confidence |
|---|---|---|---|
| S-01 Flickering | RC-1 (remount + GSAP entrada) | RC-4 (tween sin cleanup) | ALTA / MEDIA |
| S-02 Aparecen antes de tiempo | RC-1 (delay 0.3s) | — | ALTA |
| S-03 Desaparecen incorrectamente | RC-1 (desmount instantáneo) | RC-4 (tween sin cleanup) | ALTA / MEDIA |
| S-04 Problemas de navegación | RC-6 (#contacto desde internas) | RC-1 + LenisProvider hash 400ms | MEDIA |
| S-05 Problemas con Back | RC-5 (coordinación GSAP/Lenis) | RC-1 (nav sin estado persistente) | MEDIA |
| S-06 Problemas con Forward | RC-5 (scrollSaved sin distinción Back/Forward) | — | BAJA |
| S-07 Scroll restoration inconsistente | RC-5 (ST.refresh() post-scrollTo) | RC-1 (pin recalculado) | MEDIA |
| S-08 Estados inconsistentes | RC-1 (activeId null en internas) | RC-1 (expanded false en remount) | ALTA / MEDIA |
| S-09 Desktop visible en móvil | RC-2 (inline display:flex) | RC-3 (guard mount-only) | ALTA |
| S-10 Móvil visible en desktop | No en NavV2 (evidencia insuficiente) | Posiblemente otros componentes | BAJA |
| S-11 Historial de regresiones | RC-2 (fragilidad estructural opacity-only) | RC-3 (guard frágil) | ALTA |

---

## Hallazgo sin síntoma explícito en el intake

**RC-7 — IntersectionObserver en NavV2 observa IDs que no existen en páginas internas**

No reportado como síntoma explícito pero identificado en código. El observer se registra en cada mount, observa `document.getElementById(id)` para 8 IDs, y los que no existen simplemente no se observan. El efecto neto: `activeId` permanece en `null` en páginas internas. Los links del nav nunca aparecen como "activos". Relacionado con S-08 (estados inconsistentes).

**Evidencia:** código — `NavV2.tsx` líneas 55–72 (IDs hardcodeados). Ninguno presente en `app/certificados/page.tsx` ni `app/validacion-videos/page.tsx`.
**Confidence: ALTA.**

---

## Resumen de causas raíz (prioridad de intervención)

| RC | Descripción breve | Síntomas afectados | Confidence | Prioridad |
|---|---|---|---|---|
| RC-1 | NavV2 remonta en cada ruta (no en layout raíz) | S-01, S-02, S-03, S-05, S-08 | ALTA | 🔴 Alta |
| RC-2 | `display:flex` inline anula `hidden` CSS | S-09, S-11 | ALTA | 🔴 Alta |
| RC-3 | Guard viewport mount-only, sin reactividad a resize | S-09, S-11 | ALTA | 🟡 Media |
| RC-4 | Tween GSAP sin cleanup al desmontar | S-01, S-03 | MEDIA | 🟡 Media |
| RC-5 | Sin coordinación GSAP entrance / Lenis scroll restoration | S-05, S-07 | MEDIA | 🟡 Media |
| RC-6 | `#contacto` desde internas no previene default | S-04 | MEDIA | 🟢 Baja |
| RC-7 | IntersectionObserver con IDs inexistentes en internas | S-08 | ALTA | 🟢 Baja |
