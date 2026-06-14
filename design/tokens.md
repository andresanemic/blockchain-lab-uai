# Design Tokens — Blockchain Lab UAI

## Paleta del rediseño — Sistema de color completo

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
| Dividers | **PROHIBIDOS** — usar solo `gap`/`margin`/`padding` | Ver regla en design/sections.md |

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

---

## Sistema de sombras (capas dobles siempre — nunca una sola)

- **Cards reposo (light):** `0 1px 4px rgba(8,13,43,0.06), 0 4px 16px rgba(8,13,43,0.04)`
- **Cards hover (light):** `0 20px 56px rgba(8,13,43,0.10), 0 8px 24px rgba(8,13,43,0.06)`
- **Cards reposo (dark):** `0 2px 16px rgba(0,0,0,0.28)` — usar negro puro en dark (el fondo ya es navy)
- **Cards hover (dark):** `0 20px 56px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.18)`
- **Pills blockchain (dark):** añadir `0 1px 0 rgba(255,255,255,0.05) inset`
- **Pills blockchain (light):** `0 2px 8px rgba(8,13,43,0.06), 0 8px 20px rgba(8,13,43,0.04)`; hover: `+ 0 0 0 4px rgba(8,13,43,0.08)`
- Regla: sombras en cream usan `rgba(8,13,43,…)` no negro puro.

---

## Sistema de espaciado por sección — desktop vs móvil

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

## Escala tipográfica — referencia completa

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

## Sistema de botones y pills

*CTA primario (azul):* `{ padding:'13px 22px', borderRadius:'8px', fontFamily:MONO, fontSize:'12px', letterSpacing:'0.10em', textTransform:'uppercase', background:'#0057FF', color:'#F8F8F4' }` — hover `opacity:0.82`

*CTA nav (pill blanca dark):* clase `.nav-cta` en globals.css — `padding:10px 22px, borderRadius:9px, bg:rgba(255,255,255,0.92), border:rgba(255,255,255,0.70), color:rgba(8,13,43,0.85)`

*Step pills activo (ProcessV2, light):*
```tsx
{ border:'1px solid rgba(0,87,255,0.35)', background:'rgba(0,87,255,0.06)', color:'#0057FF',
  boxShadow:'0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10), 0 2px 8px rgba(8,13,43,0.06), inset 0 1px 0 rgba(255,255,255,0.60)',
  fontFamily:MONO, fontSize:'12px', letterSpacing:'0.10em', padding:'5px 12px', borderRadius:'4px' }
// Inactivo: border rgba(8,13,43,0.16), color rgba(8,13,43,0.50)
// Transición: 0.22s cubic-bezier(0.16,1,0.3,1)
```

*Botones ← → (artefacto):* avance `border:rgba(0,87,255,0.30), bg:rgba(0,87,255,0.05), color:#0057FF, fontSize:10px` — retroceso `border:rgba(8,13,43,0.20), color:rgba(8,13,43,0.55)` — disabled `border:rgba(8,13,43,0.09), color:rgba(8,13,43,0.20)`

*Tags light:* neutral `border:rgba(8,13,43,0.10), color:rgba(8,13,43,0.38)` — azul `border:rgba(0,87,255,0.25), color:#0057FF` — verde `border:rgba(22,163,74,0.25), color:#16a34a`

*Tags / badges dark (todas las secciones `#080D2B`):*
```tsx
{ fontFamily:MONO, fontSize:'9px–10px', fontWeight:700,
  border:'1px solid rgba(96,160,255,0.40)', color:'rgba(96,160,255,0.90)',
  boxShadow:'0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)',
  padding:'4px 10px', borderRadius:'3px–4px' }
```

---

## Sistema de artefactos (ProcessV2, HeroV2)

*Contenedor:* `borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(8,13,43,0.10)', boxShadow:'0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.16), 0 40px 80px rgba(8,13,43,0.12), 0 0 0 1px rgba(8,13,43,0.06)', display:'flex', flexDirection:'column'` — altura: `clamp(480px,60vh,600px)` — entrada: `opacity:0, x:56, scale:0.96, expo.out 1.4s`

*Header bar:* `background:'#F7F8FA', padding:'14px 18px 10px', borderBottom:'1px solid rgba(8,13,43,0.07)'` — dot verde `#16a34a, boxShadow:'0 0 5px rgba(22,163,74,0.6)'` — label MONO `fontSize:9px, letterSpacing:'0.18em'` — barra progreso `height:2px, scaleX GSAP, color:#0057FF`, track `rgba(8,13,43,0.06)`

*Paneles:* izquierdo `#FFFFFF + borderRight:rgba(8,13,43,0.07)` — derecho `#F7F8FA` — dark `#080D2B` — mini-cards `#FFFFFF, borderRadius:8px, border:rgba(8,13,43,0.07), padding:10px 12px`

---

## Reglas globales y clases CSS en globals.css

**Reglas globales:**
- `html, body { overflow-x: hidden }` — previene deriva horizontal en móvil (ver `soluciones.md` #31)
- `.gsap-pin-spacer:has(#blockchain) { background: #080D2B }` — evita flash blanco del spacer en dark sections (ver `soluciones.md` #11e)
- `@media (max-width: 767px) { nav.hidden { display: none !important } }` — guard CSS contra GSAP sobreescribiendo `display` (ver `soluciones.md` #27)

**Clases CSS de utilidad disponibles:**
- `.nav-cta` — botón CTA del nav (pill blanca sobre oscuro)
- `.will-transform` / `.will-opacity` — `will-change` performance hints
- `.word-clip` + `.word-inner` — word reveal animation con `wordUp` keyframe
- `.marquee-track` — marquee horizontal CSS (2 copias, `-50%`)
- `@keyframes areas-marquee` — marquee de 4 copias a `-25%` (TeamV2, AreasV2)
- `@keyframes heroScrollUp/Down` — columnas infinitas verticales (HeroV2)
- `@keyframes scrollBounce` — botón scroll-down del Hero
- `--ease-snap-out/in`, `--ease-out-flow`, `--ease-out-settle` — easings CSS custom
- `.gsap-pin-spacer:has(#ID)` — añadir aquí cualquier sección dark con `pin: true`
- `::selection` — color dorado UAI (`#C9A84C` sobre `#080D2B`)
