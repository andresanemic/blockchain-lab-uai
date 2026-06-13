'use client'

import React, { useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const LABEL = 'var(--font-oswald, var(--font-inter))'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const MARQUEE_ITEM_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-lato, var(--font-inter))', fontWeight: 300,
  fontSize: 'clamp(40px, 5.8vw, 80px)',
  lineHeight: 1.0, letterSpacing: '-0.03em', color: '#F8F8F4',
  display: 'inline-flex', alignItems: 'center', flexShrink: 0,
  whiteSpace: 'nowrap',
}

function TeamMarqueeItem({ idx }: { idx: number }) {
  return (
    <span key={idx} style={MARQUEE_ITEM_STYLE}>
      Soluciones aplicadas a&nbsp;
      <span style={{ color: '#60A0FF' }}>desafíos reales.</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-lab-uai-marquee.png" alt="" aria-hidden
        style={{
          height: '0.45em', width: 'auto',
          margin: '0 44px 0 40px',
          filter: 'brightness(0) invert(1)',
          opacity: 0.5,
          display: 'inline-block', verticalAlign: 'middle',
        }}
      />
    </span>
  )
}

const team = [
  {
    initials: 'GTO',
    name: 'Giacomo Tomasoni',
    surname: 'Orozco',
    role: 'Jefe de Vinculación I+D',
    bio: 'Puente entre investigación académica y aplicación real.',
    c1: '#0057FF', c2: '#1A40A1', c3: '#080D2B',
  },
  {
    initials: 'FT',
    name: 'Francisco',
    surname: 'Toro',
    role: 'Investigador Principal',
    bio: 'Especialista en smart contracts y protocolos descentralizados.',
    c1: '#1A40A1', c2: '#0D2B6E', c3: '#060F2B',
  },
  {
    initials: 'PG',
    name: 'Pablo',
    surname: 'Guzmán',
    role: 'Director Tecnológico',
    bio: 'Trabaja la adopción, los procesos y el cambio organizacional.',
    c1: '#0057FF', c2: '#1A40A1', c3: '#001480',
  },
  {
    initials: 'AP',
    name: 'Andrés',
    surname: 'Peña',
    role: 'Investigador Asociado',
    bio: 'Investigación aplicada con gestión operativa del laboratorio.',
    c1: '#2255EE', c2: '#0D2B6E', c3: '#080D2B',
  },
]

function TeamCard({ member }: { member: typeof team[0] }) {
  const { initials, name, surname, role, bio, c1, c2, c3 } = member
  const gradId = `tg-${initials}`
  const noiseId = `tn-${initials}`

  return (
    <div
      className="reveal team-card"
      style={{
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
    >
      {/* Photo placeholder — 3:4 ratio */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '133.33%',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px',
        flexShrink: 0,
      }}>
        <svg
          viewBox="0 0 300 400"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="55%" stopColor={c2} />
              <stop offset="100%" stopColor={c3} />
            </linearGradient>
            <filter id={noiseId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" result="blend" />
              <feComposite in="blend" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Base gradient */}
          <rect width="300" height="400" fill={`url(#${gradId})`} />

          {/* Subtle geometric accent */}
          <circle cx="280" cy="60" r="120" fill="rgba(255,255,255,0.04)" />
          <circle cx="20" cy="360" r="90" fill="rgba(0,87,255,0.08)" />
          <rect x="80" y="100" width="140" height="200" rx="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Bottom gradient overlay for text */}
          <defs>
            <linearGradient id={`ovl-${initials}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="55%" stopColor="rgba(6,11,30,0.0)" />
              <stop offset="100%" stopColor="rgba(6,11,30,0.85)" />
            </linearGradient>
          </defs>
          <rect width="300" height="400" fill={`url(#ovl-${initials})`} />
        </svg>

      </div>

      {/* Name + bio */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '17px', color: '#F8F8F4', lineHeight: 1.2, marginBottom: '3px' }}>
          {name}
        </p>
        <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '17px', color: '#F8F8F4', lineHeight: 1.2, marginBottom: '8px' }}>
          {surname}
        </p>
        <p style={{ fontSize: '10px', fontFamily: MONO, fontWeight: 500, color: 'rgba(96,160,255,0.90)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
          {role}
        </p>
        <p style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(248,248,244,0.55)', lineHeight: 1.6 }}>
          {bio}
        </p>
      </div>
    </div>
  )
}

export default function TeamV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const reset = () => {
      document.querySelectorAll<HTMLElement>('.team-card').forEach(el => {
        el.style.transform = 'translateY(0)'
      })
    }
    // Reset on bfcache restore (browser back/forward) and on mount
    window.addEventListener('pageshow', reset)
    reset()
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  useGSAP(() => {
    gsap.fromTo('.team-card',
      { y: 80, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } }
    )
    gsap.fromTo('.team-marquee',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      id="equipo"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', background: '#080D2B', padding: isMobile ? '48px 24px' : 'clamp(96px, 10vh, 108px) clamp(24px, 5vw, 64px)', overflow: 'hidden' }}
    >
      <GridGlowLayers dark glowRef={glowRef} gridGlowRef={gridGlowRef} />

      {/* ── Marquee header ── */}
      <div className="team-marquee" style={{
        overflow: 'hidden',
        marginBottom: '56px',
        position: 'relative', zIndex: 5,
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          flexShrink: 0,
          animation: 'areas-marquee 70s linear infinite',
          willChange: 'transform',
        }}>
          <TeamMarqueeItem idx={0} /><TeamMarqueeItem idx={1} /><TeamMarqueeItem idx={2} />
          <TeamMarqueeItem idx={3} /><TeamMarqueeItem idx={4} /><TeamMarqueeItem idx={5} />
          <TeamMarqueeItem idx={6} /><TeamMarqueeItem idx={7} /><TeamMarqueeItem idx={8} />
          <TeamMarqueeItem idx={9} /><TeamMarqueeItem idx={10} /><TeamMarqueeItem idx={11} />
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 3 }}>

        {/* 4-col photo cards grid */}
        <div className="team-grid">
          {team.map(member => (
            <TeamCard key={member.initials} member={member} />
          ))}
        </div>


      </div>
    </section>
  )
}
