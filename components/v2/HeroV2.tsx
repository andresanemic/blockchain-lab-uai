'use client'

import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

// ── Small blockchain concept cards for the infinite-scroll columns ──────────

type CardItem =
  | { kind: 'cert'; name: string; role: string; hash: string }
  | { kind: 'tx'; label: string; status: string; block: string }
  | { kind: 'pill'; text: string; mono?: boolean }
  | { kind: 'hash'; value: string; chain: string }
  | { kind: 'stat'; metric: string; value: string; up?: boolean }
  | { kind: 'code'; file: string; snippet: string }

const COL_A: CardItem[] = [
  { kind: 'cert', name: 'Francisco Toro', role: 'Smart Contracts · 2026', hash: '0x7f2a…e9d3' },
  { kind: 'pill', text: 'Inmutabilidad garantizada', mono: false },
  { kind: 'tx', label: 'Estado', status: 'Confirmada', block: '#18,442,301' },
  { kind: 'pill', text: 'SHA-256', mono: true },
  { kind: 'stat', metric: 'Disponibilidad', value: '99.9%', up: true },
  { kind: 'pill', text: 'Ethereum · Mainnet', mono: false },
  { kind: 'cert', name: 'Andrés Peña', role: 'Blockchain Dev · 2026', hash: '0x3c9e…1f7a' },
  { kind: 'pill', text: 'Trazabilidad verificable', mono: false },
]

const COL_B: CardItem[] = [
  { kind: 'pill', text: 'Confianza Digital', mono: false },
  { kind: 'hash', value: '0x1a2b3c4d5e6f7a8b', chain: 'Ethereum' },
  { kind: 'pill', text: 'Validez Judicial', mono: false },
  { kind: 'stat', metric: 'Transacciones', value: '1.2k', up: true },
  { kind: 'code', file: 'Cert.sol', snippet: 'function issue(\n  address to,\n  bytes32 h\n) onlyAdmin {}' },
  { kind: 'pill', text: 'Descentralización', mono: false },
  { kind: 'pill', text: 'Cardano Foundation', mono: false },
  { kind: 'stat', metric: 'Nodos activos', value: '12', up: false },
]

const CARD_STYLE: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '14px',
  padding: '14px 16px',
  backdropFilter: 'blur(16px)',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
}

function Card({ item }: { item: CardItem }) {
  const MONO = 'var(--font-jetbrains-mono, monospace)'
  const BODY = 'var(--font-inter)'

  if (item.kind === 'cert') return (
    <div style={CARD_STYLE}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(248,248,244,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Certificado · Verificado</span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#F8F8F4', marginBottom: '2px', fontFamily: BODY }}>{item.name}</p>
      <p style={{ fontSize: '10px', color: 'rgba(248,248,244,0.3)', marginBottom: '10px', fontFamily: BODY }}>{item.role}</p>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(0,87,255,0.8)', background: 'rgba(0,87,255,0.08)', padding: '5px 8px', borderRadius: '5px' }}>{item.hash} · UAI</p>
    </div>
  )

  if (item.kind === 'tx') return (
    <div style={CARD_STYLE}>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(248,248,244,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Última tx</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.3)', fontFamily: BODY }}>{item.label}</span>
        <span style={{ fontSize: '10px', color: '#22c55e', fontFamily: MONO }}>{item.status}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.3)', fontFamily: BODY }}>Bloque</span>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.55)', fontFamily: MONO }}>{item.block}</span>
      </div>
    </div>
  )

  if (item.kind === 'pill') return (
    <div style={{ ...CARD_STYLE, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px' }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0057FF', flexShrink: 0 }} />
      <span style={{
        fontSize: item.mono ? '11px' : '13px',
        fontFamily: item.mono ? MONO : BODY,
        color: item.mono ? 'rgba(0,87,255,0.8)' : 'rgba(248,248,244,0.72)',
        fontWeight: 500,
        letterSpacing: item.mono ? '0.04em' : 0,
      }}>{item.text}</span>
    </div>
  )

  if (item.kind === 'hash') return (
    <div style={{ ...CARD_STYLE, border: '1px solid rgba(0,87,255,0.14)' }}>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(248,248,244,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Block Hash</p>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(0,87,255,0.75)', lineHeight: 1.7, wordBreak: 'break-all', marginBottom: '8px' }}>{item.value}</p>
      <span style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(248,248,244,0.25)' }}>{item.chain}</span>
    </div>
  )

  if (item.kind === 'stat') return (
    <div style={CARD_STYLE}>
      <p style={{ fontSize: '10px', fontFamily: 'var(--font-inter)', color: 'rgba(248,248,244,0.3)', marginBottom: '6px' }}>{item.metric}</p>
      <p style={{ fontSize: '26px', fontFamily: 'var(--font-lato)', fontWeight: 700, color: item.up ? '#22c55e' : '#F8F8F4', lineHeight: 1 }}>{item.value}</p>
    </div>
  )

  if (item.kind === 'code') return (
    <div style={{ ...CARD_STYLE, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#0057FF' }} />
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono, monospace)', color: 'rgba(248,248,244,0.25)' }}>{item.file}</span>
      </div>
      <pre style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono, monospace)', color: 'rgba(248,248,244,0.42)', margin: 0, lineHeight: 1.8, background: 'none', whiteSpace: 'pre' }}>{item.snippet}</pre>
    </div>
  )

  return null
}

// Duplicated list for seamless CSS loop
function InfiniteColumn({ items, direction }: { items: CardItem[]; direction: 'up' | 'down' }) {
  const doubled = [...items, ...items]
  const animName = direction === 'up' ? 'heroScrollUp' : 'heroScrollDown'
  const dur = direction === 'up' ? '22s' : '26s'

  return (
    <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
      {/* Top fade */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, #080D2B, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      {/* Bottom fade */}
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #080D2B, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        animation: `${animName} ${dur} linear infinite`,
      }}>
        {doubled.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function HeroV2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (textRef.current) {
      gsap.from(Array.from(textRef.current.children), {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.13,
        delay: 0.2,
      })
    }
    if (colsRef.current) {
      gsap.from(colsRef.current, {
        opacity: 0,
        x: 40,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      })
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="inicio"
      style={{
        position: 'relative',
        background: '#080D2B',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes heroScrollUp {
          from { transform: translateY(0) }
          to   { transform: translateY(-50%) }
        }
        @keyframes heroScrollDown {
          from { transform: translateY(-50%) }
          to   { transform: translateY(0) }
        }
      `}</style>

      {/* Subtle grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(248,248,244,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(248,248,244,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Blue glow — bottom-left */}
      <div aria-hidden style={{
        position: 'absolute',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(0,87,255,0.12) 0%, transparent 65%)',
        bottom: '-15%', left: '-8%',
        filter: 'blur(48px)',
        pointerEvents: 'none',
      }} />

      {/* ── Main grid: left text | right columns ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 72px)',
        gap: 'clamp(40px, 5vw, 80px)',
        alignItems: 'center',
      }}>

        {/* LEFT — text */}
        <div
          ref={textRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 'clamp(100px, 14vh, 140px) 0 clamp(80px, 10vh, 100px)',
          }}
        >
          <p style={{
            fontSize: '12px',
            fontFamily: 'var(--font-oswald)',
            fontWeight: 500,
            color: '#0057FF',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}>
            Blockchain Lab UAI
          </p>

          <h1 style={{
            fontFamily: 'var(--font-lato)',
            fontWeight: 300,
            fontSize: 'clamp(44px, 5.8vw, 88px)',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: '#F8F8F4',
            marginBottom: '32px',
          }}>
            <span style={{ display: 'block' }}>Innovación</span>
            <span style={{ display: 'block' }}>Económica</span>
            <span style={{ display: 'block' }}>y Relaciones</span>
            <span style={{ display: 'block', color: '#0057FF' }}>Descentralizadas.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            fontFamily: 'var(--font-inter)',
            color: 'rgba(248,248,244,0.40)',
            lineHeight: 1.75,
            maxWidth: '420px',
            marginBottom: '48px',
          }}>
            Transformamos desafíos reales en soluciones blockchain para organizaciones públicas y privadas.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="#areas"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px',
                background: '#0057FF',
                color: '#F8F8F4',
                fontSize: '14px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A40A1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Explorar áreas →
            </a>
            <a
              href="#contacto"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '14px 36px',
                border: '1px solid rgba(248,248,244,0.13)',
                color: 'rgba(248,248,244,0.50)',
                fontSize: '14px',
                fontFamily: 'var(--font-lato)',
                letterSpacing: '-0.01em',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,248,244,0.32)'; e.currentTarget.style.color = '#F8F8F4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,248,244,0.13)'; e.currentTarget.style.color = 'rgba(248,248,244,0.50)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Colaborar
            </a>
          </div>

          <div style={{ marginTop: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '1px', background: 'rgba(248,248,244,0.18)' }} />
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.18)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Universidad Adolfo Ibáñez</span>
          </div>
        </div>

        {/* RIGHT — two infinite-scroll columns */}
        <div
          ref={colsRef}
          style={{
            display: 'flex',
            gap: '10px',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
            paddingTop: '32px',
          }}
        >
          <InfiniteColumn items={COL_A} direction="up" />
          <InfiniteColumn items={COL_B} direction="down" />
        </div>
      </div>

      {/* Fade to next section */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '80px',
        background: 'linear-gradient(to bottom, transparent, #F8F8F4)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
