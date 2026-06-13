'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const LABEL   = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const chains = [
  { name: 'Bitcoin',   logo: '/chains/bitcoin.png',   variant: 'dark'  },
  { name: 'Ethereum',  logo: '/chains/ethereum.png',  variant: 'light' },
  { name: 'Avalanche', logo: '/chains/avalanche.png', variant: 'dark'  },
  { name: 'Stellar',   logo: '/chains/stellar.png',   variant: 'light' },
  { name: 'Solana',    logo: '/chains/solana.png',    variant: 'dark'  },
  { name: 'Sui',       logo: '/chains/sui.png',       variant: 'light' },
  { name: 'ICP',       logo: '/chains/icp.png',       variant: 'dark'  },
  { name: 'Polkadot',  logo: '/chains/polkadot.png',  variant: 'light' },
] as const

const DARK_BASE  = '0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 16px rgba(8,13,43,0.22), 0 12px 32px rgba(8,13,43,0.14)'
const DARK_HOVER = '0 1px 0 rgba(255,255,255,0.07) inset, 0 0 0 4px rgba(8,13,43,0.08), 0 8px 32px rgba(8,13,43,0.32), 0 24px 48px rgba(8,13,43,0.16)'
const LITE_BASE  = '0 2px 8px rgba(8,13,43,0.06), 0 8px 20px rgba(8,13,43,0.04)'
const LITE_HOVER = '0 6px 20px rgba(8,13,43,0.10), 0 16px 36px rgba(8,13,43,0.07)'

function ChainPill({ name, logo, variant }: typeof chains[number]) {
  const isDark = variant === 'dark'
  // Stellar logo is black → only needs invert on dark pills
  const needsInvert = name === 'Stellar' && isDark

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '11px',
        padding: '10px 14px',
        background: isDark ? 'rgba(8,13,43,0.78)' : '#FFFFFF',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(8,13,43,0.14)',
        backdropFilter: isDark ? 'blur(36px) saturate(1.4)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(36px) saturate(1.4)' : undefined,
        boxShadow: isDark ? DARK_BASE : LITE_BASE,
        transition: 'transform 0.30s cubic-bezier(0.16,1,0.3,1), box-shadow 0.30s cubic-bezier(0.16,1,0.3,1), border-color 0.20s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = isDark ? DARK_HOVER : LITE_HOVER
        if (!isDark) el.style.borderColor = 'rgba(8,13,43,0.28)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = isDark ? DARK_BASE : LITE_BASE
        if (!isDark) el.style.borderColor = 'rgba(8,13,43,0.14)'
      }}
    >
      <Image
        src={logo}
        alt={name}
        width={26}
        height={26}
        style={{
          width: '26px', height: '26px', objectFit: 'contain', flexShrink: 0,
          filter: needsInvert ? 'invert(1) brightness(2)' : undefined,
        }}
      />
      <span style={{
        fontFamily: MONO, fontSize: '10px',
        color: isDark ? 'rgba(248,248,244,0.88)' : 'rgba(8,13,43,0.70)',
        letterSpacing: '0.10em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>{name}</span>
    </div>
  )
}

export default function ImpactV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.impact-left',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 90%' } }
    )
    gsap.fromTo('.chain-pill',
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' } }
    )
    gsap.fromTo('.impact-callout',
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: '.impact-callout', start: 'top 88%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      id="impacto"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', background: '#F8F8F4', padding: isMobile ? '48px 24px' : 'clamp(96px,14vh,136px) clamp(24px,5vw,64px)', overflow: 'hidden' }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : 'clamp(48px, 7vw, 96px)', alignItems: 'start' }}>

        {/* ── LEFT: h2 ── */}
        <div className="impact-left">
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: 'clamp(30px, 4.2vw, 56px)',
            lineHeight: 1.05, letterSpacing: '-0.025em',
            color: '#080D2B',
          }}>
            {isMobile ? (
              <>Blockchain no es una tendencia. Es una nueva <span style={{ color: '#0057FF' }}>infraestructura de confianza.</span></>
            ) : (
              <>Blockchain no es una<br />tendencia. Es una nueva<br /><span style={{ color: '#0057FF' }}>infraestructura de confianza.</span></>
            )}
          </h2>
        </div>

        {/* ── RIGHT: chain pills + CTA ── */}
        <div>
          <p style={{
            fontSize: '10px', fontFamily: MONO, fontWeight: 500,
            color: 'rgba(8,13,43,0.35)', letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>Experiencia en</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {chains.map(c => (
              <div key={c.name} className="chain-pill">
                <ChainPill {...c} />
              </div>
            ))}
          </div>

          <div className="impact-callout" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href="#"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = '#0057FF'
                el.style.letterSpacing = '0.18em'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(8,13,43,0.40)'
                el.style.letterSpacing = '0.14em'
              }}
              style={{
                fontFamily: MONO, fontSize: '10px', fontWeight: 500,
                color: 'rgba(8,13,43,0.40)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.25s ease, letter-spacing 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Lee nuestro blog →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
