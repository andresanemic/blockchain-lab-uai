'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'

const team = [
  {
    initials: 'GTO',
    name: 'Giacomo Tomasoni Orozco',
    role: 'Jefe de Vinculación I+D',
    bio: 'Lidera la relación entre el laboratorio y las organizaciones. Puente entre investigación académica y aplicación real.',
    color1: '#0057FF', color2: '#1A40A1',
  },
  {
    initials: 'FT',
    name: 'Francisco Toro',
    role: 'Investigador — Sistemas Descentralizados',
    bio: 'Diseña y desarrolla la arquitectura técnica de los proyectos. Especialista en smart contracts y protocolos descentralizados.',
    color1: '#1A40A1', color2: '#080D2B',
  },
  {
    initials: 'PG',
    name: 'Pablo Guzmán',
    role: 'Transformación Digital',
    bio: 'Asegura que la tecnología tenga impacto organizacional real. Trabaja la adopción, los procesos y el cambio.',
    color1: '#0057FF', color2: '#B8860B',
  },
  {
    initials: 'AP',
    name: 'Andrés Peña',
    role: 'Investigador y Operaciones',
    bio: 'Combina investigación aplicada con la gestión operativa del laboratorio. Asegura que los proyectos avancen.',
    color1: '#3366FF', color2: '#1A40A1',
  },
]

export default function TeamV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.reveal') || [], {
      y: 40, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="equipo"
      ref={sectionRef}
      style={{ background: '#080D2B', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div className="reveal" style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: 'rgba(0,87,255,0.8)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
            El Equipo
          </p>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#F8F8F4' }}>
            Las personas detrás<br />
            del <span style={{ color: '#0057FF' }}>Lab.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.initials}
              className="reveal"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                transition: 'border-color 0.25s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(0,87,255,0.3)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Avatar */}
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
                <svg viewBox="0 0 56 56" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id={`g-${member.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={member.color1} />
                      <stop offset="100%" stopColor={member.color2} />
                    </linearGradient>
                  </defs>
                  <rect width="56" height="56" fill={`url(#g-${member.initials})`} />
                  <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="#F8F8F4" fontSize="16" fontFamily="var(--font-lato)" fontWeight="700">{member.initials}</text>
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontFamily: DISPLAY, fontWeight: 700, color: '#F8F8F4', marginBottom: '4px', lineHeight: 1.3 }}>{member.name}</p>
                <p style={{ fontSize: '11px', fontFamily: LABEL, fontWeight: 500, color: 'rgba(0,87,255,0.8)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '10px' }}>{member.role}</p>
                <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
