'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

function scrambleText(el: HTMLElement, lines: string[], duration = 1400) {
  const chars = '!<>-_\\/[]{}=+*^?#ABCDEF0123456789'
  const full = lines.join('\n')
  let startTime: number | null = null
  function frame(ts: number) {
    if (!startTime) startTime = ts
    const progress = Math.min((ts - startTime) / duration, 1)
    const revealed = Math.floor(progress * full.length)
    let pos = 0
    el.innerHTML = lines
      .map((line, li) => {
        const mapped = line
          .split('')
          .map((char) => {
            const isRevealed = pos < revealed
            pos++
            if (char === ' ') return ' '
            if (isRevealed) return char
            return `<span style="color:rgba(59,91,219,0.3)">${chars[Math.floor(Math.random() * chars.length)]}</span>`
          })
          .join('')
        return li === 0
          ? `<span style="display:block">${mapped}</span>`
          : `<span style="display:block"><span style="color:#3B5BDB">${mapped.slice(0, 3)}</span>${mapped.slice(3)}</span>`
      })
      .join('')
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function CertCard() {
  return (
    <div
      style={{
        background: 'rgba(26,26,26,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '18px 20px',
        backdropFilter: 'blur(16px)',
        width: '264px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(242,240,237,0.4)', letterSpacing: '0.1em' }}>
          CERTIFICADO VERIFICADO
        </span>
      </div>
      <p style={{ fontSize: '14px', fontWeight: 500, color: '#f2f0ed', marginBottom: '3px', lineHeight: 1.3 }}>
        Francisco Toro
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(242,240,237,0.35)', marginBottom: '14px', lineHeight: 1.4 }}>
        DeFi & Smart Contracts · 2026
      </p>
      <div
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-jetbrains-mono)',
          color: '#3B5BDB',
          background: 'rgba(59,91,219,0.1)',
          padding: '7px 10px',
          borderRadius: '6px',
          letterSpacing: '0.04em',
        }}
      >
        0x7f2a4b8c…e9d3 · UAI
      </div>
    </div>
  )
}

function ContractCard() {
  return (
    <div
      style={{
        background: 'rgba(20,20,20,0.94)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '16px 18px',
        backdropFilter: 'blur(16px)',
        width: '228px',
        boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#3B5BDB', flexShrink: 0 }} />
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-jetbrains-mono)', color: 'rgba(242,240,237,0.3)', letterSpacing: '0.08em' }}>
          smart_contract.sol
        </span>
      </div>
      <pre
        style={{
          fontSize: '10.5px',
          fontFamily: 'var(--font-jetbrains-mono)',
          color: 'rgba(242,240,237,0.5)',
          margin: 0,
          lineHeight: 1.75,
          background: 'none',
          whiteSpace: 'pre',
        }}
      >{`contract Cert {
  mapping(address =>
    bytes32) public hash;

  function issue(
    address to,
    bytes32 _hash
  ) external onlyAdmin {
    hash[to] = _hash;
  }
}`}</pre>
    </div>
  )
}

function StatsCard() {
  return (
    <div
      style={{
        background: 'rgba(24,24,24,0.9)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '18px 20px',
        backdropFilter: 'blur(16px)',
        width: '210px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-jetbrains-mono)',
          color: 'rgba(242,240,237,0.3)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Red activa
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Nodos', val: '12' },
          { label: 'Transacciones', val: '1.2k' },
          { label: 'Disponibilidad', val: '99.9%' },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(242,240,237,0.38)', lineHeight: 1 }}>{label}</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#f2f0ed',
                fontFamily: 'var(--font-jetbrains-mono)',
                lineHeight: 1,
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeroV2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(Array.from(textRef.current!.children), {
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
      })

      tl.from(
        [card1Ref.current, card2Ref.current, card3Ref.current],
        { y: 72, opacity: 0, duration: 1.1, stagger: 0.18, ease: 'power2.out' },
        0.25
      )

      ;[card1Ref, card2Ref, card3Ref].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: '+=14',
          duration: 3.2 + i * 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.9,
        })
      })

      if (headlineRef.current) {
        setTimeout(() => scrambleText(headlineRef.current!, ['BLOCKCHAIN', 'LAB UAI'], 1400), 250)
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ background: '#131313', minHeight: '100svh', display: 'flex', alignItems: 'center' }}
    >
      {/* Grid overlay — Blueprint signature */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '88px 88px',
          pointerEvents: 'none',
        }}
      />

      {/* Blue orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(59,91,219,0.10) 0%, transparent 65%)',
          left: '-180px',
          top: '50%',
          transform: 'translateY(-50%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(96px, 14vh, 128px) clamp(20px, 4vw, 48px) clamp(80px, 12vh, 96px)',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0',
          position: 'relative',
          zIndex: 1,
        }}
        className="lg:grid-cols-2 lg:gap-16 lg:items-center"
      >
        {/* Text column */}
        <div ref={textRef} style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains-mono)',
              color: 'rgba(59,91,219,0.75)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            Universidad Adolfo Ibáñez
          </p>

          <h1
            ref={headlineRef}
            style={{
              fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
              fontWeight: 300,
              fontSize: 'clamp(56px, 8.5vw, 116px)',
              lineHeight: 0.94,
              letterSpacing: '-0.025em',
              color: '#f2f0ed',
              marginBottom: '32px',
            }}
          >
            <span style={{ display: 'block' }}>BLOCKCHAIN</span>
            <span style={{ display: 'block' }}>
              <span style={{ color: '#3B5BDB' }}>LAB</span> UAI
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 19px)',
              color: 'rgba(242,240,237,0.42)',
              lineHeight: 1.65,
              maxWidth: '400px',
              marginBottom: '44px',
            }}
          >
            Investigación aplicada en tecnologías descentralizadas.
            De la academia al mundo real.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="#areas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 30px',
                background: '#3B5BDB',
                color: '#f2f0ed',
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d4ac7'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3B5BDB'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Explorar →
            </a>
            <a
              href="#contacto"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '13px 30px',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(242,240,237,0.5)',
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'
                e.currentTarget.style.color = '#f2f0ed'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.color = 'rgba(242,240,237,0.5)'
              }}
            >
              Colaborar
            </a>
          </div>
        </div>

        {/* Floating cards — desktop only */}
        <div
          className="hidden lg:block"
          style={{ position: 'relative', height: '500px' }}
        >
          {/* Certificate card */}
          <div
            ref={card1Ref}
            style={{ position: 'absolute', top: '5%', right: '0', transform: 'rotate(-6deg)', zIndex: 3 }}
          >
            <CertCard />
          </div>

          {/* Contract card */}
          <div
            ref={card2Ref}
            style={{ position: 'absolute', top: '32%', left: '0', transform: 'rotate(5deg)', zIndex: 2 }}
          >
            <ContractCard />
          </div>

          {/* Stats card */}
          <div
            ref={card3Ref}
            style={{ position: 'absolute', bottom: '6%', right: '8%', transform: 'rotate(-3deg)', zIndex: 1 }}
          >
            <StatsCard />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #131313)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
