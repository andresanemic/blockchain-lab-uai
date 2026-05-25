'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import {
  TrendingUp,
  Vote,
  Coins,
  Fingerprint,
  FileCode,
  Search,
  Share2,
} from 'lucide-react'

const areas = [
  {
    num: '01',
    icon: TrendingUp,
    title: 'Finanzas Descentralizadas (DeFi)',
    desc: 'Protocolos financieros sin intermediarios tradicionales',
  },
  {
    num: '02',
    icon: Vote,
    title: 'Gobernanza Digital',
    desc: 'Mecanismos de decisión colectiva verificables on-chain',
  },
  {
    num: '03',
    icon: Coins,
    title: 'Tokenización de Activos',
    desc: 'Representación digital de activos del mundo real',
  },
  {
    num: '04',
    icon: Fingerprint,
    title: 'Identidad Digital',
    desc: 'Credenciales soberanas y verificación descentralizada',
  },
  {
    num: '05',
    icon: FileCode,
    title: 'Smart Contracts',
    desc: 'Automatización de acuerdos con lógica inmutable',
  },
  {
    num: '06',
    icon: Search,
    title: 'Trazabilidad y Auditoría',
    desc: 'Registro permanente y auditable de procesos',
  },
  {
    num: '07',
    icon: Share2,
    title: 'RUC-D',
    desc: 'Recursos únicos compartidos descentralizados',
  },
]

export default function StrategicAreas() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>('.area-card')
    )
    if (!cards.length) return

    gsap.set(cards, { opacity: 0, y: 44 })

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
        })
      },
    })

    return () => {
      trigger.kill()
      gsap.set(cards, { clearProps: 'all' })
    }
  }, [])

  return (
    <section
      id="areas"
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: '#0A0A0F' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Áreas Estratégicas
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{ color: '#F0F0F5' }}>
            Soluciones aplicadas a{' '}
            <span style={{ color: '#3B5BDB' }}>desafíos reales</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map(({ num, icon: Icon, title, desc }, i) => (
            <div
              key={num}
              className={`area-card p-7 rounded flex flex-col gap-5 cursor-default ${
                i === 6 ? 'lg:col-span-3 lg:flex-row lg:items-center lg:gap-12' : ''
              }`}
              style={{
                background: '#111118',
                border: '1px solid #2A2A3C',
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,91,219,0.55)'
                e.currentTarget.style.boxShadow = '0 0 28px rgba(59,91,219,0.13)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A3C'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span
                className="font-mono text-xs"
                style={{ color: '#5A5A72' }}
              >
                {num}
              </span>

              <Icon
                className="w-6 h-6"
                style={{ color: '#3B5BDB' }}
                strokeWidth={1.5}
              />

              <div>
                <h3
                  className="font-semibold text-sm mb-1.5 leading-snug"
                  style={{ color: '#F0F0F5' }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-snug"
                  style={{ color: '#9898B0' }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
