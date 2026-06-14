# Componentes v2 — estado detallado

Lee este archivo antes de editar cualquier componente existente en `components/v2/`.

---

**Hero (`HeroV2.tsx`):**
- Botón "Colaborar" → fade a blanco + jump a `#contacto` (`handleColaborar`, `e.preventDefault()`, overlay via `document.createElement`). Ver soluciones.md #30.
- Botón scroll-down: solo en desktop (`!isMobile`), GSAP scrub fade-out al salir de la sección.

**NavV2.tsx** — pill flotante que se expande a 1120px; hover-expand con 500ms delay

**AboutV2.tsx** — grid asimétrico `1fr 240px`; h2 `clamp(52px, 8vw, 112px)` weight 300; stats (100%, UAI, 7) en columna derecha; descripción 2-col al fondo con `borderTop` interno. Counter scroll trigger: `top 82%`. Ver `soluciones.md` #38.

**BlockchainV2.tsx** — sección oscura pinned (`PIN_MULT = 2`) **solo en desktop**. En móvil el pin está completamente deshabilitado (`if (!isMobile)` dentro de `useGSAP`); la sección tiene `height: auto; minHeight: 100svh`. Grid `1fr 1fr`: H2 clip+blur reveal a la izquierda / timeline vertical de 4 pasos (Segura → Transparente → Inmutable → Descentralizada) a la derecha. Dots Y headers del timeline clickeables (`onClick={() => handleDotClick(i)}`); en desktop usan `skipRef` + `lenis.scrollTo` + `onComplete`; en móvil llaman `activateStep(idx)` directamente sin scroll. Barras `scaleY` entre dots + barra global `scaleX` en el top. `anticipatePin: 1` + CSS `:has(#blockchain)` en globals evita flash blanco en desktop. `dependencies: [isMobile], revertOnUpdate: true` en `useGSAP`. Trigger de entrada: `top 88%` en móvil, `top 80%` en desktop. Ver `soluciones.md` #32.

**AreasV2.tsx** — lista editorial 7 áreas; h2 `clamp(44px, 6.5vw, 88px)`; filas con `borderTop` interno y hover `translateX(10px)` + acento `#60A0FF`; referencia de paleta dark. **Móvil:** hover/mouseenter deshabilitados — `onClick` hace toggle; descripción usa accordion inline (`maxHeight` transition) en lugar de `position: absolute` para no superponer filas. Ver `soluciones.md` #33.

**ProjectsV2.tsx** — grid 2 col, 2 proyecto-cards detalladas (CertificateMockup + DroneDashboard); h2 `clamp(44px, 6.5vw, 88px)`. **Patrón `isFeatureLayout`:** `const isFeatureLayout = feature && !isMobile` — controla `iconSz` (180px desktop / 40px móvil), `titleSz`, `pad`, `gap` y `justifyContent`. En móvil todas las cards son uniformes (ícono 40px, altura 200px). Ver `soluciones.md` #37.

**ProcessV2.tsx** — **sección light `#F8F8F4`** con artefacto interactivo tipo sala de control:
- Artefacto `height: isMobile ? '400px' : 'clamp(480px, 60vh, 600px)'`, `background: '#FFFFFF'` explícito (evita transparencia en móvil), `borderRadius: 20px`, split 42/58: panel izquierdo `#FFFFFF` (narrativa del paso) + panel derecho `#F7F8FA` (datos contextuales por etapa)
- Panel izquierdo: `flexGrow: isMobile ? 1 : 0`, `flexShrink: 0` — **nunca usar shorthand `flex`** (ver `soluciones.md` #36). En móvil el panel ocupa toda la altura del artefacto, permitiendo que el spacer flex empuje los botones al fondo.
- H2 móvil sin `<br/>`: `isMobile ? 'Cómo llevamos tu idea a producción.' : 'Cómo llevamos tu\nidea a producción.'` — ver #34
- Transiciones GSAP bidireccionales con dirección: exit `power2.in 0.20s` + `scale 0.97` → enter `expo.out 0.55s` + `scale 1.0`; `overwrite: true`; doble RAF
- `busyRef` único guard + `queueRef` para encolar clics (ver `soluciones.md` #25) — sin `fading` state
- Header bar: dot verde pulsante + label MONO + barra `scaleX` `#0057FF`; 5 pills de navegación debajo del artefacto

**ImpactV2.tsx** — fondo cream; stat grid `1fr 1fr 1fr` con `borderTop` y separadores de columna internos; números `clamp(72px, 12vw, 160px)` con counter animation; sub-headline + lista de 7 sectores editoriales. H2 con JSX condicional: en móvil sin `<br/>` (browser hace wrap automático); en desktop con `<br/>` manuales. Triggers: `.impact-left` → `top 90%`, `.chain-pill` → `top 88%`. Ver `soluciones.md` #38, #39.

**TeamV2.tsx** — sección oscura; marquee header "Soluciones aplicadas a desafíos reales." (heredado de AreasV2, full-width, keyframe `areas-marquee`); 4 photo-cards en grid con gradientes SVG personalizados por miembro; rol en MONO 10px UPPERCASE `#60A0FF`; bio en Inter; stagger `0.12s` en entrada

**ContactV2.tsx** — sección oscura, `padding: 0` inferior; email gigante `clamp(32px, 6.5vw, 88px)` como cierre dramático (opacity 0.18 → 0.65 en hover). Trigger de reveal: `top 92%`. Ver `soluciones.md` #38.

**FooterV2.tsx** — fondo cream, grilla 120px + glow cursor; 2 col: links + logos UAI; email `giacomo.tomasoni@uai.cl`. Trigger de reveal: `top 95%`. `paddingBottom` de la columna de logos: `isMobile ? '32px' : PB`. Ver `soluciones.md` #38.

**CursorV2.tsx** — archivo existente pero **NO se usa**. El sitio usa cursor estándar del sistema. No añadir cursores personalizados.

**ScrollUI.tsx** — línea de progreso vertical `2px` en el borde derecho del viewport (scaleY con scroll), color `#60A0FF` — mismo azul que la barra horizontal de BlockchainV2. Sin contador de sección ni indicadores adicionales.

**GridGlowLayers.tsx** — componente compartido: grilla doble (`backgroundAttachment: fixed` para continuidad entre secciones) + efecto glow cursor

**useGridGlow.ts** (`lib/`) — hook: refs para glow + mouse tracking; `useGridGlow(true)` para variante oscura
