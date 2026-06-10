'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'

export default function ContactV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.reveal') || [], {
      y: 48, opacity: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="contacto"
      ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(120px, 18vh, 180px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <p className="reveal" style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '24px' }}>
          Invitación a Colaborar
        </p>

        <h2 className="reveal" style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(40px, 7.5vw, 108px)', letterSpacing: '-0.025em', color: '#080D2B', lineHeight: 1.0, marginBottom: '24px', maxWidth: '900px' }}>
          Blockchain no es una tendencia.
          <br />
          <span style={{ color: '#0057FF' }}>Es una nueva infraestructura</span>
          <br />
          de confianza.
        </h2>

        <p className="reveal" style={{ fontSize: '18px', fontFamily: BODY, fontWeight: 700, color: '#080D2B', lineHeight: 1.65, maxWidth: '640px', marginBottom: '48px' }}>
          Invitamos a empresas, fundaciones e instituciones a co-crear soluciones reales junto al Blockchain Lab UAI.
        </p>

        <div className="reveal" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="mailto:blockchain@uai.cl"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 40px',
              background: '#0057FF',
              color: '#F8F8F4',
              fontSize: '15px',
              fontFamily: LABEL, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1A40A1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Iniciar conversación →
          </a>
          <a
            href="mailto:blockchain@uai.cl"
            style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: '#0057FF',
              textDecoration: 'none',
              transition: 'color 0.15s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#1A40A1' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#0057FF' }}
          >
            blockchain@uai.cl
          </a>
        </div>
      </div>
    </section>
  )
}
