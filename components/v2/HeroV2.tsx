'use client'

import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

// ── Brochure card styles ────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(8,13,43,0.13)',
  borderRadius: '16px',
  padding: '16px 18px',
  boxShadow: '0 4px 24px rgba(8,13,43,0.07)',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
}
const MONO = 'var(--font-jetbrains-mono, monospace)'
const BODY = 'var(--font-inter)'
const LABEL_F = 'var(--font-oswald)'

// ── Column card types ───────────────────────────────────────────────────────
type Item =
  | { k: 'cert';  name: string; role: string; hash: string }
  | { k: 'tx';    status: string; block: string }
  | { k: 'pill';  text: string; blue?: boolean }
  | { k: 'stat';  label: string; value: string; green?: boolean }
  | { k: 'hash';  value: string }
  | { k: 'code';  snippet: string }

const COL_A: Item[] = [
  { k: 'cert', name: 'Francisco Toro', role: 'Smart Contracts · 2026', hash: '0x7f2a…e9d3' },
  { k: 'pill', text: 'Inmutabilidad garantizada' },
  { k: 'tx',   status: 'Confirmada', block: '#18,442,301' },
  { k: 'pill', text: 'SHA-256', blue: true },
  { k: 'stat', label: 'Disponibilidad', value: '99.9%', green: true },
  { k: 'pill', text: 'Ethereum · Mainnet' },
  { k: 'cert', name: 'Andrés Peña', role: 'Blockchain Dev · 2026', hash: '0x3c9e…1f7a' },
  { k: 'pill', text: 'Trazabilidad verificable' },
]
const COL_B: Item[] = [
  { k: 'pill', text: 'Confianza Digital' },
  { k: 'hash', value: '0x1a2b3c4d5e6f7a8b9c0d' },
  { k: 'pill', text: 'Validez Judicial' },
  { k: 'stat', label: 'Transacciones', value: '1.2k' },
  { k: 'code', snippet: 'function issue(\n  address to,\n  bytes32 h\n) onlyAdmin {}' },
  { k: 'pill', text: 'Cardano Foundation' },
  { k: 'stat', label: 'Nodos activos', value: '12' },
  { k: 'pill', text: 'Descentralización', blue: true },
]

function Card({ item }: { item: Item }) {
  if (item.k === 'cert') return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(8,13,43,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Certificado · Verificado</span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#080D2B', marginBottom: '2px', fontFamily: BODY }}>{item.name}</p>
      <p style={{ fontSize: '10px', color: 'rgba(8,13,43,0.42)', marginBottom: '10px', fontFamily: BODY }}>{item.role}</p>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: '#0057FF', background: 'rgba(0,87,255,0.06)', padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(0,87,255,0.12)' }}>{item.hash} · UAI</p>
    </div>
  )
  if (item.k === 'tx') return (
    <div style={CARD}>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(8,13,43,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Última tx</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.4)', fontFamily: BODY }}>Estado</span>
        <span style={{ fontSize: '10px', color: '#16a34a', fontFamily: MONO, fontWeight: 600 }}>{item.status}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.4)', fontFamily: BODY }}>Bloque</span>
        <span style={{ fontSize: '10px', color: 'rgba(8,13,43,0.6)', fontFamily: MONO }}>{item.block}</span>
      </div>
    </div>
  )
  if (item.k === 'pill') return (
    <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px' }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.blue ? '#0057FF' : '#1A40A1', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', fontFamily: BODY, color: item.blue ? '#0057FF' : '#080D2B', fontWeight: 500 }}>{item.text}</span>
    </div>
  )
  if (item.k === 'stat') return (
    <div style={CARD}>
      <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.42)', marginBottom: '5px' }}>{item.label}</p>
      <p style={{ fontSize: '28px', fontFamily: 'var(--font-lato)', fontWeight: 700, color: item.green ? '#16a34a' : '#0057FF', lineHeight: 1 }}>{item.value}</p>
    </div>
  )
  if (item.k === 'hash') return (
    <div style={{ ...CARD, border: '1px solid rgba(0,87,255,0.15)' }}>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(8,13,43,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Block Hash</p>
      <p style={{ fontSize: '9px', fontFamily: MONO, color: '#0057FF', lineHeight: 1.75, wordBreak: 'break-all' }}>{item.value}</p>
    </div>
  )
  if (item.k === 'code') return (
    <div style={{ ...CARD, border: '1px solid rgba(0,87,255,0.10)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#0057FF' }} />
        <span style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(8,13,43,0.3)' }}>Cert.sol</span>
      </div>
      <pre style={{ fontSize: '9px', fontFamily: MONO, color: 'rgba(8,13,43,0.5)', margin: 0, lineHeight: 1.85, background: 'none', whiteSpace: 'pre' }}>{item.snippet}</pre>
    </div>
  )
  return null
}

function InfiniteColumn({ items, dir }: { items: Item[]; dir: 'up' | 'down' }) {
  const doubled = [...items, ...items]
  const anim = dir === 'up' ? 'heroScrollUp' : 'heroScrollDown'
  const dur  = dir === 'up' ? '24s' : '30s'

  return (
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '72px', background: 'linear-gradient(to bottom, #F8F8F4, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '72px', background: 'linear-gradient(to top, #F8F8F4, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: `${anim} ${dur} linear infinite` }}>
        {doubled.map((item, i) => <Card key={i} item={item} />)}
      </div>
    </div>
  )
}

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const colsRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (textRef.current) {
      gsap.from(textRef.current.children, {
        y: 56, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15,
      })
    }
    if (colsRef.current) {
      gsap.from(colsRef.current, {
        opacity: 0, x: 48, duration: 1.4, ease: 'power3.out', delay: 0.35,
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="grain"
      style={{
        position: 'relative',
        background: '#F8F8F4',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Brochure grid lines — vertical + horizontal (#C9D1DF) */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(201,209,223,0.55) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,209,223,0.55) 1px, transparent 1px)
        `,
        backgroundSize: '88px 88px',
      }} />

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 clamp(32px, 5vw, 80px)',
        gap: 'clamp(48px, 5vw, 88px)',
        alignItems: 'center',
        position: 'relative', zIndex: 3,
      }}>

        {/* LEFT — text */}
        <div
          ref={textRef}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            padding: 'clamp(112px, 16vh, 160px) 0 clamp(80px, 10vh, 120px)',
          }}
        >
          {/* Eyebrow */}
          <p style={{
            fontSize: '11px', fontFamily: LABEL_F, fontWeight: 500,
            color: '#0057FF', letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: '36px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#0057FF' }} />
            Blockchain Lab UAI
          </p>

          {/* Headline — Lato 300, very large */}
          <h1 style={{
            fontFamily: 'var(--font-lato)',
            fontWeight: 300,
            fontSize: 'clamp(52px, 6.2vw, 98px)',
            lineHeight: 0.97,
            letterSpacing: '-0.03em',
            color: '#080D2B',
            marginBottom: '36px',
          }}>
            <span style={{ display: 'block' }}>Innovación</span>
            <span style={{ display: 'block' }}>Económica</span>
            <span style={{ display: 'block' }}>y Relaciones</span>
            <span style={{ display: 'block', color: '#0057FF' }}>Descentralizadas.</span>
          </h1>

          {/* Body */}
          <p style={{
            fontSize: '16px', fontFamily: BODY, color: 'rgba(8,13,43,0.52)',
            lineHeight: 1.75, maxWidth: '400px', marginBottom: '52px',
          }}>
            Transformamos desafíos reales en soluciones blockchain para organizaciones públicas y privadas.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <a
              href="#areas"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px',
                background: '#080D2B',
                color: '#F8F8F4',
                fontSize: '13px', fontFamily: LABEL_F, fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'background 0.22s, transform 0.15s',
                border: '1px solid #080D2B',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.borderColor = '#0057FF'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#080D2B'; e.currentTarget.style.borderColor = '#080D2B'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Explorar áreas
            </a>
            <a
              href="#contacto"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px',
                background: 'transparent',
                color: '#080D2B',
                fontSize: '13px', fontFamily: LABEL_F, fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'border-color 0.22s, color 0.22s, transform 0.15s',
                border: '1px solid rgba(8,13,43,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#080D2B'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(8,13,43,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Colaborar
            </a>
          </div>

          {/* Concept pills — brochure cover style */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Confianza', 'Transparencia', 'Colaboración'].map(word => (
              <span key={word} style={{
                fontSize: '11px', fontFamily: LABEL_F, fontWeight: 500,
                color: '#1A40A1', letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '7px 14px',
                border: '1px solid #1A40A1',
                borderRadius: '100px',
                background: 'rgba(26,64,161,0.04)',
              }}>
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — infinite scroll columns inside a brochure-style frame */}
        <div style={{ padding: 'clamp(112px, 16vh, 160px) 0 clamp(80px, 10vh, 120px)' }}>
          <div
            ref={colsRef}
            style={{
              display: 'flex', gap: '10px',
              height: 'clamp(440px, 65vh, 680px)',
              overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid #080D2B',
              borderRadius: '24px',
              padding: '16px',
              boxShadow: '6px 6px 0px #080D2B',
              position: 'relative',
            }}
          >
            {/* Corner label */}
            <div style={{
              position: 'absolute', top: '14px', right: '14px', zIndex: 5,
              fontSize: '8px', fontFamily: MONO, color: 'rgba(8,13,43,0.3)',
              letterSpacing: '0.10em', textTransform: 'uppercase',
              background: 'rgba(8,13,43,0.04)', padding: '4px 8px', borderRadius: '4px',
            }}>
              Live · Blockchain
            </div>
            <InfiniteColumn items={COL_A} dir="up" />
            <InfiniteColumn items={COL_B} dir="down" />
          </div>

          {/* UAI label */}
          <p style={{
            marginTop: '16px', fontSize: '10px', fontFamily: MONO,
            color: 'rgba(8,13,43,0.28)', letterSpacing: '0.10em', textAlign: 'right',
          }}>
            Universidad Adolfo Ibáñez · Santiago
          </p>
        </div>

      </div>

      {/* Bottom divider — not a fade, a sharp border */}
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(8,13,43,0.10)' }} />
    </section>
  )
}
