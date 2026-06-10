'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const areas = [
  { num: '01', tag: 'DeFi', title: 'Finanzas Descentralizadas', desc: 'Servicios financieros sin bancos intermediarios.' },
  { num: '02', title: 'Gobernanza Digital', desc: 'Decisiones colectivas transparentes y verificables.' },
  { num: '03', title: 'Tokenización de Activos', desc: 'Representar bienes reales como activos digitales.' },
  { num: '04', title: 'Identidad Digital', desc: 'Identidades autosoberanas y verificables.' },
  { num: '05', title: 'Smart Contracts', desc: 'Acuerdos que se ejecutan solos, sin terceros.' },
  { num: '06', title: 'Trazabilidad y Auditoría', desc: 'Registro inmutable de cada operación.' },
  { num: '07', tag: 'RUC-D', title: 'Recursos Compartidos', desc: 'Recursos únicos compartidos descentralizados.', wide: true },
]

export default function AreasV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.area-card') || [], {
      y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
    })
    gsap.from(sectionRef.current?.querySelectorAll('.section-header') || [], {
      y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="areas"
      ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
          <div>
            <p className="section-header" style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Áreas Estratégicas de Trabajo
            </p>
            <h2 className="section-header" style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#080D2B' }}>
              Soluciones aplicadas a<br />
              <span style={{ color: '#0057FF' }}>desafíos reales.</span>
            </h2>
          </div>
          <p className="section-header" style={{ fontSize: '15px', fontFamily: BODY, color: 'rgba(8,13,43,0.5)', lineHeight: 1.65, maxWidth: '320px' }}>
            Siete frentes, un mismo objetivo: <strong style={{ color: '#080D2B' }}>confianza verificable.</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {areas.map((area) => (
            <div
              key={area.num}
              className={`area-card${area.wide ? ' lg:col-span-3' : ''}`}
              style={{
                gridColumn: area.wide ? '1 / -1' : undefined,
                background: '#FFFFFF',
                border: '1px solid rgba(8,13,43,0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: area.wide ? 'row' : 'column',
                alignItems: area.wide ? 'center' : 'flex-start',
                gap: area.wide ? '40px' : '14px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontFamily: MONO, color: '#0057FF', letterSpacing: '0.06em' }}>{area.num}</span>
                {area.tag && (
                  <span style={{
                    fontSize: '9px', fontFamily: MONO, color: '#F8F8F4', background: '#0057FF',
                    padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>{area.tag}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: area.wide ? '22px' : '17px', fontFamily: DISPLAY, fontWeight: 700, color: '#080D2B', marginBottom: '6px', lineHeight: 1.3 }}>{area.title}</p>
                <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(8,13,43,0.5)', lineHeight: 1.55 }}>{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
