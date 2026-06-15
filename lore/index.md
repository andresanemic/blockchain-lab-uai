# lore/index.md — Índice de patrones genéricos

Una línea por patrón. Formato: `sistema · síntoma · confianza · archivo`

---

## animation

- `animation` · HTML visible antes del estado inicial GSAP (FOUC) · confirmado · [animation.md](animation.md)
- `animation` · Marquee CSS con salto visual al reiniciar el loop · confirmado · [animation.md](animation.md)
- `animation` · Barra de progreso con `scaleX` en lugar de `width` — cero reflow · confirmado · [animation.md](animation.md)
- `animation` · Pin GSAP termina antes del último paso del timeline · confirmado · [animation.md](animation.md)
- `animation` · Columnas de scroll infinito verticales con `@keyframes` CSS · confirmado · [animation.md](animation.md)
- `animation` · Salto al inicio en pin scrubbed — señal de config errónea del ScrollTrigger · confirmado · [animation.md](animation.md)
- `animation` · `skipRef` + `onComplete` para bloquear clicks durante animación pinneada · confirmado · [animation.md](animation.md)
- `animation` · Offset vertical al salir del pin por falta de `anticipatePin: 1` · confirmado · [animation.md](animation.md)
- `animation` · Toggle de clase CSS vs GSAP para transiciones de opacidad simples · confirmado · [animation.md](animation.md)
- `animation` · Flash blanco al entrar en sección pinneada con fondo oscuro · confirmado · [animation.md](animation.md)
- `animation` · Clip + blur reveal para headings: `translateY(108%) → 0` + `blur(12px) → 0` · confirmado · [animation.md](animation.md)
- `animation` · Texto scramble / decodificación letra a letra con `setInterval` · confirmado · [animation.md](animation.md)
- `animation` · `overwrite: true` previene tweens apilados en clicks rápidos consecutivos · confirmado · [animation.md](animation.md)
- `animation` · `setState` durante tween GSAP provoca re-render con salto visual · confirmado · [animation.md](animation.md)
- `animation` · `stagger` nativo GSAP vs `delay` manual para secuencias de entrada · confirmado · [animation.md](animation.md)
- `animation` · `busyRef` + `queueRef` para encolar clics durante animación sin perderlos · confirmado · [animation.md](animation.md)
- `animation` · `gsap.fromTo` obligatorio cuando el estado inicial está en `style` inline · confirmado · [animation.md](animation.md)
- `animation` · GSAP sobreescribe `display:none` — necesita guard de viewport + CSS `!important` · confirmado · [animation.md](animation.md)
- `animation` · Pin GSAP en móvil debe desactivarse completamente con guard `isMobile` · confirmado · [animation.md](animation.md)
- `animation` · Triggers `top 88–95%` para que las animaciones disparen en cuanto el elemento asoma · confirmado · [animation.md](animation.md)
- `animation` · GSAP entrance sin bifurcación por ruta → FOUC ~1.4s en páginas no-target · conjetura · [animation.md](animation.md)

## testing

- `testing` · MutationObserver + gap discriminator para testear `gsap.set` vs `gsap.fromTo` sin depender de timing · conjetura · [testing.md](testing.md)

## scroll

- `scroll` · Lenis + ScrollTrigger desincronizados — sync via GSAP ticker es obligatorio · confirmado · [scroll.md](scroll.md)
- `scroll` · `lenis.scrollTo` fuera del Provider — acceder via `useLenis()` hook · confirmado · [scroll.md](scroll.md)
- `scroll` · `100vh` desborda en iOS Safari — usar `100svh` en secciones full-height · confirmado · [scroll.md](scroll.md)
- `scroll` · LenisProvider intercepta anchors y lanza scroll en paralelo al handler del componente · confirmado · [scroll.md](scroll.md)
- `scroll` · Navegación SPA con Lenis — scroll position no se resetea entre páginas · confirmado · [scroll.md](scroll.md)

## layout

- `layout` · `backgroundAttachment: fixed` alinea grillas continuas entre secciones · confirmado · [layout.md](layout.md)
- `layout` · Glow de cursor: dos capas absolutas + `mask-image` radial evitan repaints · confirmado · [layout.md](layout.md)
- `layout` · `line-height: 1` recorta ascenders/descenders en fuentes display con `overflow:hidden` · confirmado · [layout.md](layout.md)
- `layout` · `overflow:hidden` en `<section>` recorta el H2 por encima del marquee · confirmado · [layout.md](layout.md)
- `layout` · Gradiente dinámico: actualizar `setProperty('--sx')` en lugar de reescribir la cadena · confirmado · [layout.md](layout.md)
- `layout` · Shorthand `flex` + longhand `flexShrink` en el mismo elemento produce warning React · confirmado · [layout.md](layout.md)
- `layout` · `overflow-x: hidden` en `html` Y `body` para bloquear deriva lateral en móvil · confirmado · [layout.md](layout.md)

## responsive

- `responsive` · Cursor personalizado en táctil: guard con `window.matchMedia('(pointer: fine)')` · confirmado · [responsive.md](responsive.md)
- `responsive` · MONO uppercase con `letterSpacing >= 0.12em` desborda en móvil si tiene `<br/>` manual · confirmado · [responsive.md](responsive.md)
- `responsive` · `<br/>` manual en H2 genera salto de línea incorrecto en móvil — usar JSX condicional · confirmado · [responsive.md](responsive.md)
- `responsive` · `clamp()` solo no basta para padding en móvil — el mínimo de 96px es demasiado · confirmado · [responsive.md](responsive.md)

## routing

- `routing` · GSAP plugins acceden a `window` — centralizar en `lib/gsap.ts` con guard SSR · confirmado · [routing.md](routing.md)
- `routing` · Hydration mismatch con `Date.now()` — estado inicial `null` + `useEffect` solo en cliente · confirmado · [routing.md](routing.md)
- `routing` · Next.js 16: `params` y `searchParams` son `Promise` — hacer `await params` · confirmado · [routing.md](routing.md)
- `routing` · Tailwind v4: sin `tailwind.config.ts` — tokens en `@theme {}` dentro del CSS · confirmado · [routing.md](routing.md)
- `routing` · OG image: Google Fonts no disponibles en build — cargar `.ttf` local con `readFile` · confirmado · [routing.md](routing.md)
- `routing` · `title.absolute` para que la homepage ignore el template de título del layout · confirmado · [routing.md](routing.md)
