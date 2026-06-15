# lore/routing.md — Navigation / Routing (Next.js App Router)

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [routing] GSAP falla en SSR / build de Next.js — `window is not defined`

- Contexto: Cualquier proyecto Next.js con GSAP plugins (ScrollTrigger, SplitText, etc.).
- Causa probable: Los plugins de GSAP acceden a `window` en el momento del import. Next.js renderiza en el servidor donde `window` no existe.
- Pista: Centralizar todos los imports de GSAP en un único archivo (`lib/gsap.ts`). El registro de plugins debe estar dentro de un guard `if (typeof window !== 'undefined')`. Nunca importar `{ gsap } from 'gsap'` directamente en componentes — siempre desde el archivo centralizado donde el guard ya existe.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [routing] Hydration mismatch en componentes con estado dependiente del tiempo

- Contexto: Contadores regresivos, relojes, fechas calculadas, cualquier valor que dependa de `Date.now()`.
- Causa probable: El servidor renderiza el componente con un valor de tiempo que diverge inevitablemente del primer render del cliente. React detecta la diferencia y lanza error de hydration (o parpadeo silencioso).
- Pista: Estado inicial `null` en SSR + `useEffect` para asignar el valor real solo en cliente. Si el salto de altura al aparecer el componente es un problema, usar un skeleton con las mismas dimensiones. Aplica a cualquier valor que dependa de `Date`, `Math.random()`, `window`, `navigator` o `localStorage`.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [routing] Next.js 16 — `params` y `searchParams` son Promise (breaking change)

- Contexto: Páginas y layouts del App Router con rutas dinámicas (`[slug]`, `[id]`...).
- Causa probable: Next.js 16 cambió `params` de objeto síncrono a `Promise`. El código pre-v16 que accede `params.slug` directamente recibe `undefined` en runtime.
- Pista: Las firmas de las páginas deben ser `async` y hacer `const { slug } = await params`. El tipo es `Promise<{ slug: string }>`, no `{ slug: string }`. TypeScript debería detectar el uso incorrecto si los tipos están actualizados. Aplica también a `searchParams`.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [routing] Tailwind CSS v4 — setup incompatible con configuración de v3

- Contexto: Proyecto nuevo con `tailwindcss@^4` que sigue documentación o tutoriales de v3.
- Causa probable: Tailwind v4 eliminó `tailwind.config.ts` como método principal de configuración y cambió el sistema de imports en CSS. El import `@tailwind base/components/utilities` no existe en v4.
- Pista: v4 usa `@import 'tailwindcss'` en el CSS principal. Los colores y tokens custom van en `@theme {}` dentro del CSS, no en `tailwind.config.ts`. Los tokens de `@theme` generan clases de Tailwind directamente (`--color-accent` → `bg-accent`). Cualquier configuración de color en `tailwind.config.js/ts` es ignorada en v4.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [routing] OG image usa fuente fallback — Google Fonts no disponibles en build time

- Contexto: `opengraph-image.tsx` con `new ImageResponse(...)` y una fuente de Google Fonts cargada via `next/font/google`.
- Causa probable: Satori (motor interno de `next/og`) no puede hacer requests HTTP externos durante la generación estática. `next/font/google` tampoco está disponible en ese contexto.
- Pista: El archivo `.ttf` de la fuente debe estar en el proyecto (ej. `assets/`) y cargarse con `readFile(join(process.cwd(), 'assets/Font.ttf'))`. Pasar el buffer al array `fonts` de `ImageResponse`. El `name` en `fonts` debe coincidir exactamente con el `fontFamily` en el JSX.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [routing] Página de inicio hereda el template de título del layout padre

- Contexto: Layout con `title.template: '%s | Nombre del Sitio'`. La homepage necesita un título propio sin el sufijo.
- Causa probable: `title: 'texto'` en una página siempre pasa por el `%s` del template del layout. No hay forma de saltarse el template con el campo `title` normal.
- Pista: `title: { absolute: 'Título completo' }` ignora el template completamente. Usar en homepages, páginas de error, y cualquier página donde el nombre del sitio ya está incluido en el título o el formato del template no aplica.
- Confianza: confirmado
- ⚠ Validar contra código actual.
