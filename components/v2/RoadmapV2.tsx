'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const items = [
  {
    num: '01',
    title: 'Prospección Empresarial',
    sub: 'Ley de Protección de Datos',
    objective: 'Identificar empresas con convenio UAI que enfrenten la Ley 21.719 y necesiten trazabilidad blockchain.',
    actions: ['Levantar lista de empresas con convenio activo', 'Filtrar sectores de mayor exposición: salud, finanzas, retail, RRHH', 'Redactar mensajes de primer contacto por batch de 10'],
  },
  {
    num: '02',
    title: 'Propuesta de Valor',
    sub: 'Para reuniones de conversión',
    objective: 'Deck de máximo 8 slides adaptado a cada perfil: gerente legal, CTO, directorio.',
    actions: ['Articular el problema: la ley exige trazabilidad verificable', 'Establecer rangos de inversión y co-financiamiento UAI', 'Preparar casos de uso que anclen la conversación'],
  },
  {
    num: '03',
    title: 'Certificaciones',
    sub: 'Capital educacional UAI',
    objective: 'Monetizar el prestigio académico de los miembros del laboratorio.',
    actions: ['Mapear certificaciones con reconocimiento real (Ethereum Foundation, Hyperledger)', 'Explorar certificaciones avaladas institucionalmente por la UAI', 'Usar certificaciones como argumento de credibilidad'],
  },
  {
    num: '04',
    title: 'Respaldo Legal',
    sub: 'Validación del marco de operación',
    objective: 'Validar el marco legal antes de escalar.',
    actions: ['Agendar reunión con abogada: PI, responsabilidad y datos', 'Definir modelo de contrato estándar para pilotos', 'Aclarar la figura jurídica que opera el lab'],
  },
  {
    num: '05',
    title: 'Concursos y Vinculación Internacional',
    sub: 'Financiamiento y red global',
    objective: 'Ampliar financiamiento y red de contactos más allá del mercado chileno.',
    actions: ['Identificar 3-5 fondos blockchain activos (Ethereum Foundation, Filecoin, Web3 Foundation)', 'Levantar calendario de concursos CORFO y Minciencia', 'Preparar pitch en inglés para postulaciones internacionales'],
  },
]

export default function RoadmapV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.road-card') || [], {
      y: 60, opacity: 0, scale: 0.95,
      duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
    })
    gsap.from(sectionRef.current?.querySelectorAll('.header-r') || [], {
      y: 44, opacity: 0, duration: 1.0, ease: 'expo.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{ marginBottom: '56px' }}>
          <p className="header-r" style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Plan de Acción · Corto Plazo
          </p>
          <h2 className="header-r" style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#080D2B' }}>
            Nuestro <span style={{ color: '#0057FF' }}>Roadmap.</span>
          </h2>
          <p className="header-r" style={{ fontSize: '16px', fontFamily: BODY, color: 'rgba(8,13,43,0.5)', lineHeight: 1.65, maxWidth: '560px', marginTop: '16px' }}>
            Las cinco iniciativas prioritarias que definen la dirección del lab en el horizonte de corto plazo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {items.map((item, idx) => (
            <div
              key={item.num}
              className="road-card"
              style={{
                gridColumn: idx >= 3 ? undefined : undefined,
                background: '#FFFFFF',
                border: '1px solid rgba(8,13,43,0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(0,87,255,0.3)'
                el.style.boxShadow = '0 8px 32px rgba(0,87,255,0.07)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(8,13,43,0.08)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '24px', fontFamily: DISPLAY, fontWeight: 900, color: '#0057FF', lineHeight: 1 }}>{item.num}</span>
                <span style={{ fontSize: '10px', fontFamily: MONO, color: 'rgba(8,13,43,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.sub}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontFamily: DISPLAY, fontWeight: 700, color: '#080D2B', marginBottom: '8px', lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(8,13,43,0.55)', lineHeight: 1.6, marginBottom: '14px' }}>{item.objective}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.actions.map((a, i) => (
                    <li key={i} style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(8,13,43,0.5)', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#0057FF', flexShrink: 0, marginTop: '2px' }}>—</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
