# Guía estética por sección — Blockchain Lab UAI

Esta guía documenta el *feeling*, los efectos y la lógica visual de cada sección.
Es la referencia de diseño para nuevas páginas y componentes.

---

## Principios de diseño (Awwwards)

- Tipografía editorial a escala: h2 en `clamp(44px, 6.5vw, 88px)` fontWeight 300 en todas las secciones
- Listas editoriales: filas con `borderTop: 1px solid rgba(...)` en lugar de cards con fondo
- Números fantasma (ghost numbers): decoración de fondo en secciones oscuras
- **Cursor estándar del sistema** — no usar cursores personalizados. `CursorV2.tsx` existe pero no se importa.
- **Cero dividers horizontales** — ni en wrappers de sección ni dentro de ellos en fondos cream. Las líneas `1px solid` grises chocan visualmente con la grilla de fondo (`rgba(8,13,43,0.022)`) y rompen la continuidad del efecto. Separación = solo espaciado (`gap`, `margin`, `padding`). En secciones oscuras (`#080D2B`) los dividers sutiles (`rgba(255,255,255,0.07)`) sí son aceptables porque no compiten con la grilla cream.
- Animaciones: `y: 72–80, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out'` como estándar

---

## Regla de grilla — obligatoria en toda sección y página nueva

Toda sección o página del sitio debe mantener la grilla de fondo continua con el efecto glow. Sin excepción. El patrón es siempre el mismo:
```tsx
const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()   // dark: useGridGlow(true)
// En el JSX:
<section ref={sectionRef} onMouseMove={handleMouseMove} style={{ position: 'relative', ... }}>
  <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />   // dark: <GridGlowLayers dark .../>
  <div style={{ position: 'relative', zIndex: 3 }}>
    {/* contenido */}
  </div>
</section>
```
El `zIndex: 3` en el contenedor interior es necesario para que quede por encima de las capas de la grilla.

---

## Principios transversales de interacción

- Hover siempre con `cubic-bezier(0.16, 1, 0.3, 1)` o `expo.out` — nunca `ease` genérico.
- Transiciones de color: `0.20–0.30s`. Transiciones de posición/sombra: `0.45–0.50s`.
- Las animaciones de entrada nunca interrumpen el scroll — solo se disparan una vez al entrar en viewport con `start: 'top 70–80%'`.
- El contenido no aparece de golpe: siempre `opacity: 0 → 1` + `y: 28–80px → 0` o `scale: 0.94–0.97 → 1`.
- Stagger entre elementos del mismo grupo: `0.07–0.14s`.

---

## Secciones

### NavV2 — Pill flotante
- Pill estrecha centrada en desktop, fondo `#F8F8F4` con `backdropFilter: blur`. Al hacer hover se expande suavemente hasta 1120px revelando todos los links (transición 500ms con cubic-bezier).
- Links en Display fontWeight 300, separados por punto mediano (`·`). Sin bordes, sin sombras agresivas. El único color es el botón "Trabajemos juntos" en `#0057FF`.

### HeroV2 — Portada editorial
- **Columna izquierda:** H1 enorme fontWeight 300 (`clamp(36px, 4.2vw, 68px)`), última línea en `#0057FF`. Subtítulo en MONO uppercase con letter-spacing `0.16em` — como una ficha técnica. Botón CTA en pill blanca.
- **Columna derecha:** Scroll infinito automático de cards (certificados blockchain, hashes SHA-256, stats, pills de red). Crean la sensación de que el sistema ya está vivo y en producción — no es una promesa, es evidencia.
- **Grilla doble de fondo:** líneas cada 120px + subdivisión cada 24px. El cursor proyecta un glow radial que se congela al salir — da sensación de profundidad física.
- **Botón scroll-down:** esquina inferior derecha, desaparece suave con GSAP `scrub` al abandonar la sección. Nunca visible en otras secciones.

### AboutV2 — Innovación Económica y Relaciones Descentralizadas.
- Grid `1fr auto`: H2 gigante (`clamp(52px, 8vw, 112px)`) a la izquierda, columna de stats a la derecha. El H2 ocupa casi toda la anchura — la tipografía ES el diseño.
- **Stats animados:** `100%` y `7` cuentan desde 0 con `expo.out` al entrar en viewport. Los números son enormes (`clamp(32px, 6.5vw, 90px)`), fontWeight 900, en `#0057FF`. Bajo cada número, una label MONO 10px UPPERCASE en `rgba(8,13,43,0.38)` — casi susurrada.
- **Entrada de números:** escalan desde `1.18×` hacia `1.0` en scrub durante el scroll.

### BlockchainV2 — Blockchain hace la confianza verificable.
- **Layout grid `1fr 1fr`:** H2 editorial a la izquierda (fijo durante todo el pin), timeline vertical a la derecha. El H2 ocupa la mitad izquierda sin cambiar — el movimiento ocurre solo en la columna del timeline.
- **H2 con clip+blur reveal:** "Blockchain hace la / confianza / verificable." — cada línea sube desde debajo con `translateY(108%) → 0%` y `blur(12px) → 0`. "confianza" y "verificable." en `#60A0FF`. El reveal dispara al entrar en viewport, antes de que el pin se active.
- **Timeline vertical de 4 pasos:** Segura → Transparente → Inmutable → Descentralizada. La sección está pinned (`pin: true`, GSAP ScrollTrigger) durante `2 × 100vh` de scroll. Cada paso ocupa un cuarto del recorrido.
- **Dots clickeables:** círculo de `22px` (inactivo/futuro) → `38px` lleno en `#60A0FF` (activo). Hover: `scale(1.18)` con transición lentísima `1.8s`. Los pasos ya visitados quedan en `28px` con fill `rgba(96,160,255,0.22)` — evidencia de progreso. Al hacer click, el scroll salta al paso correspondiente mediante `lenis.scrollTo` con easing `ease-out-cubic`.
- **Títulos MONO UPPERCASE:** el paso activo aparece en `clamp(17px, 1.9vw, 26px)` color `#F8F8F4`; los futuros en `clamp(12px, 1.2vw, 16px)` casi invisibles `rgba(248,248,244,0.22)`. La diferencia de tamaño hace obvio cuál está activo sin ningún otro indicador.
- **Contenido por paso:** 3 bullets con dot `4px` en `#60A0FF` + glow, texto en `rgba(248,248,244,0.62)`. Aparece con `opacity 0 → 1` (0.65s ease-out-cubic) al activarse. La `height` cambia instantáneamente (sin transición) para no causar reflow en el pin.
- **Líneas de progreso entre dots:** track de `1.5px rgba(255,255,255,0.10)` con fill interior `#60A0FF` que crece via `scaleY` sincronizado al scroll. Fórmula: `fill(i) = clamp(0, progress × N − i, 1)`. Se actualizan en cada frame aunque el click-lock (`skipRef`) esté activo.
- **Barra de progreso superior:** `2px` en el top de la sección, `scaleX(0→1)` scrubbed al scroll. Misma técnica que ProcessV2 — compositor puro, cero reflow.

### ProjectsV2 — Lo que estamos construyendo hoy.
- **Layout bento `5fr / 3fr`:** TIM ocupa toda la altura izquierda (feature card, light), Certificados y Video apiladas a la derecha (dark + light).
- **Cards transparentes:** el fondo cream de la sección se ve a través de las cards — la grilla de fondo y el glow del cursor atraviesan el layout. Las cards son contenedores, no bloques opacos.
- **Iconos SVG respiran:** TIM a 180px (protagonista), los otros a 40px. Cambian de color en hover (`#0057FF` en light, `#60A0FF` en dark). Sin relleno — solo stroke limpio.
- **Ghost numbers:** `clamp(80px, 14vw, 160px)` en la esquina inferior derecha de cada card. En light casi invisibles (`rgba(8,13,43,0.08)`), en dark visibles en azul claro (`rgba(96,160,255,0.38)`). Al hacer hover, intensidad → 1.
- **Hover de card:** `translateY(-4px)` + borde azul + línea `2px` que desliza desde el borde superior (`scaleX: 0→1`) + título y sombra elevada. Se siente como levantar una lámina física.
- **Entrada escalonada:** stagger `0.7s` entre cards, delay `0.25s`.

### AreasV2 — Áreas de trabajo *(referencia de paleta dark)*
- **Sin header propio** — el marquee "Soluciones aplicadas a desafíos reales." se trasladó a TeamV2. La sección arranca directamente en la meta row (Áreas de trabajo / 07 estratégicas).
- **Fondo:** imagen fotográfica con overlay `rgba(4,6,20,0.58)` — más profundo y orgánico que un sólido `#080D2B`. La textura de la foto se intuye.
- **Lista editorial:** 7 filas con grid `64px / 1fr / auto` (índice mono | título | tag). Cada fila es clickeable. En hover: las demás filas se dimean a `opacity: 0.28`, la activa avanza `translateX(10px)` y muestra descripción que aparece desde abajo.
- **Tags técnicos** ("DeFi", "RUC-D") en MONO con borde `rgba(96,160,255,0.40)` y glow `boxShadow: '0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)'` — el mismo lenguaje de sombra que los dots del timeline de BlockchainV2, escalado a pill pequeña.
- **Ghost numbers gigantes** (`clamp(220px, 34vw, 480px)`) en `rgba(96,160,255,0.07)` — solo visibles en hover de cada fila, emergen como watermarks.
- Esta sección es la **referencia canónica de paleta dark**: `#60A0FF` acento, `rgba(248,248,244,0.55)` texto secundario.

### ProcessV2 — Cómo trabajamos contigo.
- **Sección light `#F8F8F4`** (no dark). H2 editorial `clamp(44px, 6.5vw, 88px)` weight 300, entrada `y: 64, opacity: 0, expo.out 1.0s`.
- **Artefacto central** (`height: clamp(480px, 60vh, 600px)`, `borderRadius: 20px`, sombra multicapa profunda): divide en panel izquierdo blanco `#FFFFFF` (42%) y panel derecho gris suave `#F7F8FA` (58%). El artefacto entra desde la derecha: `opacity: 0, x: 56, scale: 0.96, expo.out 1.4s`.
- **Header bar del artefacto:** dot verde pulsante (`#16a34a` con glow) + label MONO 9px `{num} / 05 · {tag}` + **barra de progreso** `2px` `scaleX` en `#0057FF` animada por GSAP (compositor puro, cero reflow).
- **Panel izquierdo:** tag pill activa en `#0057FF` con glow (`boxShadow: '0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10)...'`), número MONO, título Display Light `clamp(22px, 2.4vw, 34px)`, descripción Inter 13.5px `rgba(8,13,43,0.55)`. Botones ← → en la parte inferior (solo deshabilitan en los extremos).
- **Panel derecho:** 5 paneles distintos (`PanelDiagnostico`, `PanelDiseno`, `PanelValidacion`, `PanelDesarrollo`, `PanelEscala`) — ver componentes en `ProcessV2.tsx`.
- **Transición bidireccional entre etapas:** salida `y: -12×dir, scale: 0.97, opacity: 0, 0.20s, power2.in, stagger 0.03`; entrada `y: 0, scale: 1, opacity: 1, 0.55s, expo.out, stagger 0.07`. `overwrite: true` en todos los tweens. Doble RAF antes de animar entrada (React 19 concurrent mode).
- **Sistema de cola (`queueRef`):** clics durante animación se encolan automáticamente y se ejecutan al terminar — jamás se pierden. `busyRef` es el único guard; sin estado React en el camino crítico (ver Problema 25 en soluciones.md).
- **Pills de navegación** debajo del artefacto: 5 pills MONO 12px UPPERCASE que reflejan el paso activo con borde `rgba(0,87,255,0.35)` + glow azul.

### ImpactV2 — Blockchain no es una tendencia. Es una nueva infraestructura de confianza.
- Grid `1fr 1fr`: H2 editorial a la izquierda, grid de blockchain pills a la derecha.
- **Pills de blockchain:** 8 pills en grid 2 columnas. Dos variantes — dark (`rgba(8,13,43,0.78)` + `backdropFilter: blur(36px)`) y light (`#FFFFFF` con borde). Logo de 26px + nombre en MONO UPPERCASE. Hover: `translateY(-2px)` + sombra más profunda. Se sienten como chips físicos reales, no badges gráficos.
- **"Lee nuestro blog →"** en MONO 10px alineado a la derecha bajo las pills. En hover, el `letter-spacing` se expande de `0.14em` a `0.18em` — el texto "respira" hacia afuera. Sutil, elegante.
- Entrada de pills con stagger `0.07s` — se materializan como si una red las fuera conectando.

### TeamV2 — Las personas detrás del Lab.
- **Marquee header:** el mismo marquee de AreasV2 ("Soluciones aplicadas a desafíos reales." + acento `#60A0FF`) abre la sección full-width antes del contenedor `maxWidth`. Marca el tránsito entre la sección de áreas y el equipo — el mismo texto, distinto contexto.
- **4 photo-cards en grid:** placeholders SVG con gradientes azul navy personalizados por miembro (`c1/c2/c3`). Ratio 3:4. Sin fotos reales — la intención es que el gradiente ya tenga identidad propia por persona.
- **Hover de card:** `translateY(-8px)` con `cubic-bezier(0.16,1,0.3,1)` — se levanta como una lámina de acrílico iluminada.
- **Jerarquía tipográfica de cada card:** nombre en Display Bold 17px `#F8F8F4` → rol en MONO 10px UPPERCASE `#60A0FF (0.90)` → bio en Inter 12px `rgba(248,248,244,0.55)`.
- **Animación de entrada:** `y: 80, opacity: 0, scale: 0.94` con stagger `0.12s`.

### FooterV2 — Cierre dramático
- Full-height (`min-height: 100vh`), cream, misma grilla de fondo y glow cursor que el resto de secciones light.
- **H2 en tres líneas:** "Construyamos / confianza verificable / juntos." — cada línea tiene clip overflow + `translateY(108%)` → `0%` con blur `12px→0px`. El reveal es teatral, como una cortina que sube. "confianza verificable" en `#0057FF`.
- **Subtítulo descifrado:** "Empresas, fundaciones e instituciones…" empieza como ruido aleatorio (caracteres `A-Z 0-9 !#@&%`) y se resuelve letra por letra con interval de 42ms. Evoca una terminal decodificando un mensaje — mezcla lo técnico con lo elegante.
- **Grid 3 col:** links de navegación (Display Light, `clamp(20px, 2.2vw, 28px)`, hover reduce opacity a 0.35) | email de contacto | logos UAI en cards redondeadas.
