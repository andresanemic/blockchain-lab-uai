# Blockchain Lab UAI — Documentación del Proyecto

## ¿Qué es esto?

Sitio web institucional del **Blockchain Lab de la Universidad Adolfo Ibáñez (UAI)**, un laboratorio de investigación aplicada que diseña, prototipa y despliega soluciones descentralizadas para organizaciones públicas y privadas en Chile y la región.

El sitio funciona como landing page de presentación del lab y como vehículo de conversión para atraer empresas, instituciones y aliados. Tiene también una página de producto dedicada al sistema de certificados digitales en blockchain.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 19, TypeScript |
| Estilos | Tailwind CSS v4 |
| Animaciones | GSAP 3 + ScrollTrigger + `@gsap/react` |
| Componentes | shadcn/ui vía `@base-ui/react` |
| Iconos | Lucide React |
| Fuentes | Inter (sans), JetBrains Mono (mono) — Google Fonts |

> **Atención**: Este proyecto usa Next.js 16 y React 19, versiones con breaking changes respecto a versiones anteriores. Leer `node_modules/next/dist/docs/` antes de modificar convenciones del framework.

---

## Estructura de archivos

```
blockchain-lab-uai/
├── app/
│   ├── layout.tsx                  # Root layout, metadata global, fuentes
│   ├── page.tsx                    # Página principal (/)
│   ├── globals.css                 # Estilos globales, tokens CSS
│   └── certificados/
│       └── page.tsx                # Página /certificados (con metadata propia)
├── components/
│   ├── Nav.tsx                     # Navbar fija con scroll-blur y hamburger móvil
│   ├── Footer.tsx                  # Pie de página
│   ├── Hero.tsx                    # Sección hero con grafo blockchain animado
│   ├── About.tsx                   # "Quiénes Somos" con capability cards
│   ├── WhatIsBlockchain.tsx        # Explicación educativa de blockchain
│   ├── Mission.tsx                 # Misión (marquee animado) — componente no usado en page.tsx actual
│   ├── StrategicAreas.tsx          # 7 áreas estratégicas en grid de cards
│   ├── Process.tsx                 # Metodología en 5 pasos (timeline horizontal/vertical)
│   ├── Impact.tsx                  # Sectores de impacto (pills) + marquee
│   ├── CaseStudy.tsx               # Caso de referencia: Cardano Foundation × UnB
│   ├── Roadmap.tsx                 # Plan de acción de corto plazo (5 iniciativas)
│   ├── Team.tsx                    # Equipo (4 personas, avatares SVG)
│   ├── CTA.tsx                     # Call to action final
│   ├── certificados/
│   │   ├── CertHero.tsx            # Hero de la página de certificados
│   │   ├── CertProblem.tsx         # El problema de la falsificación de títulos
│   │   ├── CertSolution.tsx        # La solución con verificación criptográfica
│   │   ├── CertBenefits.tsx        # Beneficios institucionales (3 cards)
│   │   ├── CertDemo.tsx            # Demo interactivo (wizard de 5 pasos)
│   │   ├── CertSocialProof.tsx     # Prueba social (componente existente)
│   │   └── CertCTA.tsx             # CTA de cierre de la página
│   └── ui/                         # Componentes shadcn generados
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── navigation-menu.tsx
│       └── separator.tsx
└── lib/
    ├── gsap.ts                     # Setup de GSAP + ScrollTrigger (solo client-side)
    └── utils.ts                    # cn() helper (clsx + tailwind-merge)
```

---

## Páginas y secciones

### `/` — Landing page principal

| Sección | ID anchor | Contenido |
|---|---|---|
| Nav | — | Logo UAI, links de navegación, CTA "Colaborar" |
| Hero | — | Titular, grafo blockchain SVG animado con GSAP |
| About | `#nosotros` | "Quiénes somos", 3 capability cards |
| WhatIsBlockchain | — | Explicación educativa |
| StrategicAreas | `#areas` | 7 áreas de trabajo en grid |
| Process | `#proceso` | Metodología en 5 pasos |
| Impact | — | 7 sectores en pills, marquee |
| CaseStudy | — | Cardano Foundation × Universidad de Brasilia |
| Roadmap | `#roadmap` | 5 iniciativas de corto plazo |
| Team | `#equipo` | 4 miembros con avatares SVG |
| CTA | `#contacto` | Llamado a colaborar, email `blockchain@uai.cl` |
| Footer | — | Links, copyright 2026 |

### `/certificados` — Página de producto

Sistema de emisión y verificación de credenciales académicas en blockchain:

| Sección | Contenido |
|---|---|
| CertHero | Titular impactante, stats (< 2s verificación, SHA-256, 100% anti-falsificación) |
| CertProblem | 3 problemas: sin verificación real, falsificación creciente, legitimidad solo reputacional |
| CertSolution | Verificación criptográfica: Inmutable, Verificable, Soberano, Instantáneo |
| CertBenefits | 3 beneficios: reducción costos, protección reputacional, liderazgo regional |
| CertDemo | **Demo interactivo de 5 pasos** (ver abajo) |
| CertCTA | Llamado a implementar el sistema |

---

## Demo interactivo de certificación (CertDemo)

El componente más elaborado del proyecto. Simula un flujo completo de registro de credenciales:

1. **Subir** — Drop zone para subir el documento
2. **Firmante** — Seleccionar la unidad académica UAI (Facultad de Ingeniería, Escuela de Negocios, Rectoría)
3. **Acceso** — Configurar quién puede verificar el documento (egresado, empleador, MINEDUC, público)
4. **Registrar** — Logs animados del proceso de hash + inscripción en cadena
5. **Resultado** — Muestra el hash SHA-256, bloque, timestamp y estado verificado

**Red usada**: Stellar Testnet vía Soroban (contratos inteligentes en Stellar)

---

## Equipo

| Nombre | Rol |
|---|---|
| Giacomo Tomasoni Orozco | Jefe de Vinculación I+D |
| Francisco Toro | Investigador, Sistemas Descentralizados |
| Pablo Guzmán | Transformación Digital |
| Andrés Peña | Investigador y operaciones |

---

## Áreas estratégicas del Lab

1. Finanzas Descentralizadas (DeFi)
2. Gobernanza Digital
3. Tokenización de Activos
4. Identidad Digital
5. Smart Contracts
6. Trazabilidad y Auditoría
7. RUC-D (Recursos Únicos Compartidos Descentralizados)

---

## Roadmap de corto plazo (5 iniciativas)

| # | Iniciativa | Foco |
|---|---|---|
| 01 | Prospección Empresarial | Empresas que deben cumplir Ley 21.719 (Protección de Datos) |
| 02 | Propuesta de Valor | Deck de conversión adaptado por perfil (legal, CTO, directorio) |
| 03 | Certificaciones | Mapear certs blockchain (Ethereum Foundation, Hyperledger) y explorar las propias de UAI |
| 04 | Respaldo Legal | Contratos, PI, figura jurídica del lab (¿unidad UAI, spin-off?) |
| 05 | Concursos y Vinculación Internacional | CORFO, Minciencia, fondos blockchain (Ethereum Foundation, Filecoin, Web3 Foundation) |

---

## Diseño visual

**Paleta de colores** (hardcodeada inline — no usa tokens Tailwind salvo pocos casos):

| Token | Valor | Uso |
|---|---|---|
| `#0A0A0F` | Negro profundo | Fondo principal |
| `#111118` | Negro suave | Fondo de secciones alternadas |
| `#3B5BDB` | Azul UAI | Acento principal, íconos, highlights |
| `#1E2D6B` | Azul oscuro | Hover, fondos de íconos |
| `#F0F0F5` | Blanco suave | Texto primario |
| `#9898B0` | Gris medio | Texto secundario |
| `#5A5A72` | Gris oscuro | Texto terciario, placeholders |
| `#1E1E2E` | Gris muy oscuro | Bordes |
| `#2A2A3C` | Gris medio-oscuro | Bordes de cards |

**Fuentes**:
- `Inter` — textos, headings (`--font-inter`)
- `JetBrains Mono` — etiquetas mono, códigos (`--font-jetbrains-mono`)

**Animaciones**: Todas con GSAP + ScrollTrigger. Patrón consistente: fade-in desde abajo/izquierda/derecha según el elemento, con stagger en listas. El Hero tiene animación de grafo blockchain rotando indefinidamente.

---

## Comandos de desarrollo

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # ESLint
```

---

## Contacto del proyecto

- **Email**: blockchain@uai.cl
- **Institución**: Universidad Adolfo Ibáñez
- **Copyright**: © 2026 Blockchain Lab UAI
