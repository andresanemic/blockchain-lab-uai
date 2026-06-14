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
