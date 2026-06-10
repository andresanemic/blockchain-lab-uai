'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'

const features = [
  { key: 'Segura', desc: 'Protegida por criptografía. Inviolable por diseño.' },
  { key: 'Transparente', desc: 'Cualquiera puede verificar lo registrado.' },
  { key: 'Inmutable', desc: 'Lo escrito no se puede borrar ni alterar.' },
  { key: 'Descentralizada', desc: 'Sin un único punto de control ni de falla.' },
]

function NetworkSVG() {
  const nodes = [
    { cx: 200, cy: 80 },
    { cx: 380, cy: 60 },
    { cx: 140, cy: 200 },
    { cx: 300, cy: 190 },
    { cx: 450, cy: 170 },
    { cx: 240, cy: 310 },
    { cx: 400, cy: 300 },
    { cx: 120, cy: 330 },
  ]
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 3], [2, 3], [2, 7],
    [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [5, 7],
  ]
  return (
    <svg viewBox="0 60 520 280" style={{ width: '100%', maxWidth: '460px', display: 'block', margin: '0 auto' }}>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(0,87,255,0.20)" strokeWidth="1.5"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r={i === 3 ? 18 : 10} fill={i === 3 ? '#0057FF' : '#FFFFFF'} stroke="rgba(0,87,255,0.30)" strokeWidth="1.5" />
          {i === 3 && <circle cx={n.cx} cy={n.cy} r={26} fill="none" stroke="rgba(0,87,255,0.12)" strokeWidth="1" />}
        </g>
      ))}
    </svg>
  )
}

export default function BlockchainV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els) return
    gsap.from(els, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.10,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="blockchain"
      ref={sectionRef}
      style={{ background: '#080D2B', padding: 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Blueprint 3-col: left text | center network | right features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }} className="lg:grid-cols-[1fr_1fr_1fr] lg:gap-16 lg:items-center">

          {/* Left */}
          <div className="reveal">
            <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: 'rgba(0,87,255,0.8)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
              ¿Qué es Blockchain?
            </p>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.06, letterSpacing: '-0.02em', color: '#F8F8F4', marginBottom: '24px' }}>
              Infraestructura para<br />
              la <span style={{ color: '#0057FF' }}>confianza digital.</span>
            </h2>
            <p style={{ fontSize: '16px', fontFamily: BODY, color: 'rgba(248,248,244,0.5)', lineHeight: 1.7 }}>
              Permite{' '}
              <span style={{ color: 'rgba(0,87,255,0.9)' }}>eliminar intermediarios</span>
              {' '}y crear sistemas basados en confianza matemática y verificabilidad permanente.
            </p>
          </div>

          {/* Center: network visualization */}
          <div className="reveal">
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '32px 24px',
            }}>
              <NetworkSVG />
            </div>
          </div>

          {/* Right: 4 features */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map(({ key, desc }) => (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '16px 20px',
                borderLeft: '3px solid #0057FF',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,87,255,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)' }}
              >
                <p style={{ fontSize: '15px', fontFamily: DISPLAY, fontWeight: 700, color: '#F8F8F4', marginBottom: '4px' }}>{key}</p>
                <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div className="reveal" style={{
          marginTop: '64px',
          background: 'rgba(0,87,255,0.08)',
          border: '1px solid rgba(0,87,255,0.2)',
          borderRadius: '16px',
          padding: '28px 36px',
          display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        }}>
          <p style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(18px, 2.5vw, 26px)', color: '#F8F8F4', lineHeight: 1.4, flex: '1 1 300px' }}>
            "Confiar cuesta caro. <span style={{ color: '#0057FF' }}>Nosotros lo abaratamos.</span>"
          </p>
          <a href="#proyectos" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', background: '#0057FF', color: '#F8F8F4',
            fontFamily: LABEL, fontWeight: 500, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase',
            borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s',
            flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1A40A1' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0057FF' }}
          >
            Ver proyectos →
          </a>
        </div>
      </div>
    </section>
  )
}
