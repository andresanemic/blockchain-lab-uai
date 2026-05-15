'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import {
  Building2,
  Presentation,
  Award,
  Scale,
  Globe,
} from 'lucide-react'

const items = [
  {
    n: '01',
    icon: Building2,
    title: 'Prospección Empresarial',
    subtitle: 'Ley de Protección de Datos',
    objective:
      'Identificar y contactar empresas con convenio UAI que enfrenten la obligación de cumplir con la nueva Ley 21.719.',
    actions: [
      'Levantar lista de empresas con convenio activo UAI',
      'Filtrar sectores de mayor exposición: salud, finanzas, retail, RRHH',
      'Redactar mensaje de primer contacto y medir conversión por batch de 10',
      'Designar responsable de seguimiento por batch',
    ],
  },
  {
    n: '02',
    icon: Presentation,
    title: 'Propuesta de Valor',
    subtitle: 'Para Reuniones de Conversión',
    objective:
      'Definir qué decimos y qué ofrecemos para que las reuniones conviertan.',
    actions: [
      'Deck de máximo 8 slides adaptado a cada perfil (gerente legal, CTO, directorio)',
      'Articular el problema: la ley exige trazabilidad, consentimiento verificable y auditoría — blockchain resuelve esto nativamente',
      'Establecer rangos de inversión o esquemas de co-financiamiento con la universidad',
      'Preparar una o dos historias de caso que anclen la conversación',
    ],
  },
  {
    n: '03',
    icon: Award,
    title: 'Certificaciones',
    subtitle: 'Capital Educacional UAI',
    objective:
      'Monetizar y proyectar el prestigio académico de los miembros titulados, profesores y funcionarios de la universidad.',
    actions: [
      'Mapear certificaciones blockchain con reconocimiento real (Ethereum Foundation, Hyperledger, etc.)',
      'Explorar si la UAI puede emitir sus propias certificaciones avaladas institucionalmente',
      'Usar las certificaciones como argumento de credibilidad frente a empresas y en concursos',
    ],
  },
  {
    n: '04',
    icon: Scale,
    title: 'Respaldo Legal',
    subtitle: 'Validación del Marco de Operación',
    objective:
      'Validar el marco legal de la operación antes de escalar.',
    actions: [
      'Agendar reunión con abogada: contratos, propiedad intelectual, responsabilidad y manejo de datos',
      'Definir modelo de contrato estándar para pilotos',
      'Aclarar qué figura jurídica opera (¿lab como unidad UAI, spin-off, otro?)',
    ],
  },
  {
    n: '05',
    icon: Globe,
    title: 'Concursos y Vinculación Internacional',
    subtitle: 'Financiamiento y Red Global',
    objective:
      'Ampliar financiamiento y red de contactos más allá del mercado chileno.',
    actions: [
      'Identificar 3–5 fondos blockchain activos (Ethereum Foundation, Filecoin, Web3 Foundation)',
      'Levantar calendario de concursos CORFO, Minciencia y fondos internacionales',
      'Preparar pitch en inglés del lab para postulaciones internacionales',
      'Buscar aliados académicos internacionales que potencien las postulaciones',
    ],
  },
]

function RoadmapCard({
  item,
  index,
}: {
  item: (typeof items)[number]
  index: number
}) {
  const Icon = item.icon
  const isLast = index === items.length - 1

  return (
    <div
      className="roadmap-card relative flex gap-5"
      style={{ paddingBottom: isLast ? 0 : '2.5rem' }}
    >
      {/* Left: number + connector */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white z-10"
          style={{ background: '#3B5BDB' }}
        >
          {item.n}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-3"
            style={{ background: '#1E1E2E', minHeight: '40px' }}
          />
        )}
      </div>

      {/* Right: content */}
      <div
        className="flex-1 rounded-lg p-6 mb-1"
        style={{ background: '#111118', border: '1px solid #1E1E2E' }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: '#1E2D6B' }}
          >
            <Icon className="w-4 h-4" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-semibold text-sm leading-snug" style={{ color: '#F0F0F5' }}>
              {item.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#3B5BDB' }}>
              {item.subtitle}
            </p>
          </div>
        </div>

        {/* Objective */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#9898B0' }}>
          {item.objective}
        </p>

        {/* Actions */}
        <ul className="space-y-2">
          {item.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: '#9898B0' }}>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                style={{ background: '#3B5BDB' }}
              />
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.roadmap-card', {
        x: -24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: '#0A0A0F' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: '#3B5BDB' }}
          >
            Plan de Acción · Corto Plazo
          </p>
          <h2
            className="text-4xl lg:text-5xl font-extrabold"
            style={{ color: '#F0F0F5' }}
          >
            Nuestro{' '}
            <span style={{ color: '#3B5BDB' }}>Roadmap</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: '#9898B0' }}>
            Las cinco iniciativas prioritarias que definen la dirección del lab
            en el horizonte de corto plazo.
          </p>
        </div>

        {/* Timeline */}
        <div>
          {items.map((item, index) => (
            <RoadmapCard key={item.n} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
