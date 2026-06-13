'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

export default function AboutV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const num100Ref = useRef<HTMLParagraphElement>(null)
  const num7Ref   = useRef<HTMLParagraphElement>(null)
  const isMobile = useIsMobile()

  useGSAP(() => {
    const st = { trigger: sectionRef.current, start: 'top 82%' }

    // h2 reveal
    gsap.from('.about-h2', {
      y: 72, opacity: 0, scale: 0.96, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })

    // Counter 100%
    if (num100Ref.current) {
      const obj = { v: 0 }
      gsap.to(obj, {
        v: 100, duration: 1.6, ease: 'expo.out',
        snap: { v: 1 },
        scrollTrigger: st,
        onUpdate: () => { if (num100Ref.current) num100Ref.current.textContent = Math.round(obj.v) + '%' },
      })
    }

    // Counter 7
    if (num7Ref.current) {
      const obj = { v: 0 }
      gsap.to(obj, {
        v: 7, duration: 1.4, ease: 'expo.out',
        snap: { v: 1 },
        delay: 0.15,
        scrollTrigger: st,
        onUpdate: () => { if (num7Ref.current) num7Ref.current.textContent = String(Math.round(obj.v)) },
      })
    }

    // Scrubbed scale dissolve — idéntico a ImpactV2
    gsap.from('.about-num', {
      scale: 1.18, opacity: 0,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 40%', scrub: 1.2 },
    })

    // Labels fade
    gsap.from('.about-label', {
      y: 20, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.12, delay: 0.35,
      scrollTrigger: st,
    })
  }, { scope: sectionRef })

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', background: '#F8F8F4', padding: isMobile ? '48px 24px 80px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px) clamp(160px, 28vh, 280px)', overflow: 'hidden', scrollMarginTop: '80px' }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 3 }}>

        {/* h2 + stats column — grid asimétrico */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr clamp(200px, 22vw, 260px)', gap: isMobile ? '40px' : 'clamp(40px, 6vw, 88px)', alignItems: 'start' }}>

          <h2 className="about-h2" style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? 'clamp(40px, 10vw, 52px)' : 'clamp(52px, 8vw, 112px)',
            lineHeight: 0.95, letterSpacing: '-0.03em',
            color: '#080D2B', margin: 0,
          }}>
            Innovación<br />
            Económica y<br />
            Relaciones<br />
            <span style={{ color: '#0057FF' }}>Descentralizadas.</span>
          </h2>

          {/* Stats — columna vertical derecha (fila horizontal en mobile) */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', flexWrap: isMobile ? 'wrap' : undefined, gap: isMobile ? '24px 32px' : 'clamp(24px, 3vw, 36px)', paddingTop: '8px' }}>

            <div>
              <p ref={num100Ref} className="about-num" style={{
                fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(32px, 6.5vw, 90px)',
                lineHeight: 0.88, letterSpacing: '-0.05em',
                color: '#0057FF', margin: 0,
              }}>0%</p>
              <p className="about-label" style={{
                fontFamily: MONO, fontSize: '10px',
                color: 'rgba(8,13,43,0.38)', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginTop: '10px', whiteSpace: 'pre-line',
              }}>{'Orientado a impacto\norganizacional'}</p>
            </div>

            <div>
              <p ref={num7Ref} className="about-num" style={{
                fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(32px, 6.5vw, 90px)',
                lineHeight: 0.88, letterSpacing: '-0.05em',
                color: '#0057FF', margin: 0,
              }}>0</p>
              <p className="about-label" style={{
                fontFamily: MONO, fontSize: '10px',
                color: 'rgba(8,13,43,0.38)', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginTop: '10px', whiteSpace: 'pre-line',
              }}>{'Áreas estratégicas\nactivas'}</p>
            </div>

            <div>
              <div className="about-num" style={{ margin: 0, lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uai-negro.png"
                  alt="Universidad Adolfo Ibáñez"
                  style={{ height: 'clamp(44px, 6vw, 78px)', width: 'auto', maxWidth: '100%', display: 'block' }}
                />
              </div>
              <p className="about-label" style={{
                fontFamily: MONO, fontSize: '10px',
                color: 'rgba(8,13,43,0.38)', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginTop: '10px', whiteSpace: 'pre-line',
              }}>{'Respaldo académico\ny científico'}</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
