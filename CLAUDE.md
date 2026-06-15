# Blockchain Lab UAI

Sitio institucional del Blockchain Lab de la Universidad Adolfo Ibáñez + material de difusión. Objetivo: atraer empresas e instituciones como aliadas/clientes.

Rediseño v2 en branch `redesign-blueprint`. Todos los componentes en `components/v2/`; la landing es `app/page.tsx`. La landing está terminada en estética e interacciones — **el foco es crear páginas internas** manteniendo el sistema de diseño.

**Para remediar bugs o crear páginas nuevas, sigue `REMEDIATION_WORKFLOW.md`.**

## Guardrails (leer siempre)

- **Playwright:** SÍ para validación estructural en modo `reducedMotion: 'reduce'` / animaciones desactivadas. NO para testear timing o feel de animaciones (genera falsos positivos por el RAF sintético). *(Reemplaza la antigua regla "no usar Playwright".)*
- **Landing bloqueada:** no introducir cambios visuales sin aprobación explícita del usuario.
- **Regla de grilla (obligatoria):** toda sección/página mantiene la grilla de fondo + glow del cursor (`useGridGlow` + `<GridGlowLayers>`, `zIndex: 3` en el contenedor interior). Sin excepción.
- 
- **Color en dark:** acento `#60A0FF`, NUNCA `#0057FF` (ilegible en dark). En light el acento es `#0057FF`.
- **Cero dividers horizontales** en secciones cream (chocan con la grilla). En dark, dividers sutiles `rgba(255,255,255,0.07)` sí se permiten.
- **Cursor estándar** del sistema; no cursores personalizados (`CursorV2.tsx` existe pero no se importa).
- **Nunca mezclar** el shorthand `flex` con `flexShrink`/`flexGrow` longhand en el mismo elemento.
- **No usar el sistema de diseño heredado** (`#0A0A0F`, etc.) en componentes v2.
- **Animación de entrada estándar:** `y: 72–80, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out'`; triggers `top 70–95%`.

## Stack

Next.js 16.2.6 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 (paleta hardcodeada inline) · GSAP 3 + ScrollTrigger · Lenis (ligado al ticker de GSAP en `LenisProvider.tsx`) · shadcn/ui vía `@base-ui/react` + Lucide · fuentes Google: `--font-lato` (DISPLAY), `--font-inter` (BODY), `--font-oswald` (LABEL), `--font-jetbrains-mono` (MONO) · alias `@/*` → raíz.

## Estructura

- `app/` — rutas. `page.tsx` (landing), `certificados/`, `validacion-pruebas-multimedia/`, `brochure/`
- `components/v2/` — todos los componentes del rediseño
- `lib/gsap.ts` (instancia GSAP + ScrollTrigger), `lib/useGridGlow.ts` (glow cursor)
- `soluciones.md` — problemas resueltos con causa/solución
- `incidents/` — memoria de bugs resueltos vía workflow (ver `incidents/index.md`)
- `design/` — sistema de diseño detallado (leer on-demand, ver Documentación)
- `lore/` — patrones genéricos cross-project (ver `lore/index.md`)

## Orden de secciones (`app/page.tsx`)

CursorV2 + ScrollUI → NavV2 → Hero → About → Blockchain → Areas → Projects → Process → Impact → Team → Contact → Footer.

## Componentes v2 (una línea c/u)

- **NavV2** — pill flotante centrada que se expande a 1120px en hover (500ms); animación GSAP de entrada solo en `/` (internas: `gsap.set` inmediato vía `usePathname` — INC-001).
- **HeroV2** — portada editorial; grid 2col; H1 weight 300; columna derecha con scroll infinito de cards; grilla doble + glow; botón "Colaborar" → fade a blanco + jump a `#contacto` (soluciones.md #30).
- **AboutV2** — grid asimétrico; H2 gigante weight 300; stats con counter animado (trigger top 82%, #38).
- **BlockchainV2** — sección dark pinned solo en desktop (`PIN_MULT=2`); móvil sin pin (`height: auto`); timeline vertical de 4 pasos, dots/headers clickeables; flash blanco evitado con `:has(#blockchain)` (#32).
- **AreasV2** — lista editorial de 7 áreas; referencia de paleta dark; en móvil = accordion inline (#33).
- **ProjectsV2** — bento grid; cards transparentes; patrón `isFeatureLayout = feature && !isMobile` (#37).
- **ProcessV2** — sección light con artefacto interactivo (5 paneles); `busyRef` + `queueRef` (#25); panel izq `flexGrow` longhand, nunca shorthand (#36); H2 móvil sin `<br/>` (#34).
- **ImpactV2** — cream; stat grid con counter; H2 condicional sin `<br/>` en móvil (#38, #39).
- **TeamV2** — dark; marquee header heredado de AreasV2; 4 photo-cards con gradientes SVG.
- **ContactV2** — dark; email gigante como cierre; reveal top 92% (#38).
- **FooterV2** — cream; grilla + glow; links + logos UAI; email de contacto; reveal top 95% (#38).
- **CursorV2** — existe pero NO se usa.
- **ScrollUI** — línea de progreso vertical 2px a la derecha, `#60A0FF`.
- **GridGlowLayers / useGridGlow** — grilla doble compartida + glow cursor; `useGridGlow(true)` para dark.

## Documentación detallada (leer on-demand, NO @import)

- `design/tokens.md` — colores (light/dark), tipografía, sombras, espaciado, botones/pills, artefactos, clases de `globals.css`.
- `design/sections.md` — guía estética por sección (feeling, efectos) + principios transversales + regla de grilla.
- `design/components.md` — estado técnico detallado de cada componente.
- `soluciones.md` — antes de tocar animaciones/scroll.
- `incidents/index.md` — índice de bugs resueltos vía workflow.
- `lore/index.md` — índice de patrones genéricos.
