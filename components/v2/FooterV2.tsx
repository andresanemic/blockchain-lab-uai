'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const LABEL   = 'var(--font-oswald, var(--font-inter))'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const navLinks = [
  { label: 'Nosotros',             href: '#' },
  { label: 'TIM',                  href: '#' },
  { label: 'Certificados',         href: '/certificados' },
  { label: 'Validación de videos', href: '/validacion-videos' },
  { label: 'Blog',                 href: '#' },
]

const SUBTITLE = 'Empresas, fundaciones e instituciones - co-crea soluciones reales con el Blockchain Lab UAI'
const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#@&%'

const CTA_LINES = [
  { text: 'Construyamos',          color: '#080D2B' },
  { text: 'confianza verificable', color: '#0057FF' },
  { text: 'juntos.',               color: '#080D2B' },
]

export default function FooterV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const isMobile = useIsMobile()

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
        if (step > totalSteps) { clearInterval(timerId); el.textContent = SUBTITLE }
      }, 42)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { started = true; setTimeout(run, 720) }
    }, { threshold: 0.1 })
    observer.observe(sec)
    return () => { observer.disconnect(); clearInterval(timerId) }
  }, [sectionRef])

  useGSAP(() => {
    gsap.fromTo('.footer-cta-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.25, ease: 'expo.out', stagger: 0.10,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  const PT = 'clamp(88px, 10vh, 108px)'
  const PB = 'clamp(40px, 5vh, 56px)'
  const PX = 'clamp(40px, 6vw, 80px)'

  return (
    <footer
      id="contacto"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        color: '#080D2B',
        fontFamily: BODY,
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{
        position: 'relative', zIndex: 3,
        flex: 1,
        display: 'grid',
        /* 3 columns: Explorar | Contáctanos | Logos → 1 col en mobile */
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr clamp(220px, 24vw, 320px)',
        gridTemplateRows: 'auto',
        gap: isMobile ? '0' : `0 clamp(32px, 4vw, 56px)`,
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        padding: `0 ${isMobile ? '24px' : PX}`,
      }}>

        {/* ── ROW 1: h2 + subtitle (full-width on mobile, spans cols 1–2 on desktop) ── */}
        <div style={{
          gridColumn: isMobile ? undefined : '1 / 3',
          paddingTop: PT,
          paddingBottom: 'clamp(28px, 4vh, 44px)',
        }}>
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? 'clamp(36px, 10vw, 56px)' : 'clamp(48px, 7vw, 100px)',
            letterSpacing: '-0.03em', lineHeight: 0.95,
            margin: '0 0 clamp(16px, 2.5vh, 24px)',
          }}>
            {CTA_LINES.map(({ text, color }, i) => (
              <div key={i} style={{ overflow: 'hidden', lineHeight: 1.04, paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
                <span className="footer-cta-line" style={{ display: 'block', color, transform: 'translateY(108%)', opacity: 0 }}>
                  {text}
                </span>
              </div>
            ))}
          </h2>

          <p ref={subtitleRef} style={{
            fontSize: '11px', fontFamily: MONO,
            color: 'rgba(8,13,43,0.38)', lineHeight: 1.9,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            margin: 0, maxWidth: '540px', minHeight: '2em',
          }} />
        </div>

        {/* Row 1, col 3: empty — keeps grid consistent (hidden on mobile) */}
        {!isMobile && <div style={{ paddingTop: PT }} />}

        {/* ── ROW 2 col 1: Explorar ── */}
        <div style={{ paddingBottom: isMobile ? '32px' : PB }}>
          <p style={{
            fontSize: '13px', fontFamily: LABEL, fontWeight: 500,
            color: '#0057FF', letterSpacing: '0.14em',
            textTransform: 'uppercase', margin: '0 0 16px',
          }}>Explorar</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} style={{
                  fontSize: 'clamp(20px, 2.2vw, 28px)',
                  fontFamily: DISPLAY, fontWeight: 300,
                  color: '#080D2B', textDecoration: 'none',
                  letterSpacing: '-0.01em', transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.35' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── ROW 2 col 2: Contáctanos ── */}
        <div style={{ paddingBottom: isMobile ? '32px' : PB }}>
          <p style={{
            fontSize: '13px', fontFamily: LABEL, fontWeight: 500,
            color: '#0057FF', letterSpacing: '0.14em',
            textTransform: 'uppercase', margin: '0 0 16px',
          }}>Contáctanos</p>
          <a href="mailto:giacomo.tomasoni@uai.cl" style={{
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            fontFamily: DISPLAY, fontWeight: 300,
            color: '#080D2B', textDecoration: 'none',
            letterSpacing: '-0.01em', transition: 'color 0.15s', display: 'inline',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#0057FF' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#080D2B' }}>
            giacomo.tomasoni@uai.cl
          </a>
        </div>

        {/* ── ROW 2 col 3: Logos + copyright ── */}
        <div style={{ paddingBottom: isMobile ? '32px' : PB, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ borderRadius: '10px', overflow: 'hidden', width: '100%', boxShadow: '0 2px 10px rgba(8,13,43,0.10)' }}>
            <Image src="/logos-uai-1.png" alt="Universidad Adolfo Ibáñez — Dirección de Innovación y Transferencia" width={680} height={210} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '100%', border: '1px solid rgba(8,13,43,0.08)', background: '#FFFFFF', padding: '10px 14px' }}>
            <Image src="/logos-uai-2.png" alt="DIT — Vinculación I+D por Encargo UAI" width={600} height={220} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <p style={{
            fontSize: 'clamp(13px, 1.2vw, 15px)',
            fontFamily: DISPLAY, fontWeight: 300,
            color: 'rgba(8,13,43,0.45)',
            letterSpacing: '-0.01em', lineHeight: 1.5,
            margin: '8px 0 0',
          }}>
            Blockchain Lab UAI<br />
            <span style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}>© 2026 Todos los derechos reservados.</span>
          </p>
        </div>

      </div>

      <div id="page-end" style={{ height: 0 }} />
    </footer>
  )
}
