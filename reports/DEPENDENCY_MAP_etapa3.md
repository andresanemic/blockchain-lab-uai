# DEPENDENCY MAP — Etapa 3 (RC-6 + RC-7a + RC-7b + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Delta sobre `DEPENDENCY_MAP.md` de Etapa 1.
> Los sistemas base (DM-1 a DM-8) siguen vigentes. Este documento mapea
> únicamente las dependencias de los cambios candidatos de Etapa 3.

---

## Sistemas tocados por RC (resumen)

| RC | Archivo | Líneas | Sistemas | Candidatura |
|---|---|---|---|---|
| RC-6 | `LenisProvider.tsx` | 49 | Scroll System (Lenis) | ✅ Etapa 3 |
| RC-8 | `LenisProvider.tsx` | 73–76 | Scroll System (Lenis) + Animation Layer (ScrollTrigger) | ✅ Etapa 3 |
| RC-7a | `NavV2.tsx` | 64–68 | Navigation | ✅ Etapa 3 (pendiente confirmación en REMEDIATION PLAN) |
| RC-7b | `NavV2.tsx` | render links (~líneas 213–238) | Navigation | ⏸ Incidente futuro |

---

## DM-E3-1 — RC-6: fix en `handleAnchorClick` línea 49

### Cambio propuesto

```diff
- if (!target) return
+ if (!target) { e.preventDefault(); return }
```

### Dependencias entrantes (qué puede afectar a esta línea)

| Dependiente | Cómo llega a línea 49 | Impacto del fix |
|---|---|---|
| HeroV2 "Colaborar" (`href="#contacto"` desde `/`) | Llama `e.preventDefault()` antes → Guard 0 (línea 32) lo descarta → **nunca llega a línea 49** | Ninguno |
| CTA NavV2 desktop (`href="#contacto"` desde `/`) | Branch 1 → target=FooterV2/ContactV2 encontrado → Guard 2 pasa → **nunca llega a línea 49** | Ninguno |
| CTA NavV2 mobile (`href="#contacto"` desde `/`) | Igual que desktop | Ninguno |
| CTA NavV2 desktop (`href="#contacto"` desde `/certificados`) | Branch 1 → target=null → **llega a línea 49** | Fix actúa aquí → `preventDefault` → URL limpia |
| Cualquier `a[href^="#id"]` donde `#id` no exista en DOM | Branch 1 → target=null → **llega a línea 49** | Fix actúa → misma protección |

### Dependencias salientes (qué afecta el fix)

| Sistema | Comportamiento actual | Comportamiento post-fix |
|---|---|---|
| URL del browser | Appende `#contacto` → `/certificados#contacto` | URL no cambia → `/certificados` |
| `hashchange` event | Dispara (browser procesa el click) | No dispara (`preventDefault` lo cancela) |
| `usePathname()` de LenisProvider | No cambia (`/certificados` ≠ pathname change) | Igual — el hash no es parte del pathname |
| `useEffect([pathname])` de LenisProvider | No re-ejecuta (pathname no cambió) | Igual |
| `scrollSaved` de LenisProvider | No afectado | Igual |
| Lenis scroll position | No afectado (no hay `lenis.scrollTo` cuando target=null) | Igual |
| IntersectionObserver de NavV2 | No afectado | Igual |

### Punto único de falla introducido

**Ninguno.** El fix no introduce nuevas rutas de código, no modifica el estado de ningún sistema compartido y no afecta ningún caso donde `target !== null`. El diff es de una línea; la lógica de todas las demás branches es idéntica.

### Riesgo de regresión

**Bajo.** El único vector es que algún link `a[href^="#something"]` donde `#something` no existe en DOM actualmente tenga un comportamiento intencionado de "modificar la URL con hash". No existe evidencia de ese patrón en el código actual.

---

## DM-E3-2 — RC-8: fix en `isFirstPath` guard (líneas 73–76)

### Cambio propuesto

El fix más quirúrgico: cambiar el early return incondicional por un return condicional que solo saltea cuando no hay hash.

```diff
  if (isFirstPath.current) {
    isFirstPath.current = false
-   return
+   if (!window.location.hash) return
+   // si hay hash: cae al bloque if (hash) de abajo → mismo tratamiento que soft nav
  }
```

Esto permite que el bloque `if (hash)` de línea 82 se ejecute en FPL cuando la URL tiene hash, mientras que el scroll restoration (líneas 101–115) sigue sin ejecutarse en first load (el `if (hash)` hace su propio early return antes de llegar a scroll restoration).

### Flujo post-fix en FPL con hash (`/#proyectos` desde `/certificados`)

```
useEffect([pathname]) — primera ejecución:
  isFirstPath.current = true → entra al bloque
  isFirstPath.current = false
  window.location.hash = '#proyectos' (truthy) → NO retorna
  ↓ cae al bloque normal del efecto
  const hash = '#proyectos'
  if (hash) {                                    ← línea 82 — ahora se ejecuta
    setTimeout(400ms) → {
      ScrollTrigger.refresh()                    ← recalcula con pin-spacer instalado
      rAF → querySelector('#proyectos') → lenis.scrollTo(...)   ← posición correcta
    }
    return () => clearTimeout(t)                 ← cleanup; NO llega a scroll restoration
  }
  // líneas 101–115 (scroll restoration) nunca alcanzadas → correcto
```

### Flujo post-fix en FPL sin hash (navegación normal a `/certificados`)

```
useEffect([pathname]) — primera ejecución:
  isFirstPath.current = true → entra al bloque
  isFirstPath.current = false
  window.location.hash = '' (falsy) → retorna   ← mismo comportamiento que antes
```

### Dependencias del fix

| Dependencia | Estado | Riesgo |
|---|---|---|
| `lenisRef.current` disponible | Garantizado: `useEffect([])` línea 14 (instancia Lenis) se declara antes que `useEffect([pathname])` línea 73 en el mismo componente — React ejecuta en orden de declaración en el mismo render. El setTimeout(400ms) añade margen adicional. | Bajo |
| `ScrollTrigger.refresh()` disponible | ScrollTrigger está registrado en `lib/gsap.ts` al cargar. No hay riesgo de que no esté disponible a los 400ms. | Ninguno |
| BlockchainV2 pin instalado en 400ms | El mismo timeout de 400ms ya está validado en producción para soft nav — misma página, mismo componente. No es una asunción nueva. | Bajo (aceptado) |
| `window.location.hash` en primer render | Disponible: el browser setea `location.hash` antes de que cualquier JS ejecute. | Ninguno |
| Scroll restoration en first load | El bloque de scroll restoration (líneas 101–115) **no se ejecuta**: el `if (hash)` de línea 82 retorna vía cleanup antes de llegar ahí. Sin cambio respecto al comportamiento actual. | Ninguno |

### Sistemas afectados

| Sistema | Comportamiento actual en FPL+hash | Comportamiento post-fix |
|---|---|---|
| Browser scroll position | Auto-scroll nativo a hash → pin-spacer lo desplaza → sección incorrecta | Lenis corrige a 400ms → sección correcta |
| `ScrollTrigger` | Refresh solo en cambios de ruta posteriores | Refresh también en primer load con hash |
| `lenis.scrollTo` | No llamado en first load | Llamado a 400ms si hay hash |
| `scrollSaved` | No afectado (no se lee ni escribe) | Igual |
| Scroll restoration (soft nav posteriores) | Funciona como antes | Sin cambio — `isFirstPath=false` para siempre |
| `isFirstPath.current` | `true` → `false` en primer `useEffect([pathname])` | Igual — mismo punto de transición |

### Punto único de falla introducido

**Ninguno nuevo.** El riesgo de "BlockchainV2 pin no instalado en 400ms" ya existe en el path de soft nav y es aceptado. El fix reutiliza un mecanismo ya en producción sin añadir nueva lógica.

### Interacción RC-6 × RC-8

Ambos fixes están en `LenisProvider.tsx`. RC-6 toca línea 49; RC-8 toca líneas 73–76. **No comparten código ni estado.** Pueden aplicarse en cualquier orden o en el mismo commit sin interferencia.

---

## DM-E3-3 — RC-7a: eliminar IDs muertos del observer

### Cambio propuesto

```diff
  const map: Record<string, string> = {
    areas: 'areas', proyectos: 'proyectos', equipo: 'equipo',
-   impacto: 'areas', blockchain: 'proyectos', acerca: 'equipo',
+   impacto: 'areas', blockchain: 'proyectos',
-   proceso: 'equipo', roadmap: 'equipo',
+   proceso: 'equipo',
  }
```

### Dependencias

| Sistema | Impacto |
|---|---|
| IntersectionObserver | Reduce de 8 IDs consultados a 6. Los 2 removidos (`acerca`, `roadmap`) ya retornaban `null` en `getElementById` → el observer ya no los intentaba observar → cambio de comportamiento: **ninguno** |
| `activeId` estado | Los IDs removidos mapeaban a `'equipo'`. `'equipo'` sigue siendo reachable via `equipo` (TeamV2) y `proceso` (ProcessV2). Rango de valores posibles para `activeId`: sin cambio. |
| Render de links | `activeId` no se usa en render (RC-7b pendiente). Sin impacto. |
| Otros componentes | Ninguno observa `activeId` ni el mapa del observer. |

**Punto único de falla introducido:** ninguno. El cambio es puramente aditivo en el sentido de que elimina observaciones que ya eran no-ops.

**Riesgo de regresión:** ninguno detectable. Si en el futuro se añade un componente con `id="acerca"` o `id="roadmap"`, el observer no lo registrará — comportamiento esperado dado que esos IDs no corresponden a ningún navLink activo.

---

## DM-E3-4 — RC-7b: conectar `activeId` al render ⏸ CANDIDATO A INCIDENTE FUTURO

> Este sistema se mapea para completitud, pero **RC-7b no forma parte de Etapa 3**.
> Decisión de apertura de incidente futuro se toma en REMEDIATION PLAN.

### Cambio propuesto (referencial)

Añadir condición de color en el render de cada navLink:

```diff
  style={{
-   color: 'rgba(247,245,242,0.72)',
+   color: activeId === link.sectionId ? 'rgba(247,245,242,1)' : 'rgba(247,245,242,0.72)',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.color = 'rgba(247,245,242,0.95)'
  }}
  onMouseLeave={e => {
+   // debe restaurar el color activo, no siempre el inactivo
-   e.currentTarget.style.color = 'rgba(247,245,242,0.72)'
+   e.currentTarget.style.color = activeId === link.sectionId
+     ? 'rgba(247,245,242,1)'
+     : 'rgba(247,245,242,0.72)'
  }}
```

### Dependencias y riesgos (documentados para el incidente futuro)

| Dependencia | Detalle |
|---|---|
| `activeId` cálculo | Requiere que RC-7a ya esté aplicado (mapa limpio) para evitar confusión con IDs muertos. RC-7a es prerequisito lógico. |
| Hover × Active state | El `onMouseLeave` actual siempre restaura color inactivo. Con estado activo, debe restaurar el color según `activeId` en ese momento — requiere cerrar sobre el estado actual o releer `activeId` en el handler. |
| Páginas internas sin secciones | `activeId` = `null` en `/certificados` → todos los links muestran color inactivo → correcto. Sin comportamiento especial necesario. |
| GSAP / Lenis | Sin interacción. El cambio es exclusivamente de render React. |
| CSS `.nav-link.is-active` | Alternativa a inline style — requeriría cambiar de inline a className, lo que implica más cambios de JSX. La opción inline es más contenida. |

**Decisión de diseño pendiente:** ¿qué color muestra un link "activo" durante hover? La respuesta actual (siempre restaura a `0.72`) sería un bug con el estado activo. Este es el tipo de decisión que justifica un incidente separado con diseño explícito.

---

## Orden de dependencia entre RCs de Etapa 3

```
RC-6 (línea 49 de LenisProvider)
  └── Independiente de RC-8 y RC-7a

RC-8 (líneas 73-76 de LenisProvider)
  └── Independiente de RC-6 y RC-7a
  └── Ambos RC-6 y RC-8 pueden ir en el mismo commit (mismo archivo, sin conflicto)

RC-7a (NavV2 mapa del observer)
  └── Independiente de RC-6 y RC-8
  └── Prerequisito lógico de RC-7b si se decide abrir ese incidente

RC-7b (NavV2 render links) — ⏸ incidente futuro
  └── Requiere RC-7a previamente aplicado
  └── Requiere decisión de diseño (hover × active)
```

---

## Exit criteria

- [x] RC-6: dependencias entrantes y salientes mapeadas; impacto sobre Guard 0 (HeroV2) confirmado nulo; punto único de falla introducido: ninguno
- [x] RC-8: flujo post-fix documentado para FPL+hash y FPL sin hash; dependencias de `lenisRef`, `ScrollTrigger`, timeout validado en producción; interacción con scroll restoration confirmada sin cambio
- [x] RC-7a: impacto sobre `activeId` y observer confirmado nulo; rango de valores sin cambio
- [x] RC-7b: dependencias documentadas incluyendo hover×active state; prerequisito RC-7a identificado; marcado explícitamente como candidato a incidente futuro (estilo INC-002); decisión de apertura diferida a REMEDIATION PLAN
- [x] Orden de dependencia entre los cuatro RCs establecido; RC-6 y RC-8 confirmados como aplicables en el mismo commit sin conflicto

**STOP — aprobación humana requerida antes de REMEDIATION PLAN.**
