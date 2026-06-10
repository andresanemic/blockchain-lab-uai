'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const stats = [
  { num: '7', label: 'Áreas de investigación' },
  { num: '3+', label: 'Proyectos desplegados' },
  { num: 'UAI', label: 'Universidad Adolfo Ibáñez' },
]

export default function StatementV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.stmt-line', {
        y: 64,
        opacity: 0,
        duration: 1.0,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from('.stmt-stat', {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0e0e0e',
        padding: 'clamp(80px, 13vh, 140px) clamp(20px, 4vw, 48px)',
        borderTop: '1px solid rgba(255,255,255,0.045)',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
            fontWeight: 300,
            fontSize: 'clamp(36px, 5.8vw, 80px)',
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            marginBottom: 'clamp(48px, 8vh, 72px)',
          }}
        >
          <span className="stmt-line" style={{ display: 'block', color: 'rgba(242,240,237,0.82)' }}>
            Donde la academia
          </span>
          <span className="stmt-line" style={{ display: 'block', color: '#3B5BDB' }}>
            construye tecnología
          </span>
          <span className="stmt-line" style={{ display: 'block', color: 'rgba(242,240,237,0.82)' }}>
            que transforma.
          </span>
        </h2>

        <div style={{ display: 'flex', gap: 'clamp(32px, 6vw, 72px)', flexWrap: 'wrap' }}>
          {stats.map(({ num, label }) => (
            <div key={label} className="stmt-stat">
              <p
                style={{
                  fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  color: '#3B5BDB',
                  lineHeight: 1,
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}
              >
                {num}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  color: 'rgba(242,240,237,0.30)',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
