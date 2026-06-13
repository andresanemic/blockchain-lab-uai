'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const STATS = [
  { label: 'Probabilidad de impugnación exitosa', value: '≈ 0%' },
  { label: 'Reducción proyectada en peritaje forense',  value: '−70%' },
  { label: 'Sistemas de verificación independientes',   value: '3'    },
]

const H2_LINES = [
  { text: 'Pruebas infalibles,',   accent: false },
  { text: 'menos tiempo,',         accent: false },
  { text: 'más causas ganadas.',   accent: true  },
]

export default function VideoResultadoV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow(true)
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.video-res-eyebrow',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 92%' } }
    )
    gsap.fromTo('.video-res-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      {
        y: '0%', opacity: 1, filter: 'blur(0px)',
        duration: 1.2, ease: 'expo.out', stagger: 0.10, delay: 0.10,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 90%' },
      }
    )
    gsap.fromTo('.video-res-stat',
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'expo.out',
        stagger: { amount: 0.4, from: 'start' }, delay: 0.25,
        scrollTrigger: { trigger: '.video-res-stat', start: 'top 90%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#080D2B',
        padding: isMobile
          ? '48px 24px 40px'
          : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)',
      }}
    >
      <GridGlowLayers dark glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: '1280px', margin: '0 auto' }}>

        {/* Eyebrow */}
        <div
          className="video-res-eyebrow"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', opacity: 0 }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(96,160,255,0.75)', flexShrink: 0 }} />
          <span style={{
            fontFamily: MONO, fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(248,248,244,0.38)',
          }}>
            El impacto proyectado
          </span>
        </div>

        {/* H2 */}
        <h2 style={{
          fontFamily: DISPLAY, fontWeight: 300,
          fontSize: isMobile ? 'clamp(36px, 9vw, 52px)' : 'clamp(44px, 6.5vw, 88px)',
          lineHeight: 0.97, letterSpacing: '-0.03em',
          margin: 0, marginBottom: isMobile ? '48px' : 'clamp(56px, 8vh, 80px)',
        }}>
          {H2_LINES.map(({ text, accent }, i) => (
            <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', lineHeight: '1.04' }}>
              <span
                className="video-res-line"
                style={{ display: 'block', transform: 'translateY(108%)', opacity: 0, color: accent ? '#60A0FF' : '#F8F8F4' }}
              >
                {text}
              </span>
            </div>
          ))}
        </h2>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '12px' : '10px',
        }}>
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="video-res-stat"
              style={{
                background: 'rgba(248,248,244,0.04)',
                border: '1px solid rgba(248,248,244,0.08)',
                borderRadius: '16px',
                padding: isMobile ? '28px 24px' : 'clamp(28px, 4vh, 48px) clamp(24px, 3vw, 40px)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: isMobile ? '140px' : 'clamp(160px, 22vh, 220px)',
                opacity: 0,
              }}
            >
              <p style={{
                fontFamily: MONO, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(248,248,244,0.40)', margin: 0,
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: DISPLAY, fontWeight: 900,
                fontSize: isMobile ? 'clamp(44px, 14vw, 64px)' : 'clamp(48px, 7vw, 88px)',
                lineHeight: 0.88, letterSpacing: '-0.05em',
                color: '#60A0FF', margin: 0,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
