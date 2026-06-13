'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const SUBTITLE = 'Empresas, fundaciones e instituciones — co-creemos soluciones reales junto al Blockchain Lab UAI.'
const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#@&%'

const LINES = [
  { text: 'Construyamos',          color: '#080D2B' },
  { text: 'confianza verificable', color: '#0057FF' },
  { text: 'juntos.',               color: '#080D2B' },
]

export default function ContactV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  // Scramble subtitle into view on scroll enter
  useEffect(() => {
    const el  = subtitleRef.current
    const sec = sectionRef.current
    if (!el || !sec) return

    let timerId: ReturnType<typeof setInterval>
    let started = false

    const run = () => {
      let step = 0
      const totalSteps = 44
      el.textContent = ''

      timerId = setInterval(() => {
        el.textContent = SUBTITLE.split('').map((ch, i) => {
          if (ch === ' ' || ch === '—') return ch
          if (i < (step / totalSteps) * SUBTITLE.length) return SUBTITLE[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
        step++
        if (step > totalSteps) {
          clearInterval(timerId)
          el.textContent = SUBTITLE
        }
      }, 42)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true
        setTimeout(run, 720)
      }
    }, { threshold: 0.25 })

    observer.observe(sec)
    return () => { observer.disconnect(); clearInterval(timerId) }
  }, [sectionRef])

  useGSAP(() => {
    gsap.fromTo('.contact-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      {
        y: '0%', opacity: 1, filter: 'blur(0px)',
        duration: 1.25, ease: 'expo.out', stagger: 0.10,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 92%' },
      }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      id="contacto"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        padding: isMobile ? '48px 24px 40px' : 'clamp(96px, 14vh, 160px) clamp(40px, 6vw, 80px) clamp(60px, 10vh, 100px)',
        overflow: 'hidden',
        scrollMarginTop: '72px',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{ maxWidth: '1600px', margin: '0 auto', position: 'relative', zIndex: 3 }}>

        {/* H2 — massive editorial, line-by-line clip + blur reveal */}
        <h2 style={{
          fontFamily: DISPLAY, fontWeight: 300,
          fontSize: 'clamp(48px, 7vw, 100px)',
          letterSpacing: '-0.03em', lineHeight: 0.95,
          margin: '0 0 clamp(40px, 7vh, 72px)',
        }}>
          {LINES.map(({ text, color }, i) => (
            <div key={i} style={{ overflow: 'hidden', lineHeight: 1.04 }}>
              <span
                className="contact-line"
                style={{ display: 'block', color, transform: 'translateY(108%)', opacity: 0 }}
              >
                {text}
              </span>
            </div>
          ))}
        </h2>

        {/* Subtitle — scramble-in on scroll */}
        <p
          ref={subtitleRef}
          style={{
            fontSize: '11px', fontFamily: MONO,
            color: 'rgba(8,13,43,0.38)', lineHeight: 1.9,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            margin: 0, maxWidth: '560px',
            minHeight: '2em',
          }}
        />

      </div>
    </section>
  )
}
