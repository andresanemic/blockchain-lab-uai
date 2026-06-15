# GOLDEN_PATHS.md

Recorridos críticos de usuario que **NO pueden romperse nunca**.

Reglas para Claude Code:
- Estos recorridos los define y aprueba el usuario. **NO los inventes ni los modifiques sin su aprobación explícita.**
- En la fase VALIDATION DESIGN, traduce cada uno a un script de Playwright en `tests/golden-paths/`.
- Regla red-green: cada script debe demostrarse **en ROJO** sobre el bug actual antes de confiar en su verde.

Formato por path: recorrido · DEBE · NO DEBE · plataforma.

---

## GP-1 · Restauración de scroll con Back
**Plataforma:** desktop + móvil
**Recorrido:** landing → scrollear hacia abajo → entrar a una página interna → Back del navegador.
**DEBE:** la landing recupera exactamente la posición de scroll que tenía antes de entrar.
**NO DEBE:** volver al tope; saltar; restaurar con delay visible.

## GP-2 · Navbar desktop consistente entre páginas  ← bug objetivo del primer run
**Plataforma:** desktop
**Recorrido:** landing → usar navbar → navegar a página interna → navegar a otra → Back / Forward.
**DEBE:** el navbar se renderiza y comporta igual en landing y en todas las internas; estados (activo / hover / sticky) correctos en cada ruta.
**NO DEBE:** desaparecer, duplicarse, perder estilos, quedar en estado de otra ruta, o parpadear al cambiar de página.

## GP-3 · Navbar móvil
**Plataforma:** móvil
**Recorrido:** móvil → abrir navbar → navegar a una página → Back.
**DEBE:** abre / cierra bien, navega, y tras Back queda en estado correcto (cerrado, sin restos).
**NO DEBE:** quedar abierto, bloquear el scroll, o mostrar items de la ruta anterior.

## GP-4 · Sin bleed desktop/móvil al cambiar viewport
**Plataforma:** ambos (con resize)
**Recorrido:** desktop → resize a móvil → resize de vuelta a desktop → seguir navegando.
**DEBE:** en cada ancho se muestra sólo la versión correcta; al cruzar el breakpoint el layout se reordena limpio.
**NO DEBE:** elementos desktop visibles en móvil ni móviles en desktop, **ni siquiera temporalmente**.

## GP-5 · Carga de página interna sin flash
**Plataforma:** desktop + móvil
**Recorrido:** landing → entrar a una página interna.
**DEBE:** el contenido aparece directamente en su estado final correcto.
**NO DEBE:** flash / FOUC, elementos que aparecen y desaparecen, contenido que carga en estado equivocado y luego se corrige, animaciones que disparan antes de tiempo.

---

GP-2 a GP-5 cubren los fallos sistémicos que aparecieron al crear páginas. Amplía esta lista a medida que el intake descubra recorridos nuevos; **cada agregado lo apruebas tú**.

## GP-10 · Link de nav a sección con pin GSAP llega al destino correcto desde página interna

**Plataforma:** desktop
**Recorrido:** desde `/certificados`, click en "Proyectos" (`href="/#proyectos"`) → Full Page Load a `/#proyectos`.
**DEBE:** el usuario aterriza en la sección Proyectos; `#proyectos` queda dentro del viewport tras carga completa.
**NO DEBE:** aterrizar en la sección Blockchain en lugar de Proyectos — manifestación de **RC-8** (el browser auto-scroll a `#proyectos` ocurre antes de que GSAP configure el pin-spacer de BlockchainV2; al instalarse el spacer, `#proyectos` se desplaza hacia abajo y el viewport queda apuntando a Blockchain).

> **Sub-caso B (RC-6) descartado 2026-06-15:** La premisa "FooterV2 no incluye id='contacto' en /certificados" era incorrecta. `FooterV2.tsx:79` tiene `id="contacto"` y se renderiza en todas las páginas — `querySelector("#contacto")` siempre encuentra el elemento y Guard 2 llama `e.preventDefault()` correctamente. No hay URL pollution. Bug no existe en el codebase actual. Ver REMEDIATION_PLAN_etapa3.md § RC-6 descartado y `lore/testing.md`.

---

## Patrones de código — síntomas que se repiten (GP-6 a GP-9)

Promovidos desde `GOLDEN_PATH_CANDIDATES.md` (clasificación de `soluciones.md`).
Estos paths describen síntomas de desarrollo, no recorridos de usuario — no se traducen a Playwright sino a checklist de revisión antes de hacer commit o cerrar una remediación.

---

## GP-6 · `<br/>` manual en textos responsive

**Síntoma:** Texto correcto en desktop pero con palabras sueltas / líneas desbalanceadas en móvil.
**Entradas de origen:** `soluciones.md` #28, #34, #39 · `lore/responsive.md`

**Recorrido:** abrir DevTools en ~390px → buscar todos los H1/H2/H3/subtítulos con `<br/>` → verificar que ninguna línea queda sola y que el wrap automático es aceptable.

**DEBE:** todo `<br/>` en componente responsive tiene su equivalente `isMobile` sin `<br/>`.
**NO DEBE:** usar `<br/>` en texto MONO uppercase con `letterSpacing >= 0.10em` visible en móvil; asumir que `clamp()` resuelve los saltos manuales.

---

## GP-7 · GSAP animando elementos con `display:none`

**Síntoma:** Elemento oculto por CSS/Tailwind aparece visible en cierto breakpoint después de que GSAP lo anima.
**Entradas de origen:** `soluciones.md` #1, #27 · `lore/animation.md`

**Recorrido:** listar todos los elementos con `fromTo`/`from`/`to` → verificar en cada breakpoint donde deberían estar ocultos → comprobar que permanecen ocultos tras cargar la página.

**DEBE:** doble protección — guard de viewport en el `useEffect` + `display:none !important` en CSS; usar siempre `gsap.fromTo(...)` con estado inicial explícito.
**NO DEBE:** animar con GSAP sin verificar el viewport; asumir que `hidden` de Tailwind sobrevive a un tween que asigna `display` inline.

---

## GP-8 · Race condition entre guard síncrono y asíncrono

**Síntoma:** Botón que requiere dos clicks para funcionar — el primero parece perdido. Ocurre de forma intermitente justo después de una animación.
**Entradas de origen:** `soluciones.md` #20, #25, #11b · `lore/animation.md`

**Recorrido:** click rápido repetido durante y justo después de una animación → verificar que el primer click post-animación funciona al primer intento → buscar si coexisten un `ref` y un `useState` controlando el mismo bloqueo.

**DEBE:** un único mecanismo de bloqueo por componente (`busyRef` o `useState`, nunca ambos); `setState` solo en `onComplete`; `queueRef` para no perder clicks durante la animación.
**NO DEBE:** mezclar guard síncrono (`ref`) con guard asíncrono (`useState`); llamar `setState` al inicio de funciones que contienen tweens activos.

---

## GP-9 · Scroll triggers calibrados solo para desktop

**Síntoma:** Animaciones de entrada que se disparan tarde (elemento ya completamente visible) o nunca, en viewports pequeños. En desktop todo parece correcto.
**Entradas de origen:** `soluciones.md` #38, #26, #32 · `lore/animation.md`

**Recorrido:** abrir el sitio en ~390px → scroll lento de arriba hacia abajo → verificar que cada animación de entrada dispara cuando el elemento apenas asoma — no cuando ya lleva tiempo visible.

**DEBE:** triggers entre `top 88%` y `top 95%`; usar `top 88%` como default para componentes responsive.
**NO DEBE:** usar `start: 'top 65%'` o menor en componentes visibles en móvil; testear triggers únicamente en desktop.
