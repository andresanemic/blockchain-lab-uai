# lore/scroll.md — Lenis / Scroll nativo

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [scroll] Lenis + ScrollTrigger desincronizados / salto al volver al tab

- Contexto: Cualquier proyecto con Lenis y GSAP ScrollTrigger activos simultáneamente.
- Causa probable: Lenis y GSAP corren sus propios `requestAnimationFrame` independientes. ScrollTrigger lee `window.scrollY` pero Lenis lo interpola en su propio tick — si los ticks no están sincronizados, ScrollTrigger lee valores obsoletos. El salto al volver al tab lo causa `gsap.ticker.lagSmoothing()` por defecto: GSAP "compensa" el tiempo transcurrido en segundo plano saltando hacia adelante.
- Pista: Verificar si Lenis está atado al ticker de GSAP (`gsap.ticker.add(...)`) y si `lagSmoothing(0)` está activo. Sin esto, cualquier scrub o animación ligada al scroll puede desincronizarse. Si el síntoma aparece solo al volver de una pestaña en segundo plano, sospechar del lagSmoothing.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [scroll] `lenis.scrollTo()` no disponible en componentes hijos

- Contexto: Componente profundo (dot, botón, link) que necesita llamar `lenis.scrollTo()` pero la instancia vive en el Provider raíz.
- Causa probable: Lenis instanciado en Provider sin exponer la instancia a hijos sin boilerplate.
- Pista: Buscar cómo se accede a la instancia de Lenis en componentes que no son el Provider. Si el acceso no está encapsulado en un Context o en una referencia global, el componente hijo puede no encontrar la instancia. Un fallback a `window.scrollTo` garantiza que si Lenis no está disponible (SSR, error), la navegación no se rompe.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [scroll] Scrollbar flash de ~15px al desbloquear scroll del body

- Contexto: Menú u overlay que bloquea el scroll con `document.body.style.overflow = 'hidden'` y lo restaura al cerrar.
- Causa probable: Restaurar con `overflow: 'auto'` fuerza un valor que puede no coincidir con el estado CSS original del body. El browser recalcula si necesita scrollbar, genera un layout shift horizontal de ~15px.
- Pista: Buscar `document.body.style.overflow = 'auto'` (o cualquier valor no vacío) en funciones de cierre. El string vacío `''` elimina el inline style y devuelve el control al CSS, sin el flash. Si el síntoma es un desplazamiento horizontal al cerrar un menú, este es el candidato.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [scroll] LenisProvider intercepta clicks de anchor que el componente ya manejó

- Contexto: Cualquier componente que registra su propio handler en links `href="#..."` y llama `e.preventDefault()`.
- Causa probable: `LenisProvider` registra un listener en `document` para todos los `a[href^="#"]`. `e.preventDefault()` en React previene el comportamiento nativo del browser pero no cancela los listeners en `document`. Resultado: el scroll de Lenis arranca en paralelo con cualquier lógica custom del componente.
- Pista: Buscar si `LenisProvider` tiene un guard `if (e.defaultPrevented) return` como primera línea del handler. Sin ese guard, cualquier componente que maneje sus propios links internos con `preventDefault` luchará contra el scroll de Lenis. El evento en React se procesa antes de llegar a `document`, por lo que el guard funciona correctamente.
- Confianza: confirmado
- ⚠ Validar contra código actual.

---

### [scroll] Contenido invisible + scroll en posición incorrecta al navegar entre páginas

- Contexto: SPA con Lenis y GSAP ScrollTrigger. Al navegar de una página a otra, la nueva página puede mostrar contenido en `opacity:0` (animaciones no disparadas) o arrancar mid-scroll.
- Causa probable: Lenis persiste entre rutas — al navegar, mantiene la posición de scroll del origen. `ScrollTrigger` del nuevo render desconoce las dimensiones reales del documento. El browser intenta restaurar la posición de scroll en navegación atrás, conflictuando con Lenis.
- Pista: Buscar si hay lógica que llame `lenis.scrollTo(0, { immediate: true })` y `ScrollTrigger.refresh()` en cada cambio de ruta. Sin ese reset, la nueva página puede heredar el estado de scroll de la anterior. También verificar `window.history.scrollRestoration = 'manual'` al inicializar Lenis.
- Confianza: confirmado
- ⚠ Validar contra código actual.
