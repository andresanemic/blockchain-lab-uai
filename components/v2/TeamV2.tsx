'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const members = [
  { initials: 'GTO', name: 'Giacomo Tomasoni', role: 'Jefe de Vinculación I+D', color1: '#3B5BDB', color2: '#1E2D6B' },
  { initials: 'FT', name: 'Francisco Toro', role: 'Sistemas Descentralizados', color1: '#2A4BC7', color2: '#0D1A50' },
  { initials: 'PG', name: 'Pablo Guzmán', role: 'Transformación Digital', color1: '#3B5BDB', color2: '#C9A84C' },
  { initials: 'AP', name: 'Andrés Peña', role: 'Investigación & Operaciones', color1: '#4A6FE8', color2: '#1A3A7A' },
]

function Avatar({ initials, color1, color2 }: { initials: string; color1: string; color2: string }) {
  const id = `v2g-${initials}`
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill={`url(#${id})`} />
      <text
        x="24" y="29"
        textAnchor="middle"
        fontFamily="var(--font-inter, sans-serif)"
        fontSize={initials.length > 2 ? '9' : '12'}
        fontWeight="600"
        fill="rgba(242,240,237,0.9)"
      >
        {initials}
      </text>
    </svg>
  )
}

export default function TeamV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.team-v2', {
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="equipo"
      ref={sectionRef}
      style={{
        background: '#131313',
        padding: 'clamp(80px, 12vh, 120px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains-mono)',
              color: 'rgba(59,91,219,0.65)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Equipo
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
              fontWeight: 300,
              fontSize: 'clamp(30px, 4.2vw, 54px)',
              letterSpacing: '-0.025em',
              color: '#f2f0ed',
              lineHeight: 1.1,
            }}
          >
            Las personas detrás del{' '}
            <span style={{ color: '#3B5BDB' }}>Lab.</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px',
          }}
        >
          {members.map((m) => (
            <div
              key={m.name}
              className="team-v2"
              style={{
                background: '#181818',
                border: '1px solid rgba(255,255,255,0.055)',
                borderRadius: '14px',
                padding: '26px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'transform 0.22s, border-color 0.22s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = 'rgba(59,91,219,0.28)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.055)'
              }}
            >
              <Avatar initials={m.initials} color1={m.color1} color2={m.color2} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#f2f0ed', marginBottom: '5px', lineHeight: 1.3 }}>
                  {m.name}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'rgba(242,240,237,0.32)',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    letterSpacing: '0.03em',
                    lineHeight: 1.4,
                  }}
                >
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
