'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

// Blockchain artifact cards — designed for dark navy (#080D2B) background
function CertCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '16px',
      padding: '18px 20px',
      backdropFilter: 'blur(20px)',
      width: '252px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Certificado · Verificado
        </span>
      </div>
      <p style={{ fontSize: '15px', fontWeight: 500, color: '#F8F8F4', marginBottom: '2px', lineHeight: 1.3 }}>Francisco Toro</p>
      <p style={{ fontSize: '11px', color: 'rgba(248,248,244,0.32)', marginBottom: '12px', lineHeight: 1.5 }}>DeFi & Smart Contracts · 2026</p>
      <div style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: '#0057FF', background: 'rgba(0,87,255,0.10)', padding: '6px 10px', borderRadius: '6px', letterSpacing: '0.04em' }}>
        0x7f2a4b8c…e9d3 · UAI
      </div>
    </div>
  )
}

function TxCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '16px 18px',
      backdropFilter: 'blur(20px)',
      width: '222px',
      boxShadow: '0 20px 56px rgba(0,0,0,0.35)',
    }}>
      <p style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Última transacción
      </p>
      <p style={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(0,87,255,0.9)', marginBottom: '8px', lineHeight: 1.6 }}>
        0xA3f1…2b8E
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.3)' }}>Estado</span>
        <span style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'var(--font-jetbrains-mono)' }}>Confirmada</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.3)' }}>Bloque</span>
        <span style={{ fontSize: '10px', color: 'rgba(248,248,244,0.65)', fontFamily: 'var(--font-jetbrains-mono)' }}>#18,442,301</span>
      </div>
    </div>
  )
}

function ContractCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '16px 18px',
      backdropFilter: 'blur(20px)',
      width: '236px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: '#0057FF', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.3)', letterSpacing: '0.08em' }}>
          Certifications.sol
        </span>
      </div>
      <pre style={{
        fontSize: '9.5px',
        fontFamily: 'var(--font-jetbrains-mono)',
        color: 'rgba(248,248,244,0.48)',
        margin: 0,
        lineHeight: 1.85,
        background: 'none',
        whiteSpace: 'pre',
      }}>{`contract Cert {
  mapping(address
   => bytes32) hash;

  function issue(
    address to,
    bytes32 h
  ) onlyAdmin {
    hash[to] = h;
  }
}`}</pre>
    </div>
  )
}

function StatsCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '16px 18px',
      backdropFilter: 'blur(20px)',
      width: '196px',
      boxShadow: '0 14px 40px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
        Red activa
      </p>
      {[
        { label: 'Nodos', val: '12' },
        { label: 'Transacciones', val: '1.2k' },
        { label: 'Disponibilidad', val: '99.9%' },
      ].map(({ label, val }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(248,248,244,0.32)' }}>{label}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F8F8F4', fontFamily: 'var(--font-jetbrains-mono)' }}>{val}</span>
        </div>
      ))}
    </div>
  )
}

function HashCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(0,87,255,0.18)',
      borderRadius: '16px',
      padding: '14px 16px',
      backdropFilter: 'blur(20px)',
      width: '210px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Block Hash
      </p>
      <p style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(0,87,255,0.85)', lineHeight: 1.75, wordBreak: 'break-all', marginBottom: '10px' }}>
        0x1a2b3c4d5e6f7a8b<br />9c0d1e2f3a4b5c6d
      </p>
      <div style={{ height: '1px', background: 'rgba(0,87,255,0.18)', marginBottom: '10px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '9px', color: 'rgba(248,248,244,0.28)', fontFamily: 'var(--font-jetbrains-mono)' }}>Ethereum</span>
        <span style={{ fontSize: '9px', color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-jetbrains-mono)' }}>UAI · 2026</span>
      </div>
    </div>
  )
}

export default function HeroV2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const c1 = useRef<HTMLDivElement>(null)
  const c2 = useRef<HTMLDivElement>(null)
  const c3 = useRef<HTMLDivElement>(null)
  const c4 = useRef<HTMLDivElement>(null)
  const c5 = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = [c1.current, c2.current, c3.current, c4.current, c5.current].filter(Boolean)

    gsap.from(cards, {
      scale: 0.7,
      opacity: 0,
      y: () => gsap.utils.random(-80, 80) as number,
      x: () => gsap.utils.random(-50, 50) as number,
      duration: 1.4,
      ease: 'power3.out',
      stagger: { amount: 0.7, from: 'random' },
    })

    if (textRef.current) {
      gsap.from(Array.from(textRef.current.children), {
        y: 44,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.4,
      })
    }

    cards.forEach((card, i) => {
      gsap.to(card, {
        y: '+=14',
        duration: 3.4 + i * 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.75,
      })
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#080D2B',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle grid overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(248,248,244,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(248,248,244,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '96px 96px',
      }} />

      {/* Blue radial accent */}
      <div aria-hidden style={{
        position: 'absolute',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(0,87,255,0.10) 0%, transparent 68%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* ── Scattered cards (desktop only) ── */}
      <div ref={c1} className="hidden lg:block" style={{ position: 'absolute', top: '9%', left: '3%', transform: 'rotate(-7deg)', zIndex: 4 }}>
        <CertCard />
      </div>
      <div ref={c2} className="hidden lg:block" style={{ position: 'absolute', top: '6%', right: '4%', transform: 'rotate(5deg)', zIndex: 4 }}>
        <TxCard />
      </div>
      <div ref={c3} className="hidden xl:block" style={{ position: 'absolute', top: '44%', left: '-1%', transform: 'rotate(6deg)', zIndex: 3 }}>
        <ContractCard />
      </div>
      <div ref={c4} className="hidden lg:block" style={{ position: 'absolute', bottom: '11%', right: '5%', transform: 'rotate(-4deg)', zIndex: 4 }}>
        <StatsCard />
      </div>
      <div ref={c5} className="hidden xl:block" style={{ position: 'absolute', bottom: '8%', left: '24%', transform: 'rotate(4deg)', zIndex: 3 }}>
        <HashCard />
      </div>

      {/* ── Centered text ── */}
      <div
        ref={textRef}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          padding: 'clamp(100px, 15vh, 140px) clamp(24px, 5vw, 64px) clamp(80px, 12vh, 100px)',
          maxWidth: '860px',
          width: '100%',
        }}
      >
        <p style={{
          fontSize: '13px',
          fontFamily: 'var(--font-oswald, var(--font-inter))',
          fontWeight: 500,
          color: 'rgba(0,87,255,0.75)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>
          Blockchain Lab UAI
        </p>

        <h1 style={{
          fontFamily: 'var(--font-lato, var(--font-inter))',
          fontWeight: 300,
          fontSize: 'clamp(42px, 7.5vw, 96px)',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: '#F8F8F4',
          marginBottom: '30px',
        }}>
          <span style={{ display: 'block' }}>Innovación Económica</span>
          <span style={{ display: 'block' }}>y Relaciones</span>
          <span style={{ display: 'block', color: '#0057FF' }}>Descentralizadas.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 1.7vw, 19px)',
          fontFamily: 'var(--font-inter)',
          fontWeight: 400,
          color: 'rgba(248,248,244,0.42)',
          lineHeight: 1.7,
          maxWidth: '500px',
          marginBottom: '44px',
        }}>
          Transformando confianza, transparencia y nuevos modelos de
          colaboración mediante tecnologías descentralizadas.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#areas"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 34px',
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
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 34px',
              border: '1px solid rgba(248,248,244,0.15)',
              color: 'rgba(248,248,244,0.55)',
              fontSize: '14px',
              fontFamily: 'var(--font-lato)',
              letterSpacing: '-0.01em',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,248,244,0.35)'; e.currentTarget.style.color = '#F8F8F4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,248,244,0.15)'; e.currentTarget.style.color = 'rgba(248,248,244,0.55)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Colaborar
          </a>
        </div>

        <div style={{ marginTop: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(248,248,244,0.18)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(248,248,244,0.18), transparent)' }} />
        </div>
      </div>

      {/* Fade to next section */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '100px',
        background: 'linear-gradient(to bottom, transparent, #F8F8F4)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
