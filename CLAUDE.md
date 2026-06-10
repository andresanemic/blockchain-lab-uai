@AGENTS.md

# Blockchain Lab UAI

Sitio institucional del Blockchain Lab de la Universidad Adolfo Ibáñez +
material de difusión. Objetivo: atraer empresas e instituciones como
aliadas/clientes. Contacto: `blockchain@uai.cl`.

## Stack

- Next.js 16.2.6 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (sin tokens; paleta hardcodeada inline)
- GSAP 3 + ScrollTrigger (animaciones), shadcn/ui vía `@base-ui/react`, Lucide
- Fuentes: Inter (`--font-inter`) + JetBrains Mono (`--font-jetbrains-mono`)
- Alias de imports: `@/*` → raíz del proyecto

## Estructura

- `app/` — rutas (App Router). `app/page.tsx` (landing), `app/certificados/`,
  `app/validacion-pruebas-multimedia/`, `app/brochure/` (render del brochure)
- `components/` — secciones del sitio (Hero, Team, …) y subcarpetas
  `certificados/`, `validacion/`, `ui/`
- `ppt/` — brochure del Lab (ver abajo)
- `lib/gsap.ts` — instancia compartida de GSAP

## Sistema de diseño (paleta inline)

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
