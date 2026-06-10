'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'

const sectors = [
  { label: 'Sector financiero', icon: '🏦' },
  { label: 'Educación y certificaciones', icon: '🎓' },
  { label: 'Salud y trazabilidad', icon: '🏥' },
  { label: 'Fundaciones y ONG', icon: '🤝' },
  { label: 'Sector público', icon: '🏛️' },
  { label: 'Supply chain', icon: '🚚' },
  { label: 'Recursos Humanos', icon: '👥' },
]

export default function ImpactV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.reveal') || [], {
      y: 36, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="impacto"
      ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Impacto Esperado
          </p>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#080D2B' }}>
            Transformación de industrias<br />
            <span style={{ color: '#0057FF' }}>y sectores.</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="reveal" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px',
          background: 'rgba(8,13,43,0.08)', borderRadius: '20px', overflow: 'hidden',
          marginBottom: '56px',
        }}>
          {[
            { val: '7', label: 'Áreas estratégicas', sub: 'de aplicación' },
            { val: '2+', label: 'Proyectos activos', sub: 'en producción' },
            { val: 'UAI', label: 'Respaldo académico', sub: 'Universidad Adolfo Ibáñez' },
          ].map(({ val, label, sub }) => (
            <div key={val} style={{
              background: '#FFFFFF',
              padding: 'clamp(32px, 5vw, 56px) clamp(24px, 4vw, 40px)',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 'clamp(48px, 7vw, 88px)', color: '#0057FF', lineHeight: 1, marginBottom: '8px' }}>{val}</p>
              <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', color: '#080D2B', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: BODY, fontSize: '13px', color: 'rgba(8,13,43,0.45)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Sector pills */}
        <div className="reveal">
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: 'rgba(8,13,43,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Sectores de aplicación
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {sectors.map(({ label, icon }) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 20px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(8,13,43,0.09)',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontFamily: BODY,
                  color: '#080D2B',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(0,87,255,0.3)'
                  el.style.boxShadow = '0 4px 16px rgba(0,87,255,0.06)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(8,13,43,0.09)'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
