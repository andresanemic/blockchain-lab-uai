@AGENTS.md

# Blockchain Lab UAI

Sitio institucional del Blockchain Lab de la Universidad Adolfo Ibáñez +
material de difusión. Objetivo: atraer empresas e instituciones como
aliadas/clientes. Contacto: `blockchain@uai.cl`.

## Estado actual — Rediseño v2 (branch `redesign-blueprint`)

Estamos construyendo una nueva versión completa del sitio orientada a ganar
en Awwwards. Todos los componentes viven en `components/v2/` y la landing
usa `app/page.tsx` apuntando a ellos.

**⚠️ NO USAR PLAYWRIGHT** para testear ni modificar este proyecto. Genera
falsos positivos en animaciones (RAF sintético distorsiona los tiempos),
complica el debugging y el usuario ha pedido explícitamente no usarlo.

**Landing 100% definida en feeling y styling (junio 2026):**
La landing está completamente terminada en su estética, interacciones y
sistema de diseño. Todas las secciones tienen su feeling final. No introducir
cambios visuales sin aprobación explícita del usuario. El foco ahora es
crear nuevas páginas internas manteniendo este sistema.

**Transición "Colaborar" del Hero:**
Al hacer click en el botón "Colaborar" del Hero, se ejecuta un fade a blanco
(`#FFFFFF`, 0.40s `power2.inOut`) que cubre la pantalla antes de saltar
instantáneamente a `#contacto`. El overlay se hace via `document.createElement`
directo en `document.body` (no React). `LenisProvider` respeta el
`e.defaultPrevented` para no lanzar su propio scroll en paralelo. Ver
`soluciones.md` #30 para el detalle completo del bug y la solución.

**Versión móvil — auditoría completa (junio 2026):**
La versión móvil fue auditada y corregida en dos rondas. Todos los componentes
tienen layouts adaptativos vía `useIsMobile`. Problemas documentados en
`soluciones.md` #27–#39. Decisiones clave:
- `overflow-x: hidden` en `html` y `body` (`globals.css`) evita deriva lateral (#31)
- `BlockchainV2`: pin GSAP deshabilitado en móvil (`if (!isMobile)`); sección fluye con `height: auto; minHeight: 100svh`; headers del timeline son clickeables en móvil llamando `activateStep()` sin scroll (#32)
- `AreasV2`: descripción usa `position: absolute` en desktop y accordion inline (`maxHeight` transition) en móvil (#33)
- `ProjectsV2`: patrón `isFeatureLayout = feature && !isMobile` — en móvil todas las cards tienen ícono 40px y layout uniforme (#37)
- `ProcessV2`: H2 sin `<br/>` en móvil; artefacto `height: 400px` en móvil con `background: '#FFFFFF'` explícito; panel izquierdo con `flexGrow: isMobile ? 1 : 0` (#34, #35)
- Triggers de scroll movidos a `top 88–95%` en todos los componentes para que las animaciones disparen en cuanto el elemento asoma (#38)
- Nunca mezclar `flex` shorthand con `flexShrink`/`flexGrow` longhands en el mismo elemento style (#36)
- El botón scroll-down del Hero existe solo en desktop (`!isMobile`). El nav móvil usa el logo oficial. Ver `soluciones.md` #27, #28 antes de tocar nav o tipografía MONO uppercase.

**Paleta del rediseño — Sistema de color completo:**

*Secciones LIGHT (cream):*
| Token | Valor | Uso |
|---|---|---|
| Fondo | `#F8F8F4` | Background de sección |
| Texto primario | `#080D2B` | H1–H3, body principal |
| Texto secundario | `rgba(8,13,43,0.50)` | Descripciones, párrafos |
| Texto ultra-muted | `rgba(8,13,43,0.35–0.40)` | Labels, eyebrows, meta |
| Acento / CTA | `#0057FF` | Links, highlights en h2, botones primarios |
| Card background | `#FFFFFF` | Cards dentro de secciones cream |
| Borde card base | `rgba(8,13,43,0.08–0.14)` | Borde en reposo |
| Borde card hover | `rgba(0,87,255,0.22–0.35)` | Borde al hacer hover |
| Grilla de fondo | `rgba(8,13,43,0.022)` | Via `GridGlowLayers` (con `backgroundAttachment: fixed`) |
| Sombra base | `0 1px 4px rgba(8,13,43,0.06), 0 4px 16px rgba(8,13,43,0.04)` | Cards en reposo |
| Sombra hover | `0 20px 56px rgba(8,13,43,0.10), 0 8px 24px rgba(8,13,43,0.06)` | Cards al hacer hover |
| Dividers | **PROHIBIDOS** — usar solo `gap`/`margin`/`padding` | Ver regla en Principios |

*Secciones DARK (navy):*
| Token | Valor | Uso |
|---|---|---|
| Fondo | `#080D2B` | Background de sección |
| Texto primario | `#F8F8F4` | H1–H3, nombres, títulos |
| Texto secundario | `rgba(248,248,244,0.55)` | Descripciones, párrafos |
| Texto muted / labels | `rgba(248,248,244,0.38–0.45)` | Índices, eyebrows, meta |
| **Acento** | `#60A0FF` | Highlights en h2, links, tags — **NO usar `#0057FF` en dark** (ilegible) |
| Acento borde | `rgba(96,160,255,0.40–0.45)` | Bordes de badges/tags con acento |
| Acento fondo tint | `rgba(96,160,255,0.10–0.18)` | Background de badges activos |
| Acento muted | `rgba(96,160,255,0.75–0.90)` | Roles, subtítulos con color |
| Ghost numbers | `rgba(96,160,255,0.07–0.38)` | Números decorativos de fondo |
| Divider sutil | `rgba(255,255,255,0.07)` | Aceptable en dark (no compite con grilla cream) |
| Grilla de fondo | dark variant via `useGridGlow(true)` | |

*Fuentes (constantes en cada componente):*
```ts
const DISPLAY = 'var(--font-lato, var(--font-inter))'      // H1–H3, weight 300
const BODY    = 'var(--font-inter)'                         // párrafos
const LABEL   = 'var(--font-oswald, var(--font-inter))'    // eyebrows
const MONO    = 'var(--font-jetbrains-mono, monospace)'    // labels mono UPPERCASE
```

**Principios de diseño (Awwwards):**
- Tipografía editorial a escala: h2 en `clamp(44px, 6.5vw, 88px)` fontWeight 300 en todas las secciones
- Listas editoriales: filas con `borderTop: 1px solid rgba(...)` en lugar de cards con fondo
- Números fantasma (ghost numbers): decoración de fondo en secciones oscuras
- **Cursor estándar del sistema** — no usar cursores personalizados. `CursorV2.tsx` existe pero no se importa.
- **Cero dividers horizontales** — ni en wrappers de sección ni dentro de ellos en fondos cream. Las líneas `1px solid` grises chocan visualmente con la grilla de fondo (`rgba(8,13,43,0.022)`) y rompen la continuidad del efecto. Separación = solo espaciado (`gap`, `margin`, `padding`). En secciones oscuras (`#080D2B`) los dividers sutiles (`rgba(255,255,255,0.07)`) sí son aceptables porque no compiten con la grilla cream.
- Animaciones: `y: 72–80, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out'` como estándar

---

## Guía estética por sección — mantener en todo el sitio

Esta sección documenta el *feeling*, los efectos y la lógica visual de cada sección. Es la referencia de diseño para nuevas páginas y componentes.

### NavV2 — Pill flotante
**Feeling:** Discreta, casi invisible. No compite con el contenido.
- Pill estrecha centrada en desktop, fondo `#F8F8F4` con `backdropFilter: blur`. Al hacer hover se expande suavemente hasta 1120px revelando todos los links (transición 500ms con cubic-bezier).
- Links en Display fontWeight 300, separados por punto mediano (`·`). Sin bordes, sin sombras agresivas. El único color es el botón "Trabajemos juntos" en `#0057FF`.
- Principio: el nav es un guest en la página, no el protagonista.

### HeroV2 — Portada editorial
**Feeling:** Revista de arquitectura + terminal de Bloomberg. Dos mundos en tensión productiva.
- **Columna izquierda:** H1 enorme fontWeight 300 (`clamp(36px, 4.2vw, 68px)`), última línea en `#0057FF`. Subtítulo en MONO uppercase con letter-spacing `0.16em` — como una ficha técnica. Botón CTA en pill blanca.
- **Columna derecha:** Scroll infinito automático de cards (certificados blockchain, hashes SHA-256, stats, pills de red). Crean la sensación de que el sistema ya está vivo y en producción — no es una promesa, es evidencia.
- **Grilla doble de fondo:** líneas cada 120px + subdivisión cada 24px. El cursor proyecta un glow radial que se congela al salir — da sensación de profundidad física.
- **Botón scroll-down:** esquina inferior derecha, desaparece suave con GSAP `scrub` al abandonar la sección. Nunca visible en otras secciones.
- Efecto de entrada: `y: 72, opacity: 0, scale: 0.94` → `expo.out 1.2s` como estándar.

### AboutV2 — Innovación Económica y Relaciones Descentralizadas.
**Feeling:** Minimalismo de informe anual de alto diseño. Los números hablan solos.
- Grid `1fr auto`: H2 gigante (`clamp(52px, 8vw, 112px)`) a la izquierda, columna de stats a la derecha. El H2 ocupa casi toda la anchura — la tipografía ES el diseño.
- **Stats animados:** `100%` y `7` cuentan desde 0 con `expo.out` al entrar en viewport. Los números son enormes (`clamp(32px, 6.5vw, 90px)`), fontWeight 900, en `#0057FF`. Bajo cada número, una label MONO 10px UPPERCASE en `rgba(8,13,43,0.38)` — casi susurrada.
- **Entrada de números:** escalan desde `1.18×` hacia `1.0` en scrub durante el scroll — se sienten como si tomaran peso al aparecer.
- Sin decoración adicional. La jerarquía tipográfica lo es todo.

### BlockchainV2 — Blockchain hace la confianza verificable.
**Feeling:** Clase magistral en cámara lenta. La sección se queda fija mientras el usuario la "recorre" con el scroll — como pasar páginas de un libro técnico sin mover la vista del título.
- **Layout grid `1fr 1fr`:** H2 editorial a la izquierda (fijo durante todo el pin), timeline vertical a la derecha. El H2 ocupa la mitad izquierda sin cambiar — el movimiento ocurre solo en la columna del timeline.
- **H2 con clip+blur reveal:** "Blockchain hace la / confianza / verificable." — cada línea sube desde debajo con `translateY(108%) → 0%` y `blur(12px) → 0`. "confianza" y "verificable." en `#60A0FF`. El reveal dispara al entrar en viewport, antes de que el pin se active.
- **Timeline vertical de 4 pasos:** Segura → Transparente → Inmutable → Descentralizada. La sección está pinned (`pin: true`, GSAP ScrollTrigger) durante `2 × 100vh` de scroll. Cada paso ocupa un cuarto del recorrido.
- **Dots clickeables:** círculo de `22px` (inactivo/futuro) → `38px` lleno en `#60A0FF` (activo). Hover: `scale(1.18)` con transición lentísima `1.8s`. Los pasos ya visitados quedan en `28px` con fill `rgba(96,160,255,0.22)` — evidencia de progreso. Al hacer click, el scroll salta al paso correspondiente mediante `lenis.scrollTo` con easing `ease-out-cubic`.
- **Títulos MONO UPPERCASE:** el paso activo aparece en `clamp(17px, 1.9vw, 26px)` color `#F8F8F4`; los futuros en `clamp(12px, 1.2vw, 16px)` casi invisibles `rgba(248,248,244,0.22)`. La diferencia de tamaño hace obvio cuál está activo sin ningún otro indicador.
- **Contenido por paso:** 3 bullets con dot `4px` en `#60A0FF` + glow, texto en `rgba(248,248,244,0.62)`. Aparece con `opacity 0 → 1` (0.65s ease-out-cubic) al activarse. La `height` cambia instantáneamente (sin transición) para no causar reflow en el pin.
- **Líneas de progreso entre dots:** track de `1.5px rgba(255,255,255,0.10)` con fill interior `#60A0FF` que crece via `scaleY` sincronizado al scroll. Fórmula: `fill(i) = clamp(0, progress × N − i, 1)`. Se actualizan en cada frame aunque el click-lock (`skipRef`) esté activo.
- **Barra de progreso superior:** `2px` en el top de la sección, `scaleX(0→1)` scrubbed al scroll. Misma técnica que ProcessV2 — compositor puro, cero reflow.
- **Grilla + glow cursor:** misma variante dark que el resto de secciones `#080D2B` — `useGridGlow(true)`.

### ProjectsV2 — Lo que estamos construyendo hoy.
**Feeling:** Bento grid de producto tech. Las cards son ventanas a proyectos reales, no mockups de marketing.
- **Layout bento `5fr / 3fr`:** TIM ocupa toda la altura izquierda (feature card, light), Certificados y Video apiladas a la derecha (dark + light).
- **Cards transparentes:** el fondo cream de la sección se ve a través de las cards — la grilla de fondo y el glow del cursor atraviesan el layout. Las cards son contenedores, no bloques opacos.
- **Iconos SVG respiran:** TIM a 180px (protagonista), los otros a 40px. Cambian de color en hover (`#0057FF` en light, `#60A0FF` en dark). Sin relleno — solo stroke limpio.
- **Ghost numbers:** `clamp(80px, 14vw, 160px)` en la esquina inferior derecha de cada card. En light casi invisibles (`rgba(8,13,43,0.08)`), en dark visibles en azul claro (`rgba(96,160,255,0.38)`). Al hacer hover, intensidad → 1.
- **Hover de card:** `translateY(-4px)` + borde azul + línea `2px` que desliza desde el borde superior (`scaleX: 0→1`) + título y sombra elevada. Se siente como levantar una lámina física.
- **Entrada escalonada:** stagger 0.7s entre cards, delay 0.25s — aparecen en orden, como si se colocaran uno a uno.

### AreasV2 — Áreas de trabajo *(referencia de paleta dark)*
**Feeling:** Dark room de galería contemporánea. Información densa, pero fácil de leer.
- **Sin header propio** — el marquee "Soluciones aplicadas a desafíos reales." se trasladó a TeamV2. La sección arranca directamente en la meta row (Áreas de trabajo / 07 estratégicas).
- **Fondo:** imagen fotográfica con overlay `rgba(4,6,20,0.58)` — más profundo y orgánico que un sólido `#080D2B`. La textura de la foto se intuye.
- **Lista editorial:** 7 filas con grid `64px / 1fr / auto` (índice mono | título | tag). Cada fila es clickeable. En hover: las demás filas se dimean a `opacity: 0.28`, la activa avanza `translateX(10px)` y muestra descripción que aparece desde abajo.
- **Tags técnicos** ("DeFi", "RUC-D") en MONO con borde `rgba(96,160,255,0.40)` y glow `boxShadow: '0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)'` — el mismo lenguaje de sombra que los dots del timeline de BlockchainV2, escalado a pill pequeña.
- **Ghost numbers gigantes** (`clamp(220px, 34vw, 480px)`) en `rgba(96,160,255,0.07)` — solo visibles en hover de cada fila, emergen como watermarks.
- Esta sección es la **referencia canónica de paleta dark**: `#60A0FF` acento, `rgba(248,248,244,0.55)` texto secundario.

### ProcessV2 — Cómo trabajamos contigo.
**Feeling:** Sala de control de una auditoría técnica. El proceso se navega dentro de un artefacto interactivo — como hojear el expediente de un proyecto real, no leer una presentación de marketing.
- **Sección light `#F8F8F4`** (no dark). H2 editorial `clamp(44px, 6.5vw, 88px)` weight 300, entrada `y: 64, opacity: 0, expo.out 1.0s`.
- **Artefacto central** (`height: clamp(480px, 60vh, 600px)`, `borderRadius: 20px`, sombra multicapa profunda): divide en panel izquierdo blanco `#FFFFFF` (42%) y panel derecho gris suave `#F7F8FA` (58%). El artefacto entra desde la derecha: `opacity: 0, x: 56, scale: 0.96, expo.out 1.4s`.
- **Header bar del artefacto:** dot verde pulsante (`#16a34a` con glow) + label MONO 9px `{num} / 05 · {tag}` + **barra de progreso** `2px` `scaleX` en `#0057FF` animada por GSAP (compositor puro, cero reflow).
- **Panel izquierdo:** tag pill activa en `#0057FF` con glow (`boxShadow: '0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10)...'`), número MONO, título Display Light `clamp(22px, 2.4vw, 34px)`, descripción Inter 13.5px `rgba(8,13,43,0.55)`. Botones ← → en la parte inferior (solo deshabilitan en los extremos).
- **Panel derecho — 5 paneles contextuales distintos, uno por etapa:**
  - **01 Diagnóstico:** cards de actores (avatar inicial + nombre + dot verde activo) + mini-card de métricas objetivo + chips de entregables
  - **02 Diseño:** flujo de datos con 4 nodos numerados conectados por líneas verticales + chips de integraciones requeridas
  - **03 Validación:** grid 2×2 de KPIs en MONO (`~$0.03`, `3.4×`, `10 sem`, `18%`) + selector de red blockchain con estado SELECCIONADA
  - **04 Desarrollo:** snippet de smart contract en `CertificadoUAI.sol` + stats del piloto (62 commits, 94% cobertura, 14 usuarios)
  - **05 Escala:** métricas `99.9% uptime` / `12 nodos` + badge `EN PRODUCCIÓN · MAINNET` + checklist de transferencia de conocimiento
- **Transición bidireccional entre etapas:** salida `y: -12×dir, scale: 0.97, opacity: 0, 0.20s, power2.in, stagger 0.03`; entrada `y: 0, scale: 1, opacity: 1, 0.55s, expo.out, stagger 0.07`. `overwrite: true` en todos los tweens. Doble RAF antes de animar entrada (React 19 concurrent mode).
- **Sistema de cola (`queueRef`):** clics durante animación se encolan automáticamente y se ejecutan al terminar — jamás se pierden. `busyRef` es el único guard; sin estado React en el camino crítico (ver Problema 25 en soluciones.md).
- **Pills de navegación** debajo del artefacto: 5 pills MONO 12px UPPERCASE que reflejan el paso activo con borde `rgba(0,87,255,0.35)` + glow azul.

### ImpactV2 — Blockchain no es una tendencia. Es una nueva infraestructura de confianza.
**Feeling:** Producto financiero institucional. Serio, con peso, pero elegante.
- Grid `1fr 1fr`: H2 editorial a la izquierda, grid de blockchain pills a la derecha.
- **Pills de blockchain:** 8 pills en grid 2 columnas. Dos variantes — dark (`rgba(8,13,43,0.78)` + `backdropFilter: blur(36px)`) y light (`#FFFFFF` con borde). Logo de 26px + nombre en MONO UPPERCASE. Hover: `translateY(-2px)` + sombra más profunda. Se sienten como chips físicos reales, no badges gráficos.
- **"Lee nuestro blog →"** en MONO 10px alineado a la derecha bajo las pills. En hover, el `letter-spacing` se expande de `0.14em` a `0.18em` — el texto "respira" hacia afuera. Sutil, elegante.
- Entrada de pills con stagger `0.07s` — se materializan como si una red las fuera conectando.

### TeamV2 — Las personas detrás del Lab.
**Feeling:** Galería de estudio oscura. Cada persona es un objeto de diseño, no una foto corporativa.
- **Marquee header:** el mismo marquee de AreasV2 ("Soluciones aplicadas a desafíos reales." + acento `#60A0FF`) abre la sección full-width antes del contenedor `maxWidth`. Marca el tránsito entre la sección de áreas y el equipo — el mismo texto, distinto contexto.
- **4 photo-cards en grid:** placeholders SVG con gradientes azul navy personalizados por miembro (`c1/c2/c3`). Ratio 3:4. Sin fotos reales — la intención es que el gradiente ya tenga identidad propia por persona.
- **Hover de card:** `translateY(-8px)` con `cubic-bezier(0.16,1,0.3,1)` — se levanta como una lámina de acrílico iluminada.
- **Jerarquía tipográfica de cada card:** nombre en Display Bold 17px `#F8F8F4` → rol en MONO 10px UPPERCASE `#60A0FF (0.90)` → bio en Inter 12px `rgba(248,248,244,0.55)`.
- **Animación de entrada:** `y: 80, opacity: 0, scale: 0.94` con stagger `0.12s` — las cards aparecen como si se desplegaran de izquierda a derecha.
- Sección oscura `#080D2B` con `useGridGlow(true)`.

### FooterV2 — Cierre dramático
**Feeling:** El telón final de una presentación TED. Una sola frase, contundente.
- Full-height (`min-height: 100vh`), cream, misma grilla de fondo y glow cursor que el resto de secciones light.
- **H2 en tres líneas:** "Construyamos / confianza verificable / juntos." — cada línea tiene clip overflow + `translateY(108%)` → `0%` con blur `12px→0px`. El reveal es teatral, como una cortina que sube. "confianza verificable" en `#0057FF`.
- **Subtítulo descifrado:** "Empresas, fundaciones e instituciones…" empieza como ruido aleatorio (caracteres `A-Z 0-9 !#@&%`) y se resuelve letra por letra con interval de 42ms. Evoca una terminal decodificando un mensaje — mezcla lo técnico con lo elegante.
- **Grid 3 col:** links de navegación (Display Light, `clamp(20px, 2.2vw, 28px)`, hover reduce opacity a 0.35) | email de contacto | logos UAI en cards redondeadas.
- El footer no tiene CTA agresiva — el diseño ya convenció. Solo "Construyamos juntos." y el email.

---

**Principios transversales de interacción:**
- Hover siempre con `cubic-bezier(0.16, 1, 0.3, 1)` o `expo.out` — nunca `ease` genérico.
- Transiciones de color: `0.20–0.30s`. Transiciones de posición/sombra: `0.45–0.50s`.
- Las animaciones de entrada nunca interrumpen el scroll — solo se disparan una vez al entrar en viewport con `start: 'top 70–80%'`.
- El contenido no aparece de golpe: siempre `opacity: 0 → 1` + `y: 28–80px → 0` o `scale: 0.94–0.97 → 1`.
- Stagger entre elementos del mismo grupo: `0.07–0.14s` — suficiente para percibir el orden, sin sentirse lento.

**Sistema de sombras:**
Las sombras son capas dobles — una corta y opaca que ancla el objeto, una larga y difusa que da la sensación de elevación real. Nunca una sola capa.
- **Cards en reposo (light):** `0 1px 4px rgba(8,13,43,0.06), 0 4px 16px rgba(8,13,43,0.04)` — casi imperceptible, la card parece apoyada en la superficie.
- **Cards hover (light):** `0 20px 56px rgba(8,13,43,0.10), 0 8px 24px rgba(8,13,43,0.06)` — se eleva con suavidad, la sombra larga crea profundidad de caja de luz.
- **Cards en reposo (dark):** `0 2px 16px rgba(0,0,0,0.28)` — las secciones oscuras usan negro puro porque el fondo ya es navy.
- **Cards hover (dark):** `0 20px 56px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.18)` — dramático pero no agresivo.
- **Pills de blockchain (dark):** incluyen `0 1px 0 rgba(255,255,255,0.05) inset` — un borde superior iluminado que simula luz rasante sobre el chip.
- **Pills de blockchain (light):** `0 2px 8px rgba(8,13,43,0.06), 0 8px 20px rgba(8,13,43,0.04)` en reposo; hover añade `0 0 0 4px rgba(8,13,43,0.08)` como halo exterior.
- **Pills / badges en secciones dark:** `0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)` — glow azul derivado del dot activo del timeline de BlockchainV2. Aplica a **todos** los pills/badges en secciones `#080D2B` (AreasV2 tags, ProcessV2 step-tags, y cualquier nuevo elemento similar).
- **Logos UAI en footer:** `0 2px 10px rgba(8,13,43,0.10)` — apenas insinuada, para que los logos no floten pero tampoco pesen.
- Regla general: sombras en secciones cream usan `rgba(8,13,43,…)` (navy, no negro puro) para armonizar con el tono cálido del fondo.

**Regla de grilla — obligatoria en toda sección y página nueva:**
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

**Sistema de espaciado por sección — desktop vs móvil:**

Todas las secciones usan `isMobile` (hook `useIsMobile`) para cambiar el padding.
El patrón canónico es siempre el mismo: ~96–160px desktop, **48px móvil**:

```tsx
// Patrón estándar — copiar en cualquier sección nueva
padding: isMobile ? '48px 24px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)'

// Con padding inferior diferente (secciones con más respiración abajo)
padding: isMobile ? '48px 24px 40px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px) clamp(160px, 28vh, 280px)'
```

| Sección | Desktop (top/bottom) | Móvil (top/bottom) | Horizontal desktop | Horizontal móvil |
|---|---|---|---|---|
| HeroV2 | `min-height: 100svh` — sin padding top/bottom fijo | igual | `clamp(120px, 15vw, 220px)` | `24px` |
| AboutV2 | `clamp(96px, 14vh, 136px)` / `clamp(160px, 28vh, 280px)` | `48px` / `40px` | `clamp(24px, 5vw, 64px)` | `24px` |
| BlockchainV2 | `clamp(80px, calc(50vh−230px), 360px)` / auto | `48px` / `40px` | `clamp(24px, 5vw, 80px)` | `24px` |
| AreasV2 | `clamp(96px, 14vh, 128px)` (sym) | `48px` (sym) | `clamp(24px, 5vw, 64px)` (inner div) | `24px` |
| ProjectsV2 | `clamp(96px, 10vh, 108px)` / `clamp(72px, 10vh, 108px)` | `48px` / `40px` | `clamp(24px, 5vw, 64px)` | `20px` |
| ProcessV2 | `clamp(96px, 14vh, 136px)` (sym) | `48px` (sym) | `clamp(24px, 5vw, 64px)` | `24px` |
| ImpactV2 | `clamp(96px, 14vh, 136px)` (sym) | `48px` (sym) | `clamp(24px, 5vw, 64px)` | `24px` |
| TeamV2 | `clamp(96px, 10vh, 108px)` (sym) | `48px` (sym) | `clamp(24px, 5vw, 64px)` | `24px` |
| ContactV2 | `clamp(96px, 14vh, 160px)` / `clamp(60px, 10vh, 100px)` | `48px` / `40px` | `clamp(40px, 6vw, 80px)` | `24px` |
| FooterV2 | `min-height: 100vh` con PT/PB variables | `32px` bottom | `clamp(24px, 5vw, 64px)` | `24px` |

*sym = simétrico (mismo valor arriba y abajo).*

**Regla de maxWidth:** el contenedor interior siempre tiene `maxWidth: '1280px'` y `margin: '0 auto'`.
En móvil el padding horizontal de la sección (24px) ya actúa como margen lateral — no añadir `maxWidth` adicional si ya existe en el padre.

---

**Escala tipográfica — referencia completa:**

| Elemento | Fuente | Size | Weight | Color |
|---|---|---|---|---|
| H1 hero | DISPLAY | `clamp(36px, 4.2vw, 68px)` | 300 | `#080D2B` / última línea `#0057FF` |
| H2 sección estándar | DISPLAY | `clamp(44px, 6.5vw, 88px)` | 300 | `#080D2B` (light) / `#F8F8F4` (dark) |
| H2 gigante (About) | DISPLAY | `clamp(52px, 8vw, 112px)` | 300 | `#080D2B` |
| H3 card / artefacto | DISPLAY | `clamp(22px, 2.4vw, 34px)` | 300 | `#080D2B` |
| Número stat | DISPLAY | `clamp(32px, 6.5vw, 90px)` | 900 | `#0057FF` (light) / `#60A0FF` (dark) |
| Número stat gigante | MONO | `clamp(72px, 12vw, 160px)` | 700 | `#0057FF` |
| Body párrafo | BODY | `13px–16px` | 400 | `rgba(8,13,43,0.55)` / `rgba(248,248,244,0.55)` |
| Label eyebrow | MONO | `9px–12px` | 700 | `rgba(8,13,43,0.28–0.38)` / `rgba(248,248,244,0.38–0.45)` |
| Tag / chip | MONO | `9px–11px` | 700 | según variante |
| Snippet de código | MONO | `10.5px` | 400 | `rgba(8,13,43,0.48)` |

Todas las H2 tienen `lineHeight: 0.95–0.97`, `letterSpacing: '-0.03em'`.
Todos los números stat tienen `lineHeight: 0.88`, `letterSpacing: '-0.05em'`.

---

**Sistema de botones y pills — especificaciones exactas:**

*Botón CTA primario (azul sólido):*
```tsx
// Usado en mobile nav overlay y en cualquier CTA de alta jerarquía
{
  padding: '13px 22px', borderRadius: '8px',
  fontFamily: MONO, fontSize: '12px', letterSpacing: '0.10em', textTransform: 'uppercase',
  background: '#0057FF', color: '#F8F8F4', border: 'none',
}
// Hover: opacity 0.82
```

*Botón CTA nav (pill blanca sobre dark) — clase `.nav-cta`:*
```css
/* En globals.css — usar clase, no estilos inline */
padding: 10px 22px; border-radius: 9px;
font-family: MONO; font-size: 14px; font-weight: 500; letter-spacing: 0.04em;
background: rgba(255,255,255,0.92); border: 1px solid rgba(255,255,255,0.70);
color: rgba(8,13,43,0.85);
/* hover: background: rgba(255,255,255,1); box-shadow: 0 0 18px rgba(255,255,255,0.18) */
```

*Step pills de navegación (light section, ej. ProcessV2):*
```tsx
// Activo
{ border: '1px solid rgba(0,87,255,0.35)', background: 'rgba(0,87,255,0.06)', color: '#0057FF',
  boxShadow: '0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10), 0 2px 8px rgba(8,13,43,0.06), inset 0 1px 0 rgba(255,255,255,0.60)',
  fontFamily: MONO, fontSize: '12px', letterSpacing: '0.10em', textTransform: 'uppercase',
  padding: '5px 12px', borderRadius: '4px' }
// Inactivo
{ border: '1px solid rgba(8,13,43,0.16)', background: 'transparent', color: 'rgba(8,13,43,0.50)' }
// Transición: 'all 0.22s cubic-bezier(0.16,1,0.3,1)'
```

*Botones de navegación secundaria (← →, dentro de artefacto):*
```tsx
// Avance (→)
{ border: '1px solid rgba(0,87,255,0.30)', background: 'rgba(0,87,255,0.05)', color: '#0057FF',
  fontFamily: MONO, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase',
  padding: '6px 14px', borderRadius: '4px', transition: 'all 0.20s' }
// Retroceso (←)
{ border: '1px solid rgba(8,13,43,0.20)', background: 'transparent', color: 'rgba(8,13,43,0.55)' }
// Deshabilitado (en extremos)
{ border: '1px solid rgba(8,13,43,0.09)', color: 'rgba(8,13,43,0.20)', cursor: 'default' }
```

*Tags / chips inline (light):*
```tsx
// Neutral
{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px',
  border: '1px solid rgba(8,13,43,0.10)', color: 'rgba(8,13,43,0.38)' }
// Azul
{ border: '1px solid rgba(0,87,255,0.25)', color: '#0057FF' }
// Verde
{ border: '1px solid rgba(22,163,74,0.25)', color: '#16a34a' }
```

*Tags / badges en dark (AreasV2, BlockchainV2, ProcessV2):*
```tsx
{ fontFamily: MONO, fontSize: '9px–10px', fontWeight: 700,
  border: '1px solid rgba(96,160,255,0.40)',
  color: 'rgba(96,160,255,0.90)',
  boxShadow: '0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)',
  padding: '4px 10px', borderRadius: '3px–4px' }
```

---

**Sistema de artefactos — contenedor y header bar:**

Los artefactos son interfaces interactivas embebidas en una sección (como el artefacto del Hero o de ProcessV2). Siempre siguen este patrón:

*Contenedor principal:*
```tsx
{
  borderRadius: '20px', overflow: 'hidden',
  border: '1px solid rgba(8,13,43,0.10)',
  boxShadow: '0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.16), 0 40px 80px rgba(8,13,43,0.12), 0 0 0 1px rgba(8,13,43,0.06)',
  display: 'flex', flexDirection: 'column',
}
// Tamaño típico: height: 'clamp(480px, 60vh, 600px)'
// Entrada: opacity: 0, x: 56, scale: 0.96 → expo.out 1.4s
```

*Header bar del artefacto (browser chrome minimalista):*
```tsx
{
  background: '#F7F8FA', padding: '14px 18px 10px', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  borderBottom: '1px solid rgba(8,13,43,0.07)', position: 'relative',
}
// Dot de estado: width/height 5px, borderRadius 50%
//   Verde activo: background '#16a34a', boxShadow '0 0 5px rgba(22,163,74,0.6)'
//   Amarillo: background '#f59e0b'   Rojo: background '#ef4444'
// Label MONO: fontSize 9px, fontWeight 700, color 'rgba(8,13,43,0.28)', letterSpacing '0.18em', textTransform 'uppercase'
// Barra de progreso: height 2px, scaleX GSAP, transformOrigin 'left center', color '#0057FF'
//   Track: background 'rgba(8,13,43,0.06)'
```

*Paneles de contenido:*
```tsx
// Panel izquierdo (narrativa / contexto principal)
{ background: '#FFFFFF', borderRight: '1px solid rgba(8,13,43,0.07)' }
// Panel derecho (datos / visualización)
{ background: '#F7F8FA' }
// Panel relleno (oscuro, cuando el artefacto tiene tema dark)
{ background: '#080D2B' }
```

*Mini-cards dentro de artefactos:*
```tsx
{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(8,13,43,0.07)', padding: '10px 12px' }
```

---

**Reglas globales en `globals.css`:**
- `html, body { overflow-x: hidden }` — previene deriva horizontal en móvil (ver `soluciones.md` #31)
- `.gsap-pin-spacer:has(#blockchain) { background: #080D2B }` — evita flash blanco del spacer en dark sections (ver `soluciones.md` #11e)
- `@media (max-width: 767px) { nav.hidden { display: none !important } }` — guard CSS contra GSAP sobreescribiendo `display` (ver `soluciones.md` #27)

**Clases CSS de utilidad disponibles en `globals.css`:**
- `.nav-cta` — botón CTA del nav (pill blanca sobre oscuro)
- `.grain` — overlay de ruido sutil (no se usa en v2 actualmente)
- `.will-transform` / `.will-opacity` — `will-change` performance hints
- `.word-clip` + `.word-inner` — word reveal animation con `wordUp` keyframe
- `.marquee-track` — marquee horizontal CSS (2 copias, `-50%`)
- `@keyframes areas-marquee` — marquee de 4 copias a `-25%` (TeamV2, AreasV2)
- `@keyframes heroScrollUp/Down` — columnas infinitas verticales (HeroV2)
- `@keyframes scrollBounce` — botón scroll-down del Hero
- `--ease-snap-out/in`, `--ease-out-flow`, `--ease-out-settle` — easings CSS custom
- `.gsap-pin-spacer:has(#ID)` — añadir aquí cualquier sección dark con `pin: true`
- `::selection` — color dorado UAI (`#C9A84C` sobre `#080D2B`)

---

**Orden de secciones en `app/page.tsx`:**
CursorV2 + ScrollUI → NavV2 → Hero → About → Blockchain → Areas → Projects → Process → Impact → Team → Contact → Footer
(MarqueeV2 y RoadmapV2 eliminados)

---

### Componentes v2 — estado detallado

**Hero (`HeroV2.tsx`) — muy avanzado:**
- Grid 2 col (`1fr 1.4fr`), padding `clamp(120px, 15vw, 220px)`, fondo cream
- H1: Ubuntu/Lato Light 300, `clamp(36px, 4.2vw, 68px)`, última línea en `#0057FF`
- Grilla doble (120px + subdivisión 24px); glow cursor (máscara radial, congelado al salir)
- Columna derecha: scroll infinito de cards (certificados, stats, pills, hashes)
- Botón "¿Qué es blockchain?" → `#blockchain`. Botón "Colaborar" → fade a blanco + jump a `#contacto` (`handleColaborar` con `e.preventDefault()` + overlay `document.createElement`). Ver soluciones.md #30.
- Botón scroll-down: solo en desktop (`!isMobile`), GSAP scrub fade-out al salir de la sección

**NavV2.tsx** — pill flotante que se expande a 1120px; hover-expand con 500ms delay

**AboutV2.tsx** — grid asimétrico `1fr 240px`; h2 `clamp(52px, 8vw, 112px)` weight 300; stats (100%, UAI, 7) en columna derecha; descripción 2-col al fondo con `borderTop` interno. Counter scroll trigger: `top 82%`. Ver `soluciones.md` #38.

**BlockchainV2.tsx** — sección oscura pinned (`PIN_MULT = 2`) **solo en desktop**. En móvil el pin está completamente deshabilitado (`if (!isMobile)` dentro de `useGSAP`); la sección tiene `height: auto; minHeight: 100svh`. Grid `1fr 1fr`: H2 clip+blur reveal a la izquierda / timeline vertical de 4 pasos (Segura → Transparente → Inmutable → Descentralizada) a la derecha. Dots Y headers del timeline clickeables (`onClick={() => handleDotClick(i)}`); en desktop usan `skipRef` + `lenis.scrollTo` + `onComplete`; en móvil llaman `activateStep(idx)` directamente sin scroll. Barras `scaleY` entre dots + barra global `scaleX` en el top. `anticipatePin: 1` + CSS `:has(#blockchain)` en globals evita flash blanco en desktop. `dependencies: [isMobile], revertOnUpdate: true` en `useGSAP`. Trigger de entrada: `top 88%` en móvil, `top 80%` en desktop. Ver `soluciones.md` #32.

**AreasV2.tsx** — lista editorial 7 áreas; h2 `clamp(44px, 6.5vw, 88px)`; filas con `borderTop` interno y hover `translateX(10px)` + acento `#60A0FF`; referencia de paleta dark. **Móvil:** hover/mouseenter deshabilitados — `onClick` hace toggle; descripción usa accordion inline (`maxHeight` transition) en lugar de `position: absolute` para no superponer filas. Ver `soluciones.md` #33.

**ProjectsV2.tsx** — grid 2 col, 2 proyecto-cards detalladas (CertificateMockup + DroneDashboard); h2 `clamp(44px, 6.5vw, 88px)`. **Patrón `isFeatureLayout`:** `const isFeatureLayout = feature && !isMobile` — controla `iconSz` (180px desktop / 40px móvil), `titleSz`, `pad`, `gap` y `justifyContent`. En móvil todas las cards son uniformes (ícono 40px, altura 200px). Ver `soluciones.md` #37.

**ProcessV2.tsx** — **sección light `#F8F8F4`** con artefacto interactivo tipo sala de control:
- Artefacto `height: isMobile ? '400px' : 'clamp(480px, 60vh, 600px)'`, `background: '#FFFFFF'` explícito (evita transparencia en móvil), `borderRadius: 20px`, split 42/58: panel izquierdo `#FFFFFF` (narrativa del paso) + panel derecho `#F7F8FA` (datos contextuales por etapa)
- Panel izquierdo: `flexGrow: isMobile ? 1 : 0`, `flexShrink: 0` — **nunca usar shorthand `flex`** (ver `soluciones.md` #36). En móvil el panel ocupa toda la altura del artefacto, permitiendo que el spacer flex empuje los botones al fondo.
- H2 móvil sin `<br/>`: `isMobile ? 'Cómo llevamos tu idea a producción.' : 'Cómo llevamos tu\nidea a producción.'` — ver #34
- 5 componentes de panel distintos: `PanelDiagnostico`, `PanelDiseno`, `PanelValidacion`, `PanelDesarrollo`, `PanelEscala` — cada uno con contenido específico real
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

## Stack

- Next.js 16.2.6 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (sin tokens; paleta hardcodeada inline)
- GSAP 3 + ScrollTrigger (animaciones scroll, incluyendo pin horizontal)
- Lenis smooth scroll — vinculado al ticker de GSAP en `LenisProvider.tsx`
- shadcn/ui vía `@base-ui/react`, Lucide icons
- Fuentes Google: Ubuntu → `--font-lato`, Roboto → `--font-inter`, Cantarell → `--font-oswald`, JetBrains Mono → `--font-jetbrains-mono`
- Alias de imports: `@/*` → raíz del proyecto

## Estructura

- `app/` — rutas (App Router). `app/page.tsx` (landing), `app/certificados/`,
  `app/validacion-pruebas-multimedia/`, `app/brochure/` (render del brochure)
- `components/v2/` — todos los componentes del rediseño
- `lib/gsap.ts` — instancia compartida de GSAP + ScrollTrigger
- `lib/useGridGlow.ts` — hook del efecto glow cursor
- `ppt/` — brochure del Lab (ver abajo)
- `soluciones.md` — **leer antes de tocar animaciones o scroll**. 26 problemas documentados con causa y solución:
  - Problemas 1–11: específicos de este proyecto (marquee, GSAP pin, Lenis sync, glow cursor, grilla de fondo, timeline vertical)
  - Problemas 12–24: patrones generales Next.js + GSAP reutilizables (hydration mismatch, Tailwind v4, SSR guard, overwrite tweens, stagger inverso, OG image con fuentes, `params` como Promise en Next.js 16, etc.)
  - Problema 25: race condition `busyRef` vs estado React en navegación por pasos — solución con `queueRef`
  - Problema 26: línea de progreso del timeline aparece pre-llenada — estado inicial en JSX en conflicto con `onUpdate` del ScrollTrigger

## Sistema de diseño heredado — NO USAR en componentes v2

Fondo `#0A0A0F` · superficie `#111118` · borde `#1E1E2E` / `#2A2A3C` ·
acento UAI `#3B5BDB` · acento muted `#1E2D6B` · oro `#C9A84C` ·
texto `#F0F0F5` / `#9898B0` / `#5A5A72`. Labels mono en mayúsculas con
`letter-spacing` amplio y color acento. Texturas: grain + orbes con blur.

## Brochure (`ppt/`)

Brochure institucional + venta de servicios. 15 láminas `.tsx` independientes
en **A4 horizontal** (1485 × 1050 px). **Sin imágenes**: solo tipografía, SVG y
CSS inline (no Tailwind, para que el render a PNG sea fiel). Centrado en la
presentación original "Blockchain-Lab-UAI", complementado con los proyectos.

- `ppt/_shared.tsx` — paleta, marco `Frame`, footer, helpers (`TOTAL = 15`)
- `ppt/lamina-01..15-*.tsx` — una lámina por archivo (orden = número)
- `app/brochure/page.tsx` — importa y apila las 15 láminas a tamaño exacto
- `ppt/render.mjs` — Playwright: captura cada `[data-lamina]` a PNG @2x
- `ppt/png/` — salida PNG (2972 × 2100). `ppt/Blockchain-Lab-UAI-Brochure.pdf`
- `ppt/README.md` — índice de láminas e instrucciones

Regenerar (requiere el dev server activo; toma 3000 o 3001 si está ocupado):

```bash
npm run dev
node ppt/render.mjs            # o BROCHURE_URL=http://localhost:3001/brochure node ppt/render.mjs
# PDF A4 landscape desde los PNG (img2pdf, sin recodificar):
python -c "import img2pdf,glob; layout=img2pdf.get_layout_fun((img2pdf.mm_to_pt(297),img2pdf.mm_to_pt(210))); open('ppt/Blockchain-Lab-UAI-Brochure.pdf','wb').write(img2pdf.convert(sorted(glob.glob('ppt/png/lamina-*.png')),layout_fun=layout))"
```

Al añadir/quitar láminas: actualizar `TOTAL` en `_shared.tsx`, los `page={N}`
de cada lámina y la lista en `app/brochure/page.tsx`.
