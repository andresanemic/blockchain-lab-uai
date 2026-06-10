'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { TrendingUp, Vote, Coins, Fingerprint, FileCode, Search, Share2 } from 'lucide-react'

const areas = [
  { num: '01', icon: TrendingUp, title: 'DeFi', desc: 'Finanzas sin intermediarios' },
  { num: '02', icon: Vote, title: 'Gobernanza Digital', desc: 'Decisiones verificables on-chain' },
  { num: '03', icon: Coins, title: 'Tokenización', desc: 'Activos reales en blockchain' },
  { num: '04', icon: Fingerprint, title: 'Identidad Digital', desc: 'Credenciales soberanas' },
  { num: '05', icon: FileCode, title: 'Smart Contracts', desc: 'Lógica inmutable en cadena' },
  { num: '06', icon: Search, title: 'Trazabilidad', desc: 'Registro permanente y auditable' },
  { num: '07', icon: Share2, title: 'RUC-D', desc: 'Recursos compartidos descentralizados' },
]

export default function AreasV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.area-v2', {
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="areas"
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
            Áreas estratégicas
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
            Soluciones aplicadas a{' '}
            <span style={{ color: '#3B5BDB' }}>desafíos reales.</span>
          </h2>
        </div>

        {/* Grid with hairline separators — Blueprint pattern */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {areas.map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="area-v2"
              style={{
                padding: '32px 28px',
                background: '#181818',
                borderRight: '1px solid rgba(255,255,255,0.055)',
                borderBottom: '1px solid rgba(255,255,255,0.055)',
                transition: 'background 0.18s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1f1f1f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#181818')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    color: 'rgba(59,91,219,0.45)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {num}
                </span>
                <Icon size={16} color="rgba(59,91,219,0.65)" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#f2f0ed',
                  marginBottom: '7px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(242,240,237,0.32)',
                  lineHeight: 1.5,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
