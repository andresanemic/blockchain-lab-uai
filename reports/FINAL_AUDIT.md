# FINAL AUDIT — INC-001 Etapa 1

**Fecha:** 2026-06-15  
**Branch:** `inc-001/etapa-1-navv2`  
**Commits:** `261371e` (fix NavV2) · `0546574` (test S-02 redesign)  
**Verifier:** APROBADO · Confidence ALTA  

---

## 1. Resumen del ciclo

| Dimensión | Resultado |
|---|---|
| Síntoma original | Nav desktop invisible ~1.4s al cargar páginas internas (flash / FOUC) |
| Causa raíz principal | `gsap.fromTo` con `delay:0.3 + duration:1.1` en todas las rutas, sin bifurcación por pathname |
| Archivos modificados | `components/v2/NavV2.tsx` (1 archivo) |
| Gate original RED | `gp5 S-02: nav visible en páginas internas` |
| Gate post-fix | `gp5 S-02` → **GREEN** (gap GSAP = 0ms, threshold 500ms) |
| Suite completa | **23 passed / 2 failed** (los 2 RED son deuda técnica documentada, no regresiones) |

---

## 2. Cambios implementados (Etapa 1 scope final)

### NavV2.tsx — 4 cambios

**RC-2 · Eliminado `display: 'flex'` del inline style del `<nav>` desktop**  
El control de display queda exclusivamente en `className="hidden md:flex"`. Tailwind v4 genera `display: none !important` en móvil, eliminando la dependencia del `!important` como guard accidental.

**RC-3 · Guard de viewport reactivo**  
`useIsMobile()` añadido como dependencia de E3. Efecto separado (E-RC3) que resetea `opacity:0` al redimensionar de desktop a móvil, previniendo que el nav desktop quede flotando visible tras un resize.  
Protegido por `hasAnimated.current`: resize móvil→desktop no re-anima el nav.

**RC-4 · Cleanup del tween GSAP en E3**  
`gsap.killTweensOf(navRef.current)` en el `return` de E3. Previene que el tween de 1.4s corra contra un nodo desmontado en FPL rápidos.

**Animation skip vía `usePathname`**  
E3 bifurcado por pathname:
- `pathname === '/' || pathname === null` → `gsap.fromTo` completo (delay 0.3s, expo.out 1.1s) — experiencia editorial de la landing
- `pathname !== '/'` → `gsap.set` inmediato — nav visible en t_mount + ~0ms en páginas internas

---

## 3. Validación — Golden Paths

### Suite completa (2026-06-15 · corrida final post-verifier)

```
23 passed / 2 failed
```

| GP | Test | Estado | Observación |
|---|---|---|---|
| GP-1 | Scroll restoration con Back | ❌ RED permanente | Requiere soft nav o BFCache — deuda técnica documentada |
| GP-2 | RC-1: nav PIERDE data-* | ❌ RED permanente | Gate de INC-002 (route group + `<Link>`) |
| GP-2 | 6 regression guards | ✅ GREEN | Nav adjunto en /, /certificados, /validacion-videos; Back; Forward; count=1 |
| GP-3 | 5 tests mobile nav | ✅ GREEN | Hamburger, overlay, toggle, close-on-nav, Back |
| GP-4 | 4 tests viewport bleed | ✅ GREEN | display:none en 390px, oculto tras resize, hamburger ausente en 1440px |
| GP-5 | S-02 animation gate | ✅ **RED→GREEN** | gap=0ms << 500ms, 3/3 estable |
| GP-5 | 5 regression guards | ✅ GREEN | Nav en DOM, count exacto, sin NavV2 en legacy |

Los 2 tests RED son deuda técnica pre-existente, no regresiones de Etapa 1. Están documentados en `VALIDATION_DESIGN.md` como gates de ciclos futuros.

### Evidencia visual (browser real · 2026-06-15)

| Escenario | Evidencia | Resultado |
|---|---|---|
| `/certificados` nav inmediato | opacity=1 en t=222ms ('load'), gap GSAP = 0ms | ✅ Sin parpadeo |
| `/` animación completa | Timeline 14 frames: invisible t=0–962ms, expo.out t=1019–1611ms | ✅ Animación correcta |
| 390px sin bleed | `display: none` en computedStyle del nav desktop | ✅ Sin leak |

---

## 4. Protected Systems

`PROTECTED_SYSTEMS.md` — sin entradas. Ningún sistema declarado como Protected en el momento de este ciclo.

Sistemas High Risk tocados y auditados:
- **Animation Layer (GSAP)** — modificado en E3. Animación de landing intacta; skip en internas verificado. Sin regresiones en mobile overlay.
- **Navigation Layer (NavV2)** — modificado. Estructura del nav inalterada; links, CTA y hamburger sin cambios.
- **Responsive Layer** — modificado (RC-2, RC-3). GP-4 green confirma que la separación mobile/desktop funciona correctamente.

---

## 5. Deuda técnica documentada (sale de este ciclo sin resolver)

### RC-1 · NavV2 por-página — INC-002 (diferido)

**Estado:** test `gp2 RC-1` permanece RED de forma esperada.  
**Por qué se difiere:** el route group `(v2)/layout.tsx` solo produce un cambio observable con soft navigation (`<Link>`). El sitio actual usa exclusivamente FPL. Ejecutar el route group sin `<Link>` agrega complejidad sin beneficio testeable.  
**Condición de activación:** introducción de `<Link>` en al menos un link de ruta inter-página (candidato: tarjetas de `ProjectsV2`).  
**Gate:** `gp2 RC-1` debe pasar RED→GREEN tras INC-002.

### GP-1 · Scroll restoration con Back

**Estado:** `gp1 LenisProvider restaura scroll` RED permanente.  
**Causa raíz:** `LenisProvider` solo intercepta anchors (`#`), no inter-página. `window.history.scrollRestoration = 'manual'` desactiva BFCache. Con FPL exclusivo, `scrollSaved` nunca se ejerce.  
**Condición de resolución:** `<Link>` (activa LenisProvider) **o** eliminar `scrollRestoration: 'manual'` (restaura BFCache).

### RC-6 / RC-7 · Etapa 2

**RC-6:** `#contacto` desde páginas internas agrega hash a URL en lugar de hacer scroll (LenisProvider no encuentra el target). Fix: un `e.preventDefault()` de 1 línea en `LenisProvider.tsx`.  
**RC-7:** `activeId` es dead state (se calcula pero nunca se renderiza en el nav). Fix: conectar `sectionId === activeId` al estilo de los links.  
Ambos son fixes puntuales, no urgentes. Se ejecutan en Etapa 2 cuando se decida.

---

## 6. Riesgos residuales

| Riesgo | Probabilidad | Impacto | Estado |
|---|---|---|---|
| `isMobile` inicializa en `false` (SSR) → posible flash 1 frame en desktop al montar en móvil | Baja | Menor | Cubierto por `useIsomorphicLayoutEffect` en el hook |
| `usePathname` retorna `null` durante hydration → animación completa en landing duplicada | Muy baja | Menor | Mitigado: `null` trata como `/` (fallback safe) |
| La expo.out en `/` completa visualmente antes de 1612ms si el servidor es muy rápido | Muy baja | Cosmético | Sin impacto funcional |
| Turbopack dev server cache: primer FPL frío puede tardar >1s en compilar → timing tests | Baja | Flakiness CI | S-02 mide duración GSAP (no tiempo absoluto) — inmune a compile time |
| FPL entre páginas: breve blank de browser entre navegaciones (inherente al browser) | Siempre | UX mínima | No es de NavV2; se eliminaría con `<Link>` + INC-002 |

---

## 7. Recomendaciones post-cierre

1. **Promover NavV2.tsx a Protected System** tras un ciclo de producción estable. El componente tiene ahora tests permanentes en la suite; un incidente futuro que lo toque debe ir por track FULL.

2. **INC-002 abierto cuando se introduzca `<Link>`** — no antes. La condición está documentada en `REMEDIATION_PLAN.md`. El test gate ya existe (`gp2 RC-1`).

3. **Etapa 2 (RC-6 + RC-7)** puede ejecutarse en cualquier momento, independientemente de INC-002. Son cambios de 1–4 líneas con bajo riesgo. Candidato para track LIGHT.

4. **Candidato a lore:** el patrón "gsap.fromTo en layout compartido vs per-page en FPL" es generalizable. Cuando Etapa 2 cierre y el ciclo completo esté verificado, proponer entrada en `lore/animations.md` o `lore/next-routing.md`. No hacerlo automáticamente.

---

## 8. Estado final del incidente

**INC-001 Etapa 1: CERRADA.**

El síntoma principal reportado (nav desktop invisible ~1.4s en páginas internas) queda resuelto con Confidence ALTA, verificado por subagente verifier en contexto fresco, con evidencia visual de nivel 2 (timeline frame-a-frame + screenshots en browser real).

El archivo `incidents/INC-001.md` documenta el registro completo del incidente.
