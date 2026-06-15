# SYSTEM INVENTORY — Etapa 3 (RC-6 + RC-7 + RC-8)

INC-001 Etapa 3 · Branch: `inc-001/etapa-3-navlinks` · Fecha: 2026-06-15

> Delta sobre `SYSTEM_INVENTORY.md` de Etapa 1 — no se repiten los sistemas ya mapeados.
> Foco: handleAnchorClick (AF-E3-1), isFirstPath (AF-E3-2), activeId + IDs muertos (RC-7).

---

## Sistemas sospechosos de Etapa 3 (checklist)

- [x] `handleAnchorClick` en LenisProvider (RC-6, RC-8)
- [x] `isFirstPath` lifecycle en LenisProvider (RC-8)
- [x] `activeId` + IntersectionObserver en NavV2 (RC-7)
- [x] Interacción con SYS-2 (ScrollTrigger.refresh) — dependencia del fix RC-8
- [x] Interacción con RH-E3-1 (guard `defaultPrevented`) — riesgo de regresión RC-6

Sistemas de Etapa 1 no modificados en Etapa 3: SYS-1 (NavV2 mount cycle), SYS-2 (GSAP), SYS-4 (Router), SYS-5 (History API), SYS-6 (Responsive), SYS-7 (Page Transitions), SYS-9 (ScrollUI).

---

## SYS-E3-1 — `handleAnchorClick` en LenisProvider

**Archivo:** `components/v2/LenisProvider.tsx` líneas 31–52
**Scope:** listener global en `document` para todos los clicks. Persiste toda la sesión.

### Mapa de branches completo

```
handleAnchorClick(e: MouseEvent)
│
├─ [Guard 0] if (e.defaultPrevented) return         ← línea 32
│   Propósito: respetar handlers previos (HeroV2 "Colaborar").
│   Productor del flag: cualquier componente que llame e.preventDefault() antes.
│   Activo hoy: HeroV2 overlay de fade llama preventDefault en "#contacto" desde /.
│
├─ Branch 1: a[href^="#"]                           ← línea 34
│   `link = closest('a[href^="#"]')`
│   Ejemplos: href="#contacto", href="#", href="#cualquier-id"
│   Si encontrado: hash = link.getAttribute('href')   ← línea 38
│
└─ Branch 2 (else): a[href^="/#"]                  ← línea 40
    `rootLink = closest('a[href^="/#"]')`
    Ejemplos: href="/#proyectos", href="/#areas"
    └─ Sub-guard: window.location.pathname === '/'  ← línea 41
        SI pathname=='/': hash = href.slice(1)  ("#proyectos")  ← línea 42
                          link = rootLink
        SI pathname!='/': rootLink ignorado → link = null
                          [FPL al navegar a /#proyectos — manejado por browser]

[Después de los branches]
│
├─ Guard 1: if (!link || !hash || hash === '#') return  ← línea 47
│   Casos descartados:
│   - Branch 2 con pathname !== '/'  → link = null → descartado aquí [correcto]
│   - Blog link href="#"             → hash === '#' → descartado aquí [correcto]
│
├─ Guard 2: const target = document.querySelector(hash)   ← línea 48
│           if (!target) return                           ← línea 49 [BUG RC-6]
│   Casos que llegan aquí:
│   - href="#contacto" desde / → target = FooterV2 #contacto → pasa ✅
│   - href="#contacto" desde /certificados → target = null → return SIN preventDefault ❌
│   - href="/#proyectos" desde / (post-slice) → target = #proyectos → pasa ✅
│
└─ Acción: e.preventDefault()                       ← línea 50
           lenis.scrollTo(target, {duration:1.6})   ← línea 51
```

### Tabla de casos por link × pathname

| Link en nav | Desde `/` | Desde `/certificados` |
|---|---|---|
| `href="/#proyectos"` | Branch 2 → intercept → scroll suave a #proyectos ✅ | Branch 2 → pathname≠'/' → Guard 1 descarta → FPL a `/#proyectos` → **RC-8 en FPL** |
| `href="/#areas"` | Branch 2 → intercept → scroll suave a #areas ✅ | Igual que #proyectos → **RC-8 en FPL** |
| `href="#contacto"` (CTA) | Branch 1 → target encontrado → scroll suave ✅ | Branch 1 → target=null → Guard 2 retorna sin preventDefault → **RC-6** |
| `href="#"` (Blog) | Branch 1 → Guard 1 descarta (hash==='#') → no-op ✅ | Igual → no-op ✅ |
| `href="/"` (Logo) | No interceptado (no empieza con # ni /#) → Router ✅ | Igual → Router ✅ |

### Dependencias del fix RC-6

- **Punto de cambio:** línea 49, dentro de Guard 2.
- **Fix:** cambiar `if (!target) return` por `if (!target) { e.preventDefault(); return }`.
- **Impacto sobre Guard 0:** nulo. El Guard 0 (línea 32) se ejecuta ANTES de Guard 2 (línea 49). El HeroV2 "Colaborar" ya fue descartado en Guard 0 — nunca llega a Guard 2.
- **Impacto sobre Branch 2:** nulo. Branch 2 con pathname≠'/' produce `link = null`, que es descartado por Guard 1 (línea 47) antes de llegar a Guard 2.
- **Efecto real del fix:** solo afecta clicks de `a[href^="#"]` donde el elemento no existe en el DOM actual. Hoy solo conocido: `#contacto` desde `/certificados`.

---

## SYS-E3-2 — `isFirstPath` en LenisProvider

**Archivo:** `components/v2/LenisProvider.tsx` líneas 10, 73–121
**Tipo:** `useRef<boolean>` — persiste entre renders sin causar re-render.

### Inicialización y ciclo de vida completo

```
Mount de LenisProvider (layout raíz — ocurre una vez por sesión):
  isFirstPath.current = true                     ← línea 10

Primera ejecución de useEffect([pathname]):
  [siempre se ejecuta tras el primer render]
  isFirstPath.current === true → entra al bloque
  isFirstPath.current = false                    ← línea 75
  return                                         ← línea 76
  [el resto del efecto NO se ejecuta]

Todas las ejecuciones posteriores de useEffect([pathname]):
  isFirstPath.current === false → salta el bloque
  [el resto del efecto SÍ se ejecuta: hash handling + scroll restoration]
```

### Responsabilidades que controla `isFirstPath`

| Comportamiento | Con isFirstPath=true | Con isFirstPath=false |
|---|---|---|
| Hash handling (líneas 82–99) | ❌ Skipped | ✅ Ejecutado |
| Scroll restoration (líneas 101–115) | ❌ Skipped | ✅ Ejecutado |
| `ScrollTrigger.refresh()` (línea 114) | ❌ Skipped | ✅ Ejecutado |

**Intención del diseño:** en la primera carga no hay scroll guardado que restaurar, y el hash de la URL es procesado por el browser nativo. El `isFirstPath` guard fue diseñado para evitar que LenisProvider haga un `scrollTo(0)` innecesario en el primer load, sobreescribiendo la posición inicial.

**Efecto colateral (RC-8):** el hash handling también queda skipped en la primera carga. Si la URL tiene `#proyectos` al hacer FPL (ej. navegando desde `/certificados` a `/#proyectos`), el handler que hace `ScrollTrigger.refresh() → lenis.scrollTo(hash)` nunca corre. El browser navega al hash con su scroll nativo, y luego GSAP instala el pin-spacer de BlockchainV2 desplazando la posición.

### Punto de intervención para RC-8

El fix necesario NO es eliminar `isFirstPath` (rompería la scroll restoration). Es separar las dos responsabilidades:

```
if (isFirstPath.current) {
  isFirstPath.current = false
  // Scroll restoration: skip (correcto — no hay savedPos en primera carga)
  // Hash handling: TAMBIÉN debe ejecutarse si window.location.hash existe
  if (hash) {
    // ... mismo bloque de setTimeout → refresh → scrollTo
  }
  return  // skip scroll restoration
}
```

O alternativamente: mover el bloque `if (hash)` antes del guard `isFirstPath`, con la aclaración de que solo se ejecuta si la URL tiene hash.

---

## SYS-E3-3 — `activeId` e IntersectionObserver en NavV2 (RC-7)

**Archivo:** `components/v2/NavV2.tsx` líneas 28, 63–80

### Estado

```typescript
const [activeId, setActiveId] = useState<string | null>(null)  // línea 28
```

Posibles valores: `null` | `'areas'` | `'proyectos'` | `'equipo'`

### IntersectionObserver — mapa de IDs

```typescript
// NavV2.tsx líneas 64–68
const map: Record<string, string> = {
  areas:      'areas',     // ✅ existe → AreasV2.tsx id="areas"
  proyectos:  'proyectos', // ✅ existe → ProjectsV2.tsx id="proyectos"
  equipo:     'equipo',    // ✅ existe → TeamV2.tsx id="equipo"
  impacto:    'areas',     // ✅ existe → ImpactV2.tsx id="impacto"
  blockchain: 'proyectos', // ✅ existe → BlockchainV2.tsx id="blockchain"
  acerca:     'equipo',    // ❌ NO existe en ningún componente v2 — dead
  proceso:    'equipo',    // ✅ existe → ProcessV2.tsx id="proceso"
  roadmap:    'equipo',    // ❌ NO existe en ningún componente v2 — dead
}
```

**Resultado del observer en páginas internas:** los 6 IDs existentes no están en `/certificados` ni `/validacion-videos`. El observer los busca con `document.getElementById(id)`, no los encuentra, no los observa. `activeId` permanece `null` indefinidamente en páginas internas.

### Ciclo de vida del observer

```
Mount en /certificados:
  observer registra 8 IDs → getElementById: todos null → observa 0 elementos
  activeId = null para siempre en esta página

Mount en / (landing):
  observer registra 8 IDs → getElementById:
    ✅ 6 encontrados (areas, proyectos, equipo, impacto, blockchain, proceso)
    ❌ 2 no encontrados (acerca, roadmap) → observa solo 6
  IntersectionObserver dispara → setActiveId(map[visible[0].target.id])
```

### Conexión activeId → render (o falta de ella)

```typescript
// navLinks
const navLinks = [
  { label: 'Proyectos', href: '/#proyectos', sectionId: 'proyectos' },
  { label: 'Áreas',     href: '/#areas',     sectionId: 'areas'     },
  { label: 'Blog',      href: '#',           sectionId: null        },
]
```

`sectionId` existe en cada link como dato semántico, pero **no se referencia en el JSX**. Los links usan inline styles estáticos — ninguno condiciona color/background a `activeId === link.sectionId`.

**CSS muerto relacionado (`globals.css`):**
- `.nav-link` — clase que existiría si los links usaran `className="nav-link"`
- `.nav-link.is-active` — clase para el estado activo
- **Ningún elemento de NavV2 usa estas clases** — usan inline styles exclusivamente.

### Dependencias del fix RC-7

**RC-7a — eliminar IDs muertos:**
- Eliminar `acerca` y `roadmap` del mapa (líneas 67, 68).
- Sin efectos secundarios — el observer ya ignora estos IDs (los elementos no existen).
- Reduce 8 observaciones a 6 activas.

**RC-7b — conectar activeId al render:**
- Opciones:
  1. Añadir condición en el inline style del link: `color: activeId === link.sectionId ? 'rgba(247,245,242,1)' : 'rgba(247,245,242,0.72)'`
  2. Cambiar a `className="nav-link"` + `className="nav-link is-active"` usando las clases CSS ya existentes.
- Opción 1 es más consistente con el estilo actual de NavV2 (todo inline).
- **Interacción con E3 y GSAP:** RC-7b no toca ninguna animación — solo afecta el render del color de links. Sin riesgo de regresión en GSAP.

---

## Mapa de dependencias de Etapa 3 (delta sobre SYS-1 a SYS-9)

```
LenisProvider [persiste] (SYS-3)
  └── handleAnchorClick (SYS-E3-1)
        ├── Guard 0: e.defaultPrevented   ← protege HeroV2 "Colaborar" [RH-E3-1]
        ├── Branch 1: a[href^="#"]
        │     └── Guard 2: querySelector
        │           ├── target existe → scroll suave ✅
        │           └── target null → return SIN preventDefault [RC-6 BUG]
        └── Branch 2: a[href^="/#"] + pathname=='/']
              └── Si pathname!='/': link=null → Guard 1 descarta → FPL [correcto]
  └── isFirstPath (SYS-E3-2)
        └── Controla hash handling [RC-8 BUG: skipped en FPL]
        └── Controla scroll restoration [correcto en FPL: no hay savedPos]
  └── ScrollTrigger.refresh() (SYS-2 dependencia)
        └── El fix RC-8 depende de que refresh() corra ANTES de lenis.scrollTo(hash)
        └── Ya implementado en el bloque de soft nav (líneas 87-88)

NavV2 [remonta por ruta] (SYS-1 delta)
  └── activeId [SYS-E3-3]
        ├── Calculado por IntersectionObserver (8 IDs, 2 muertos) [RC-7]
        └── Nunca consumido en render → dead state [RC-7b]
```

---

## Exit criteria

- [x] `handleAnchorClick`: todos los branches mapeados con tabla link × pathname; punto de cambio para RC-6 identificado con análisis de impacto en Guard 0 y Branch 2.
- [x] `isFirstPath`: ciclo de vida completo documentado; las dos responsabilidades que controla separadas; punto de intervención para RC-8 especificado.
- [x] `activeId`: estado actual del observer (6 activos, 2 muertos); ausencia de conexión al render documentada; opciones para RC-7b listadas.
- [x] Dependencias entre los tres sistemas (E3-1, E3-2, E3-3) y los sistemas base (SYS-2, SYS-3) mapeadas.

**STOP — aprobación humana requerida antes de ROOT CAUSE ANALYSIS.**
