'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

export default function ProjectsV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from(sectionRef.current?.querySelectorAll('.reveal') || [], {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
  }, { scope: sectionRef })

  return (
    <section id="proyectos" ref={sectionRef}
      style={{ background: '#F8F8F4', padding: 'clamp(96px,14vh,136px) clamp(24px,5vw,64px)', borderTop: '1px solid rgba(8,13,43,0.06)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div className="reveal" style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>Nuestros Proyectos</p>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 'clamp(36px,5.5vw,72px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#080D2B' }}>
            Lo que estamos<br /><span style={{ color: '#0057FF' }}>construyendo hoy.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-2">

          {/* 01 — Certificados NFT */}
          <div className="reveal" style={{
            background: '#080D2B', border: '1px solid rgba(0,87,255,0.2)', borderRadius: '20px',
            padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontFamily: MONO, color: '#0057FF', letterSpacing: '0.06em' }}>01</span>
              <span style={{ height: '1px', flex: 1, background: 'rgba(0,87,255,0.2)' }} />
              <span style={{ fontSize: '11px', fontFamily: MONO, color: 'rgba(0,87,255,0.5)', letterSpacing: '0.08em' }}>CERTIFICADOS NFT EN BLOCKCHAIN</span>
            </div>
            <div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(22px,3vw,34px)', color: '#F8F8F4', lineHeight: 1.2, marginBottom: '12px' }}>
                Sus certificados,<br /><span style={{ color: '#0057FF' }}>imposibles de falsificar.</span>
              </h3>
              <p style={{ fontSize: '15px', fontFamily: BODY, color: 'rgba(248,248,244,0.5)', lineHeight: 1.65 }}>
                Emisión de certificados como NFTs en blockchain. Verificación instantánea con Account Abstraction. Costo menor a $0.01 por certificado.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {[{ val: '< $0.01', l: 'Costo/certificado' }, { val: '< 30s', l: 'Emisión' }, { val: '∞', l: 'Años validez' }].map(({ val, l }) => (
                <div key={l} style={{ background: 'rgba(0,87,255,0.08)', border: '1px solid rgba(0,87,255,0.15)', borderRadius: '10px', padding: '14px 10px', textAlign: 'center' }}>
                  <p style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: '20px', color: '#0057FF', marginBottom: '4px', lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(248,248,244,0.32)', lineHeight: 1.4 }}>{l}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Blockchain', 'NFT', 'Stellar', 'Account Abstraction', 'Chatbot'].map(t => (
                <span key={t} style={{ padding: '4px 10px', border: '1px solid rgba(0,87,255,0.25)', borderRadius: '100px', fontSize: '11px', fontFamily: MONO, color: 'rgba(0,87,255,0.8)', letterSpacing: '0.04em' }}>{t}</span>
              ))}
            </div>
            <a href="/certificados" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0057FF', color: '#F8F8F4', fontFamily: LABEL, fontWeight: 500, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s', alignSelf: 'flex-start' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A40A1' }} onMouseLeave={e => { e.currentTarget.style.background = '#0057FF' }}>
              Ver demo →
            </a>
          </div>

          {/* 02 — Validación Videos */}
          <div className="reveal" style={{
            background: '#FFFFFF', border: '1px solid rgba(8,13,43,0.08)', borderRadius: '20px',
            padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontFamily: MONO, color: '#0057FF', letterSpacing: '0.06em' }}>02</span>
              <span style={{ height: '1px', flex: 1, background: 'rgba(0,87,255,0.15)' }} />
              <span style={{ fontSize: '11px', fontFamily: MONO, color: 'rgba(0,87,255,0.45)', letterSpacing: '0.08em' }}>VALIDACIÓN DE VIDEOS · RUC-D</span>
            </div>
            <div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(22px,3vw,34px)', color: '#080D2B', lineHeight: 1.2, marginBottom: '12px' }}>
                Un video de dron como<br /><span style={{ color: '#0057FF' }}>prueba judicial válida.</span>
              </h3>
              <p style={{ fontSize: '15px', fontFamily: BODY, color: 'rgba(8,13,43,0.55)', lineHeight: 1.65 }}>
                Streaming en vivo + SHA-256 + blockchain = ninguna objeción de defensa es válida.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { obj: '"No sabemos de dónde viene"', sol: 'GPS + serie del dron + streaming en vivo.' },
                { obj: '"El video fue editado"', sol: 'SHA-256: un solo píxel cambia el hash.' },
                { obj: '"Cadena de custodia rota"', sol: 'Al blockchain antes que cualquier mano humana.' },
              ].map(({ obj, sol }) => (
                <div key={obj} style={{ background: '#F8F8F4', borderRadius: '10px', padding: '12px 16px', borderLeft: '3px solid #0057FF' }}>
                  <p style={{ fontSize: '12px', fontFamily: BODY, color: '#cc2200', marginBottom: '3px', fontStyle: 'italic' }}>{obj}</p>
                  <p style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(8,13,43,0.6)' }}>{sol}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['SHA-256', 'Blockchain', 'Drones', 'Validez Judicial', 'RUC-D'].map(t => (
                <span key={t} style={{ padding: '4px 10px', border: '1px solid rgba(0,87,255,0.2)', borderRadius: '100px', fontSize: '11px', fontFamily: MONO, color: 'rgba(0,87,255,0.75)', letterSpacing: '0.04em' }}>{t}</span>
              ))}
            </div>
            <a href="/validacion-pruebas-multimedia" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '1px solid rgba(0,87,255,0.3)', color: '#0057FF', fontFamily: LABEL, fontWeight: 500, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s, color 0.2s', alignSelf: 'flex-start' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.color = '#F8F8F4' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0057FF' }}>
              Ver validación →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
