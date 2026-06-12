'use client'

import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useIsMobile } from '@/lib/useIsMobile'

const CARD: CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(8,13,43,0.09)',
  borderRadius: '10px',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
}
const MONO = 'var(--font-jetbrains-mono, monospace)'
const BODY = 'var(--font-inter)'

// ── Column card types ───────────────────────────────────────────────────────
type Item =
  | { k: 'cert';  num: string; name: string; role: string; hash: string; tags: string[] }
  | { k: 'tx';    status: string; block: string }
  | { k: 'pill';  text: string; blue?: boolean; color?: string }
  | { k: 'stat';  label: string; value: string; green?: boolean }
  | { k: 'hash';  value: string }
  | { k: 'code';  snippet: string }

const COL_A: Item[] = [
  { k: 'pill', text: 'Trazabilidad verificable' },
  { k: 'cert', num: '01', name: 'Francisco Toro', role: 'Smart Contracts · 2026', hash: '0x7f2a…e9d3', tags: [] },
  { k: 'pill', text: 'Inmutabilidad garantizada' },
  { k: 'tx',   status: 'Confirmada', block: '#18,442,301' },
  { k: 'pill', text: 'SHA-256', blue: true },
  { k: 'stat', label: 'Disponibilidad', value: '99.9%', green: true },
  { k: 'pill', text: 'Ethereum · Mainnet' },
  { k: 'cert', num: '02', name: 'Andrés Peña', role: 'Blockchain Dev · 2026', hash: '0x3c9e…1f7a', tags: [] },
]
const COL_B: Item[] = [
  { k: 'stat', label: 'Transacciones', value: '1.2k' },
  { k: 'code', snippet: 'function issue(\n  address to,\n  bytes32 h\n) onlyAdmin {}' },
  { k: 'pill', text: 'Avalanche', color: '#E52222' },
  { k: 'stat', label: 'Nodos activos', value: '12' },
  { k: 'pill', text: 'RUC-D', color: '#16a34a' },
  { k: 'pill', text: 'Confianza Digital' },
  { k: 'hash', value: '0x1a2b3c4d5e6f7a8b9c0d' },
  { k: 'pill', text: 'Validez Judicial' },
]

function InfiniteColumn({ items, dir }: { items: Item[]; dir: 'up' | 'down' }) {
  const doubled = [...items, ...items]
  const anim = dir === 'up' ? 'heroScrollUp' : 'heroScrollDown'
  const dur  = dir === 'up' ? '28s' : '36s'
  const fade = 'rgba(247,248,250,0)'
  const bg   = '#F7F8FA'

  return (
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '48px', background: `linear-gradient(to bottom, ${bg}, ${fade})`, zIndex: 2, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px', background: `linear-gradient(to top, ${bg}, ${fade})`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', animation: `${anim} ${dur} linear infinite` }}>
        {doubled.map((item, i) => <Card key={i} item={item} />)}
      </div>
    </div>
  )
}

function Card({ item }: { item: Item }) {
  if (item.k === 'cert') return (
    <div style={{ ...CARD, padding: '12px 13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
        <span style={{ fontSize: '8px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Certificado · Verificado
        </span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#080D2B', fontFamily: BODY, lineHeight: 1.2 }}>{item.name}</p>
      <p style={{ fontSize: '10px', color: 'rgba(8,13,43,0.45)', fontFamily: BODY, marginTop: '2px', marginBottom: '10px' }}>{item.role}</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,87,255,0.08)', borderRadius: '6px', padding: '4px 8px' }}>
        <span style={{ fontSize: '9px', fontFamily: MONO, fontWeight: 700, color: '#0057FF' }}>{item.hash} · UAI</span>
      </div>
    </div>
  )
  if (item.k === 'tx') return (
    <div style={{ ...CARD, padding: '12px 13px' }}>
      <p style={{ fontSize: '8px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Última tx</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.4)', fontFamily: BODY }}>Estado</span>
        <span style={{ fontSize: '10px', color: '#16a34a', fontFamily: MONO, fontWeight: 700 }}>{item.status}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.4)', fontFamily: BODY }}>Bloque</span>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.6)', fontFamily: MONO, fontWeight: 700 }}>{item.block}</span>
      </div>
    </div>
  )
  if (item.k === 'pill') return (
    <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 13px' }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.blue ? '#0057FF' : (item.color ?? '#1A40A1'), flexShrink: 0 }} />
      <span style={{ fontSize: '12px', fontFamily: BODY, color: item.blue ? '#0057FF' : (item.color ?? '#080D2B'), fontWeight: 500 }}>{item.text}</span>
    </div>
  )
  if (item.k === 'stat') return (
    <div style={{ ...CARD, padding: '12px 13px' }}>
      <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.40)', marginBottom: '5px' }}>{item.label}</p>
      <p style={{ fontSize: '28px', fontFamily: 'var(--font-lato)', fontWeight: 700, color: item.green ? '#16a34a' : '#0057FF', lineHeight: 1 }}>{item.value}</p>
    </div>
  )
  if (item.k === 'hash') return (
    <div style={{ ...CARD, padding: '12px 13px', border: '1px solid rgba(0,87,255,0.14)' }}>
      <p style={{ fontSize: '8px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>Block Hash</p>
      <p style={{ fontSize: '9px', fontFamily: MONO, fontWeight: 700, color: '#0057FF', lineHeight: 1.75, wordBreak: 'break-all' }}>{item.value}</p>
    </div>
  )
  if (item.k === 'code') return (
    <div style={{ ...CARD, padding: '12px 13px', border: '1px solid rgba(0,87,255,0.09)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#0057FF' }} />
        <span style={{ fontSize: '8px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.35)' }}>Cert.sol</span>
      </div>
      <pre style={{ fontSize: '9px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.48)', margin: 0, lineHeight: 1.85, background: 'none', whiteSpace: 'pre' }}>{item.snippet}</pre>
    </div>
  )
  return null
}

export default function HeroV2() {
  const sectionRef   = useRef<HTMLElement>(null)
  const textRef      = useRef<HTMLDivElement>(null)
  const colsRef      = useRef<HTMLDivElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const gridGlowRef  = useRef<HTMLDivElement>(null)
  const scrollBtnRef = useRef<HTMLDivElement>(null)
  const [aHover, setAHover] = useState(false)
  const [bHover, setBHover] = useState(false)
  const isMobile = useIsMobile()

  const handleColaborar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation() // Prevent LenisProvider's global anchor listener from firing a parallel smooth scroll

    // Create overlay directly on body — guaranteed on top, no ref/React dependency
    const overlay = document.createElement('div')
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:#FFFFFF',
      'z-index:9999', 'opacity:0', 'pointer-events:auto',
    ].join(';')
    document.body.appendChild(overlay)

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.40,
      ease: 'power2.inOut',
      onComplete: () => {
        const lenis = (window as any).__lenis
        const target = document.getElementById('contacto')
        if (target) {
          if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
          else target.scrollIntoView({ behavior: 'auto' })
        }
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
          delay: 0.05,
          onComplete: () => document.body.removeChild(overlay),
        })
      },
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mask = `radial-gradient(circle 400px at ${x}px ${y}px, black 0%, black 30%, transparent 70%)`
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle 400px at ${x}px ${y}px, rgba(0,87,255,0.0015) 0%, rgba(0,87,255,0.00045) 50%, transparent 75%)`
    }
    if (gridGlowRef.current) {
      gridGlowRef.current.style.maskImage = mask
      gridGlowRef.current.style.setProperty('-webkit-mask-image', mask)
    }
  }

  useGSAP(() => {
    const lines = sectionRef.current?.querySelectorAll('.hero-line')
    if (lines?.length) {
      gsap.fromTo(lines,
        { y: '108%' },
        { y: '0%', duration: 1.15, ease: 'expo.out', stagger: 0.10, delay: 0.25 }
      )
    }

    const sub = sectionRef.current?.querySelectorAll('.hero-sub')
    if (sub?.length) {
      gsap.fromTo(sub,
        { y: 28, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.10, delay: 0.65 }
      )
    }

    if (colsRef.current) {
      gsap.fromTo(colsRef.current,
        { opacity: 0, x: 60, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.4 }
      )
    }

    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    exitTl
      .to(textRef.current, { y: '-18vh', opacity: 0.15, ease: 'none' }, 0)
      .to(colsRef.current, { y: '-9vh',  ease: 'none' }, 0)

    // Scroll button: desktop only — fade out as hero scrolls away
    if (!isMobile && scrollBtnRef.current) {
      gsap.fromTo(scrollBtnRef.current,
        { opacity: 1, pointerEvents: 'auto' },
        {
          opacity: 0, pointerEvents: 'none', ease: 'power2.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom 90%',
            end: 'bottom 40%',
            scrub: 0.4,
          },
        }
      )
    }

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="grain"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Grid lines — main 88px + subdivision 22px */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(8,13,43,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(8,13,43,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
        backgroundAttachment: 'fixed',
      }} />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      />

      {/* Colored grid revealed by cursor — masked radial */}
      <div
        ref={gridGlowRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          backgroundImage: `
            linear-gradient(rgba(0,87,255,0.054) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,87,255,0.054) 1px, transparent 1px),
            linear-gradient(rgba(0,87,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,87,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
          backgroundAttachment: 'fixed',
          maskImage: 'none',
        }}
      />

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
        width: '100%',
        padding: isMobile ? '0 24px' : '0 clamp(120px, 15vw, 220px)',
        gap: isMobile ? '0' : 'clamp(36px, 4vw, 64px)',
        alignItems: 'center',
        position: 'relative', zIndex: 3,
      }}>

        {/* LEFT — text */}
        <div
          ref={textRef}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            padding: isMobile
              ? 'clamp(100px, 16vh, 140px) 0 clamp(48px, 6vh, 64px)'
              : 'clamp(88px, 12vh, 128px) 0 clamp(64px, 8vh, 96px)',
          }}
        >
          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-lato)',
            fontWeight: 300,
            fontSize: isMobile ? 'clamp(40px, 10vw, 56px)' : 'clamp(36px, 4.2vw, 68px)',
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: '#080D2B',
            marginBottom: '40px',
          }}>
            <span className="line-wrap">
              <span className="hero-line line-inner">Un laboratorio</span>
            </span>
            <span className="line-wrap">
              <span className="hero-line line-inner">para la <span style={{ color: '#0057FF' }}>confianza</span></span>
            </span>
            <span className="line-wrap">
              <span className="hero-line line-inner">digital.</span>
            </span>
          </h1>

          {/* Body */}
          <p className="hero-sub" style={{
            fontSize: '11px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.42)',
            lineHeight: 1.9, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '52px', opacity: 0,
            wordBreak: 'break-word', maxWidth: '100%',
          }}>
            Transformamos desafíos reales en soluciones blockchain para organizaciones públicas y privadas de Chile.
          </p>

          {/* CTAs */}
          <div className="hero-sub" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '64px', opacity: 0 }}>

            {/* Primary — dark navy glass matching navbar */}
            <a
              href="#blockchain"
              onMouseEnter={() => setAHover(true)}
              onMouseLeave={() => setAHover(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '11px 20px',
                background: aHover ? 'rgba(8,13,43,0.90)' : 'rgba(8,13,43,0.78)',
                color: 'rgba(248,248,244,0.92)',
                fontSize: '11px', fontFamily: MONO, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderRadius: '12px', textDecoration: 'none',
                border: aHover ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(36px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(36px) saturate(1.4)',
                boxShadow: aHover
                  ? '0 1px 0 rgba(255,255,255,0.07) inset, 0 0 0 4px rgba(8,13,43,0.08), 0 8px 32px rgba(8,13,43,0.32), 0 24px 48px rgba(8,13,43,0.16)'
                  : '0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 16px rgba(8,13,43,0.22), 0 12px 32px rgba(8,13,43,0.14)',
                transform: aHover ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.30s cubic-bezier(0.16,1,0.3,1), box-shadow 0.30s cubic-bezier(0.16,1,0.3,1), background 0.20s, border-color 0.20s',
              }}
            >
              ¿Qué es blockchain?
              <svg
                width="11" height="11" viewBox="0 0 12 12" fill="none"
                style={{
                  transform: aHover ? 'translate(2px,-2px)' : 'translate(0,0)',
                  transition: 'transform 0.30s cubic-bezier(0.16,1,0.3,1)',
                  opacity: 0.60,
                  pointerEvents: 'none',
                }}
              >
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Secondary — mismo tratamiento opaco que Explorar áreas */}
            <a
              href="#contacto"
              onClick={handleColaborar}
              onMouseEnter={() => setBHover(true)}
              onMouseLeave={() => setBHover(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '11px 20px',
                background: '#FFFFFF',
                color: bHover ? 'rgba(8,13,43,0.88)' : 'rgba(8,13,43,0.55)',
                fontSize: '11px', fontFamily: MONO, fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderRadius: '12px', textDecoration: 'none',
                border: bHover ? '1px solid rgba(8,13,43,0.28)' : '1px solid rgba(8,13,43,0.14)',
                boxShadow: bHover
                  ? '0 6px 20px rgba(8,13,43,0.10), 0 16px 36px rgba(8,13,43,0.07)'
                  : '0 2px 8px rgba(8,13,43,0.06), 0 8px 20px rgba(8,13,43,0.04)',
                transform: bHover ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.30s cubic-bezier(0.16,1,0.3,1), box-shadow 0.30s cubic-bezier(0.16,1,0.3,1), background 0.20s, border-color 0.20s',
              }}
            >
              Colaborar
            </a>
          </div>

        </div>

        {/* RIGHT — 2-column widget grid (hidden on mobile) */}
        <div style={{ display: isMobile ? 'none' : undefined, padding: 'clamp(88px, 12vh, 128px) 0 clamp(64px, 8vh, 96px)' }}>
          <div
            ref={colsRef}
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(8,13,43,0.10)',
              background: '#F7F8FA',
              opacity: 0,
              boxShadow: '0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.16), 0 40px 80px rgba(8,13,43,0.12), 0 0 0 1px rgba(8,13,43,0.06)',
              display: 'flex',
              flexDirection: 'column',
              height: 'clamp(480px, 58vh, 620px)',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '16px 18px 10px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 5px rgba(22,163,74,0.6)' }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: '9px', fontWeight: 700, color: 'rgba(8,13,43,0.28)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Live · Blockchain
              </span>
            </div>

            {/* ── 2-column infinite scroll ── */}
            <div style={{ display: 'flex', flex: 1, gap: '7px', padding: '0 12px 14px', overflow: 'hidden' }}>
              <InfiniteColumn items={COL_A} dir="up" />
              <InfiniteColumn items={COL_B} dir="down" />
            </div>
          </div>
        </div>

      </div>

      {/* Scroll-down button — desktop only */}
      {!isMobile && (
        <div ref={scrollBtnRef} style={{ position: 'fixed', bottom: '32px', right: '36px', zIndex: 200 }}>
          <button
            onClick={() => {
              const lenis = (window as any).__lenis
              if (lenis) lenis.scrollTo(window.scrollY + window.innerHeight, { duration: 2.2 })
              else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '44px', height: '44px',
              background: 'rgba(8,13,43,0.42)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(248,248,244,0.07)',
              borderRadius: '12px',
              color: 'rgba(248,248,244,0.35)',
              animation: 'scrollBounce 3s ease-in-out infinite',
              cursor: 'pointer',
            }}
            aria-label="Scroll hacia abajo"
          >
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none" style={{ pointerEvents: 'none' }}>
              <path d="M6.5 2.5v7M6.5 9.5l-3-3M6.5 9.5l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

    </section>
  )
}
