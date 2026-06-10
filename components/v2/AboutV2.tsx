'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

export default function AboutV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els) return
    gsap.from(els, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
  }, { scope: sectionRef })

  const pill = (text: string) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '8px 16px',
      background: '#FFFFFF',
      border: '1px solid rgba(8,13,43,0.10)',
      borderRadius: '100px',
      fontSize: '13px',
      fontFamily: BODY,
      color: 'rgba(8,13,43,0.65)',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0057FF', marginRight: '8px', flexShrink: 0 }} />
      {text}
    </div>
  )

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Blueprint 3-column layout: label+headline | visual | description */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }} className="lg:grid-cols-[1fr_1fr_1fr] lg:gap-16 lg:items-center">

          {/* Left: label + headline */}
          <div className="reveal">
            <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Quiénes Somos
            </p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#080D2B' }}>
              Un laboratorio<br />
              para la <span style={{ color: '#0057FF' }}>confianza</span><br />
              digital.
            </h2>
          </div>

          {/* Center: visual — 3 capabilities */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { num: '01', title: 'Diseño', desc: 'Arquitecturas a medida del problema' },
              { num: '02', title: 'Validación', desc: 'Viabilidad técnica y económica' },
              { num: '03', title: 'Implementación', desc: 'De piloto a producción real' },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{
                background: '#FFFFFF',
                border: '1px solid rgba(8,13,43,0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,87,255,0.3)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,87,255,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(8,13,43,0.08)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
              >
                <span style={{ fontSize: '11px', fontFamily: MONO, color: '#0057FF', letterSpacing: '0.06em', flexShrink: 0 }}>{num}</span>
                <div>
                  <p style={{ fontSize: '15px', fontFamily: DISPLAY, fontWeight: 700, color: '#080D2B', marginBottom: '2px' }}>{title}</p>
                  <p style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(8,13,43,0.5)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: description */}
          <div className="reveal">
            <p style={{ fontSize: '17px', fontFamily: BODY, fontWeight: 700, color: '#080D2B', lineHeight: 1.65, marginBottom: '20px' }}>
              El Blockchain Lab UAI es un laboratorio orientado al diseño, validación e implementación de soluciones basadas en blockchain para organizaciones públicas y privadas.
            </p>
            <p style={{ fontSize: '15px', fontFamily: BODY, color: 'rgba(8,13,43,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>
              Nuestro propósito: transformar la forma en que las instituciones generan confianza verificable.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {pill('Confianza verificable')}
              {pill('Trazabilidad')}
              {pill('Eficiencia económica')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
