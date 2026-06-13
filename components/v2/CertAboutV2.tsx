'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

export default function CertAboutV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.cert-about-left',
      { opacity: 0, y: 64 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' } }
    )
    gsap.fromTo('.cert-about-right',
      { opacity: 0, y: 48 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out', delay: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{
        position: 'relative', zIndex: 3,
        maxWidth: '1280px', margin: '0 auto',
        padding: isMobile
          ? '48px 24px 40px'
          : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px) clamp(96px, 14vh, 136px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '48px' : 'clamp(40px, 6vw, 100px)',
        alignItems: 'start',
      }}>
        {/* Left — project name */}
        <div className="cert-about-left" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0057FF', flexShrink: 0 }} />
            <span style={{
              fontFamily: MONO, fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(8,13,43,0.38)',
            }}>
              Proyecto
            </span>
          </div>

          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? 'clamp(44px, 12vw, 64px)' : 'clamp(48px, 6.5vw, 88px)',
            lineHeight: 0.95, letterSpacing: '-0.03em',
            color: '#080D2B', margin: 0,
          }}>
            <span style={{ display: 'block' }}>Certificados</span>
            <span style={{ display: 'block', color: '#0057FF' }}>UAI.</span>
          </h2>
        </div>

        {/* Right — description */}
        <div className="cert-about-right" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0057FF', flexShrink: 0 }} />
            <span style={{
              fontFamily: MONO, fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(8,13,43,0.38)',
            }}>
              Desafío
            </span>
          </div>

          <p style={{
            fontFamily: BODY, fontSize: isMobile ? '16px' : '18px',
            color: 'rgba(8,13,43,0.50)', lineHeight: 1.7,
            marginBottom: '28px',
          }}>
            Los títulos y certificados tradicionales pueden falsificarse. Las instituciones invierten días en verificaciones manuales que no escalan.
          </p>

          <p style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? '20px' : 'clamp(20px, 2.2vw, 28px)',
            lineHeight: 1.4, letterSpacing: '-0.015em',
            color: '#080D2B',
          }}>
            El Lab diseñó un sistema donde cada certificado queda registrado en blockchain — verificable por cualquiera en segundos, imposible de alterar.
          </p>
        </div>
      </div>
    </section>
  )
}
