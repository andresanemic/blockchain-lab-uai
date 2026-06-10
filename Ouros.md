# Ouro Labs — Guía de Estilo y Estética

Referencia completa extraída directamente del sitio https://www.ouro-labs.com/ con Playwright MCP (2026-05-29). Usar esta guía cuando el usuario diga **"hazlo como si lo hiciera Ouro Labs"**.

---

## 🧠 Filosofía y Visión

Ouro Labs es un estudio de diseño/tecnología con una identidad visual brutalmente clara: **la tipografía masiva ES el diseño**. No hay ilustraciones, no hay fotografías de héroe, no hay gradientes. El contenido visual es casi exclusivamente texto dispuesto con precisión extrema.

### Principios que definen su estética:

**1. Tipografía como arquitectura**
El tipo no acompaña al diseño — el tipo ES el diseño. Los títulos ocupan toda la pantalla. El tamaño llega a 182px. El peso es casi siempre normal (400), no bold, lo que produce una tensión inesperada entre escala gigante y delicadeza del trazo.

**2. Austeridad calculada**
Nada es decorativo. Cada elemento existe porque cumple una función. El espacio vacío es intencional y abundante. No hay shadows, no hay border-radius grandes, no hay gradients. La jerarquía se construye solo con tamaño y color.

**3. Tensión cromática mínima**
Fondo neutro cálido + tinta negra + un solo acento rojo encendido. Cuando aparece el rojo, lo hace con propósito: una palabra clave, un número, un CTA. El amarillo neón solo aparece en la selección de texto — es un easter egg para quien lee atentamente.

**4. Movimiento con propósito**
Las animaciones no son decorativas. Son consecuencia del scroll: el hero se queda fijo mientras el contenido sube sobre él (sticky scroll). Las entradas de elementos son simples (fade + translateY), nunca exageradas. El cursor custom es la única animación "ambient" permanente.

**5. Misterio institucional**
El sitio no explica quiénes son con un "About Us" convencional. La identidad emerge del trabajo. El equipo permanece en segundo plano. El sitio habla por sí solo.

---

## 🎨 Paleta de Colores (valores exactos del CSS)

| Variable | Valor | Uso |
|---|---|---|
| `--bg` / `--pampas` | `#dddbd6` | Fondo principal — gris topo cálido |
| `--surface` | `#d0cec9` | Superficie ligeramente más oscura (hover, separadores) |
| `--ink` | `#000000` | Tinta negra — texto principal |
| `--ink-muted` | `#b5afa6` | Texto secundario, labels, metadatos |
| `--ink-muted-statement` | `#9e9890` | Texto terciario aún más apagado |
| `--ink-watermark` | `rgba(0,0,0,0.10)` | Textos decorativos de fondo, watermarks |
| `--red` | `#ff1b00` | Acento rojo — el único color vibrante del sistema |
| `--selection` | `#eaff00` | Amarillo neón — SOLO para `::selection` |
| `--card-dark` | `#0a0a0a` | Fondo de cards oscuras / secciones invertidas |
| `--on-dark` | `#e4e3e0` | Texto sobre fondo oscuro |
| `--on-dark-muted` | `#f2f1ec` | Texto secundario sobre fondo oscuro |

### Reglas de uso del color:
- El rojo `#ff1b00` aparece en **máximo 1-2 palabras por sección** — nunca como fondo
- El amarillo `#eaff00` **solo en `::selection`** — nunca como color UI
- Las secciones oscuras (`#0a0a0a`) se usan para breaks de ritmo visual, no como patrón dominante
- El fondo `#dddbd6` es cálido (tiene un leve matiz amarillo), no frío — no sustituir por grises puros

---

## 🔤 Sistema Tipográfico

### Fuentes
| Rol | Familia | Fuente |
|---|---|---|
| Display / Títulos | **Space Grotesk** | Google Fonts |
| Body / UI | **Inter** | Google Fonts |
| Monospace / Datos | `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas` | Sistema |

### Escala tipográfica

| Elemento | Tamaño | Peso | Transform | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Hero H1 | `clamp(64px, 16.5vw, 182px)` | 400 | `uppercase` | `0.90–0.92` | `-0.02em` |
| Section H2 | `clamp(32px, 5vw, 64px)` | 400–500 | `uppercase` | `1.0–1.1` | `-0.01em` |
| Subheading H3 | `clamp(20px, 3vw, 40px)` | 400 | `uppercase` | `1.1` | `-0.01em` |
| Body largo | `16–18px` | 400 | none | `1.5–1.6` | `0` |
| Nav links | `~13.5px` | 500 | `uppercase` | — | `0.08em` |
| Labels / meta | `10–11px` | 400 | none | `1.5` | `0.04em` |
| Watermark | `clamp(80px, 15vw, 160px)` | 400 | `uppercase` | `1` | `-0.02em` |

### Convenciones tipográficas críticas:
- Los títulos hero siempre en **UPPERCASE** — es parte del DNA, no opcional
- El peso de los títulos es **400 (normal)**, nunca bold — la escala hace el trabajo del peso
- Una o dos palabras clave en `color: #ff1b00` dentro del título — máximo
- El `line-height` de los heroes es menor a 1 (`0.90–0.92`) — las líneas se solapan visualmente en mobile
- **Nunca** usar serif fonts — todo el sistema es sin serif

---

## 📐 Layout y Espaciado

### Contenedor principal
```css
.content-max {
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 48px);
}
```

### Grid y espaciado
- `grid-gap` entre columnas grandes: `88px`
- `paddingBlock` de secciones: `clamp(80px, 12vh, 120px)`
- El espacio vacío es generoso — nunca comprimir secciones
- Separadores: líneas de `1px` en `rgba(0,0,0,0.10)` — apenas visibles

### Patrones de layout por sección:
- **Hero**: texto ocupa 60–70% del ancho, sin columnas, texto a la izquierda
- **Secciones de contenido**: flex row con `justify-between`, título izquierda + meta derecha
- **Cards**: grid de 2 columnas en desktop, 1 en mobile
- **Marquee**: full-width, sin padding lateral, texto que desborda los márgenes

---

## ⚡ Animaciones y Motion

### Filosofía del movimiento
El movimiento es **consecuencia del usuario**, no decoración autónoma. Casi todo es scroll-driven o hover-driven. No hay animaciones de entrada automáticas en loop (excepto el marquee y el cursor).

### Scroll: Hero sticky
El elemento más característico de Ouro Labs:
```
Hero section: position sticky, top 0
→ el hero se queda fijo en pantalla
→ el contenido siguiente sube sobre él
→ crea efecto de "revelar" el sitio debajo del hero
```

### Entradas de elementos (ScrollTrigger)
```js
gsap.fromTo(el, 
  { opacity: 0, y: 48 },
  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { start: 'top 88%' } }
)
```

### Easings (extraídos del CSS)
```css
--ease-snap-out:    cubic-bezier(0.2, 0.88, 0.12, 1);   /* entrada rápida, freno suave */
--ease-snap-in:     cubic-bezier(0.55, 0, 0.95, 0.38);  /* salida brusca */
--ease-out-flow:    cubic-bezier(0.22, 1, 0.52, 1);     /* fluido, natural */
--ease-out-settle:  cubic-bezier(0.33, 1, 0.68, 1);     /* se asienta suavemente */
```

### Hover en cards
- Tilt 3D sutil (máximo 8–10°) con `perspective: 1000px`
- Spotlight rojo que sigue al cursor (radial-gradient en `::before`)
- Easing asimétrico: entrada lenta (`0.4s ease-out-flow`), salida rápida (`0.15s ease-snap-in`)

### Marquee
- **CSS puro** (no GSAP) — más confiable, sin flash de inicio
- Dos filas en direcciones opuestas
- Pausa en hover (`animation-play-state: paused`)
- 4 copias del contenido para garantizar que no haya huecos en ningún viewport
- Velocidad: ~34–40s por ciclo completo

### Duración de transiciones
| Tipo | Duración |
|---|---|
| Hover rápido (color, opacity) | `150–200ms` |
| Hover medio (transform, spotlight) | `300–400ms` |
| Entrada con scroll | `700–900ms` |
| Salida de hover card | `150ms` |

---

## 🖱️ Detalles de Interacción

### Cursor custom
```css
body { cursor: none; }
a, button, [role="button"] { cursor: none; }
```
- Un dot negro pequeño (~8px) que sigue al cursor exacto
- En contextos oscuros (`data-theme="dark"`): dot cambia a rojo `#ff1b00`
- No usar ring/canvas si no es necesario — el dot solo es suficiente

### Selección de texto
```css
::selection {
  background-color: #eaff00;  /* amarillo neón — sorprendente */
  color: #000000;
}
```
Es uno de los detalles más memorables del sitio. Cuando el usuario selecciona texto, el amarillo neón es inesperado y delicioso.

### Scrollbar
```css
html {
  scrollbar-color: #ff1b00 #dddbd6;
  scrollbar-width: thin;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background-color: #ff1b00; border-radius: 0; }
```
La barra de scroll roja sobre fondo topo es un detalle elegante y coherente.

---

## 🧱 Patrones de Componentes

### Navbar
```
- Fondo: transparente sobre hero, sólido (#dddbd6) al hacer scroll
- Logo: izquierda, icónico y pequeño
- Links: UPPERCASE, Inter 500, ~13.5px, letter-spacing 0.08em
- Sin submenús, sin dropdowns — máxima simplicidad
- CTA: texto plano con flecha →, sin botón con fondo
```

### Cards de contenido (sobre fondo oscuro)
```
- Fondo: #0a0a0a (casi negro, no negro puro)
- Texto: #e4e3e0
- Sin border-radius grande — máximo 2–4px o 0px
- Sin sombras externas
- Padding generoso: 32–48px
- Separadores internos: 1px #ffffff20
```

### CTAs / Botones
```
- Primario: fondo sólido (rojo #ff1b00 o negro), texto blanco/negro
- Texto: UPPERCASE, Inter 500, letter-spacing 0.08em
- Sin border-radius redondeado — cuadrado o mínimo
- Con flecha → al final del texto
- Hover: invert o subtle scale
```

### Separadores de sección
```
- Línea 1px: rgba(0,0,0,0.10) — casi invisible
- Nunca usar hr decorativo grueso
- El cambio de color de fondo (#dddbd6 ↔ #0a0a0a) actúa como separador
```

---

## 💬 Tono de Voz

### Cómo escribe Ouro Labs:
- **Frases cortas y directas** — no hay párrafos largos en el hero
- **Sin signos de exclamación** — la confianza no necesita gritar
- **Verbos de acción en imperativo o infinitivo**: "Diseñar", "Construir", "Lanzar"
- **Primera persona plural** cuando hablan del estudio: "Construimos..."
- **El trabajo habla por sí solo** — mínima auto-descripción

### Lo que NO hace:
- No usa jerga corporativa ("soluciones innovadoras", "ecosistema")
- No tiene "misión y visión" explícita
- No explica quiénes son — lo demuestra
- No usa muchos adjetivos

---

## 🚫 Lo que Ouro Labs NUNCA haría

Estas son las cosas que destruirían la estética si se incluyeran:

- ❌ Gradientes de color (excepto los fades laterales del marquee, que son funcionales)
- ❌ Sombras de caja (`box-shadow`) en elementos de UI
- ❌ Border-radius mayor a 4px en componentes principales
- ❌ Colores vibrantes adicionales al rojo y amarillo-neón
- ❌ Fotografías o ilustraciones decorativas en hero
- ❌ Iconos de FontAwesome o similares — solo SVGs propios y minimalistas
- ❌ Animaciones en loop continuo (excepto marquee) que distraigan
- ❌ Tooltips, modals o overlays complejos
- ❌ Texto body en mayúsculas — UPPERCASE solo para títulos y nav
- ❌ Más de 2 pesos de fuente en una misma sección (400 + 500 máximo)
- ❌ Footer denso con links y columnas — solo lo esencial
- ❌ Colores de fondo distintos a los tokens del sistema

---

## 🔧 CSS Tokens de Referencia

```css
@theme {
  /* Colores */
  --color-bg:              #dddbd6;
  --color-surface:         #d0cec9;
  --color-card:            #0a0a0a;
  --color-accent:          #ff1b00;
  --color-accent-2:        #eaff00;
  --color-ink:             #000000;
  --color-ink-muted:       #5a5550;   /* ajustado para WCAG AA */
  --color-on-dark:         #e4e3e0;
  --color-on-dark-muted:   #f2f1ec;

  /* Fuentes */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;

  /* Layout */
  --content-max: 1240px;
  --grid-gap:    88px;

  /* Easings */
  --ease-snap-out:   cubic-bezier(0.2, 0.88, 0.12, 1);
  --ease-snap-in:    cubic-bezier(0.55, 0, 0.95, 0.38);
  --ease-out-flow:   cubic-bezier(0.22, 1, 0.52, 1);
  --ease-out-settle: cubic-bezier(0.33, 1, 0.68, 1);
}

/* Selección */
::selection {
  background-color: #eaff00;
  color: #000000;
}

/* Scrollbar */
html {
  scrollbar-color: #ff1b00 #dddbd6;
  scrollbar-width: thin;
}
```

---

## 🧪 Checklist "¿Es Ouro Labs?"

Antes de entregar un diseño o componente, verificar:

- [ ] ¿El texto principal está en UPPERCASE con Space Grotesk?
- [ ] ¿El tamaño del título es lo suficientemente grande? (¿podría ser más grande?)
- [ ] ¿El rojo aparece en máximo 1–2 palabras o elementos por sección?
- [ ] ¿Hay suficiente espacio vacío? (si parece "lleno", agregar más padding)
- [ ] ¿La selección de texto muestra amarillo neón?
- [ ] ¿El cursor está oculto (`cursor: none`) y hay un cursor custom?
- [ ] ¿No hay sombras, gradientes decorativos ni border-radius grandes?
- [ ] ¿Las animaciones son sutiles y consecuencia del scroll/hover?
- [ ] ¿La paleta está dentro de los tokens definidos?
- [ ] ¿El peso tipográfico es 400 (normal) en los títulos grandes?
