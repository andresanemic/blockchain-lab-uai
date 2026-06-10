'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const steps = [
  { num: '01', title: 'Identificación del problema', desc: 'Entendemos el desafío real de la organización antes de proponer nada.' },
  { num: '02', title: 'Diseño del caso de uso', desc: 'Definimos dónde y cómo blockchain agrega valor concreto.' },
  { num: '03', title: 'Validación técnica y económica', desc: 'Comprobamos viabilidad, costos e indicadores de éxito.' },
  { num: '04', title: 'Desarrollo de piloto / MVP', desc: 'Construimos una solución funcional, no una demo de laboratorio.' },
  { num: '05', title: 'Escalabilidad y acompañamiento', desc: 'Llevamos el piloto a producción y acompañamos su adopción.' },
]

export default function ProcessV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.step-item') || [], {
      x: -30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
    })
    gsap.from(sectionRef.current?.querySelectorAll('.header-reveal') || [], {
      y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="proceso"
      ref={sectionRef}
      style={{ background: '#080D2B', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '64px' }} className="lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:items-start">

          {/* Left — headline */}
          <div>
            <p className="header-reveal" style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: 'rgba(0,87,255,0.8)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Cómo Trabajamos
            </p>
            <h2 className="header-reveal" style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(34px, 5vw, 64px)', lineHeight: 1.06, letterSpacing: '-0.02em', color: '#F8F8F4', marginBottom: '28px' }}>
              Del problema<br />
              al <span style={{ color: '#0057FF' }}>MVP.</span>
            </h2>
            <p className="header-reveal" style={{ fontSize: '16px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', lineHeight: 1.7, maxWidth: '340px' }}>
              Un proceso probado: del diagnóstico a una solución que funciona en su operación real.
            </p>
          </div>

          {/* Right — steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="step-item"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '24px',
                  padding: '24px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'background 0.2s',
                  borderRadius: '8px',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,87,255,0.04)'; (e.currentTarget as HTMLDivElement).style.paddingLeft = '12px' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.paddingLeft = '0' }}
              >
                {/* Number circle */}
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0,87,255,0.12)',
                  border: '1px solid rgba(0,87,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '11px', fontFamily: MONO, color: '#0057FF', letterSpacing: '0.06em' }}>{step.num}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '17px', fontFamily: DISPLAY, fontWeight: 700, color: '#F8F8F4', marginBottom: '6px', lineHeight: 1.3 }}>{step.title}</p>
                  <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
