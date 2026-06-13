'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const H1_LINES = [
  { text: 'Pruebas que',  accent: false },
  { text: 'no se pueden', accent: false },
  { text: 'impugnar.',    accent: true  },
]

export default function VideoHeroV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.video-hero-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: 0.10, delay: 0.20 }
    )
    gsap.fromTo('.video-hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.75 }
    )
    gsap.fromTo('.video-hero-img',
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out', delay: isMobile ? 0.55 : 0.35 }
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
        overflow: 'hidden',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{
        position: 'relative', zIndex: 3,
        maxWidth: '1280px', width: '100%', margin: '0 auto',
        padding: isMobile
          ? '120px 24px 72px'
          : '140px clamp(24px, 5vw, 64px) 100px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
      }}>

        {/* Left — text */}
        <div>
          <h1 style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? 'clamp(40px, 11vw, 58px)' : 'clamp(44px, 6vw, 88px)',
            lineHeight: 0.97, letterSpacing: '-0.03em',
            margin: 0, marginBottom: '32px',
          }}>
            {H1_LINES.map(({ text, accent }, i) => (
              <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', lineHeight: '1.04' }}>
                <span
                  className="video-hero-line"
                  style={{ display: 'block', whiteSpace: 'nowrap', transform: 'translateY(108%)', opacity: 0, color: accent ? '#0057FF' : '#080D2B' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </h1>

          <p
            className="video-hero-sub"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: isMobile ? '15px' : '17px',
              color: 'rgba(8,13,43,0.50)',
              maxWidth: '44ch',
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            Transmisión en vivo, blockchain y gobernanza institucional — tres capas que hacen de cada grabación de dron una prueba judicial irrefutable.
          </p>
        </div>

        {/* Right — image card */}
        <div
          className="video-hero-img"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            aspectRatio: isMobile ? '16 / 9' : '3 / 2',
            border: '1px solid rgba(8,13,43,0.08)',
            boxShadow: '0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.08)',
            opacity: 0,
          }}
        >
          <Image
            src="/drone-ruc.webp"
            alt="Dron de vigilancia forestal sobrevolando zona boscosa al atardecer"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            priority
          />
        </div>
      </div>
    </section>
  )
}
