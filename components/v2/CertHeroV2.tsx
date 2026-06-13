'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const H1_LINES = [
  { text: 'Certificados que', accent: false },
  { text: 'no se pueden',     accent: false },
  { text: 'falsificar.',      accent: true  },
]

export default function CertHeroV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.cert-hero-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: 0.10, delay: 0.20 }
    )
    gsap.fromTo('.cert-hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.75 }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{
        position: 'relative', zIndex: 3,
        maxWidth: '1280px', width: '100%', margin: '0 auto',
        padding: isMobile
          ? '120px 24px 80px'
          : '140px clamp(24px, 5vw, 64px) 100px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: DISPLAY, fontWeight: 300,
          fontSize: isMobile ? 'clamp(40px, 11vw, 58px)' : 'clamp(56px, 7.5vw, 112px)',
          lineHeight: 0.97, letterSpacing: '-0.03em',
          margin: 0, marginBottom: '40px',
        }}>
          {H1_LINES.map(({ text, accent }, i) => (
            <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', lineHeight: '1.04' }}>
              <span
                className="cert-hero-line"
                style={{ display: 'block', transform: 'translateY(108%)', opacity: 0, color: accent ? '#0057FF' : '#080D2B' }}
              >
                {text}
              </span>
            </div>
          ))}
        </h1>

        <p
          className="cert-hero-sub"
          style={{
            fontFamily: 'var(--font-inter)', fontSize: isMobile ? '15px' : '17px',
            color: 'rgba(8,13,43,0.50)', maxWidth: '44ch', lineHeight: 1.7,
            opacity: 0, textAlign: 'center',
          }}
        >
          Cada certificado queda registrado permanentemente en blockchain — verificable por cualquiera en segundos, imposible de falsificar.
        </p>
      </div>
    </section>
  )
}
