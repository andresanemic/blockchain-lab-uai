'use client'

import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const TECHS = [
  {
    tag: 'IA Generativa',
    desc: 'El chatbot opera el flujo de emisión de principio a fin, sin intervención manual.',
  },
  {
    tag: 'Blockchain',
    desc: 'Registro inmutable en una red descentralizada — verificable por cualquiera en segundos.',
  },
  {
    tag: 'Account Abstraction',
    desc: 'Wallet ligada al número de teléfono del participante, sin seed phrase ni apps adicionales.',
  },
  {
    tag: 'Contrato Inteligente',
    desc: 'Solo la wallet institucional UAI puede emitir certificados del contrato — ningún otro actor.',
  },
]

export default function CertLabV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.cert-lab-card',
      { opacity: 0, y: 56, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.cert-lab-card', start: 'top 92%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        padding: isMobile ? '48px 24px 40px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="cert-lab-card"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: '#080D2B',
            borderRadius: '24px',
            border: `1px solid ${hovered ? 'rgba(96,160,255,0.22)' : 'rgba(96,160,255,0.08)'}`,
            boxShadow: hovered
              ? '0 20px 56px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.18)'
              : '0 2px 16px rgba(0,0,0,0.28)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            overflow: 'hidden',
            transition: [
              'border-color 0.30s ease',
              'box-shadow 0.50s cubic-bezier(0.16,1,0.3,1)',
            ].join(', '),
            opacity: 0,
          }}
        >
          {/* Left panel */}
          <div style={{
            padding: isMobile
              ? '40px 28px 36px'
              : 'clamp(48px, 6vh, 72px) clamp(40px, 5vw, 64px)',
            flexShrink: 0,
            flexBasis: isMobile ? 'auto' : '42%',
            borderRight: isMobile ? 'none' : '1px solid rgba(248,248,244,0.07)',
            borderBottom: isMobile ? '1px solid rgba(248,248,244,0.07)' : 'none',
          }}>
            <p style={{
              fontFamily: MONO, fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(96,160,255,0.75)', marginBottom: '20px',
            }}>
              · Lab Project
            </p>
            <h2 style={{
              fontFamily: DISPLAY, fontWeight: 300,
              fontSize: isMobile ? '28px' : 'clamp(28px, 3.2vw, 44px)',
              lineHeight: 1.1, letterSpacing: '-0.025em',
              color: '#F8F8F4', marginBottom: '16px',
            }}>
              Rigor y <span style={{ color: '#60A0FF' }}>tecnologías disruptivas.</span>
            </h2>
            <p style={{
              fontFamily: BODY, fontSize: '14px',
              color: 'rgba(248,248,244,0.48)', lineHeight: 1.65,
              maxWidth: '36ch',
            }}>
              Cada componente fue elegido para eliminar intermediarios y hacer la confianza verificable sin depender de terceros.
            </p>
          </div>

          {/* Right panel — bullet list */}
          <div style={{
            padding: isMobile
              ? '36px 28px 40px'
              : 'clamp(48px, 6vh, 72px) clamp(40px, 5vw, 64px)',
            flexGrow: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: isMobile ? '24px' : '28px',
          }}>
            {TECHS.map(({ tag, desc }) => (
              <div key={tag} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: '#60A0FF', marginTop: '7px', flexShrink: 0,
                }} />
                <div>
                  <span style={{
                    fontFamily: MONO, fontSize: '13px', fontWeight: 700,
                    letterSpacing: '0.06em', color: '#F8F8F4',
                    display: 'block', marginBottom: '6px',
                  }}>
                    {tag}
                  </span>
                  <span style={{
                    fontFamily: BODY, fontSize: '15px',
                    color: 'rgba(248,248,244,0.55)', lineHeight: 1.65,
                  }}>
                    {desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
