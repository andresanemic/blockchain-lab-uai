'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

/* ── Icons ─────────────────────────────────────────────────────────── */

function IconBadge({ color, size = 48 }: { color: string; size?: number }) {
  const h = size * (40 / 52)
  return (
    <svg viewBox="0 0 52 40" fill="none" width={size} height={h}
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 0.35s ease' }}>
      <rect x="20" y="1" width="12" height="9" rx="2.5" />
      <rect x="2"  y="8" width="48" height="31" rx="5" />
      <circle cx="18" cy="22" r="6" />
      <path d="M8 38 Q8 31 18 31 Q28 31 28 38" />
      <line x1="32" y1="19" x2="47" y2="19" />
      <line x1="32" y1="25" x2="47" y2="25" />
      <line x1="32" y1="31" x2="42" y2="31" />
    </svg>
  )
}

function IconDocument({ color, size = 48 }: { color: string; size?: number }) {
  const h = size * (54 / 44)
  return (
    <svg viewBox="0 0 44 54" fill="none" width={size} height={h}
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 0.35s ease' }}>
      <path d="M4 2h26l12 12v36a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M30 2v12h12" />
      <line x1="10" y1="24" x2="34" y2="24" />
      <line x1="10" y1="32" x2="34" y2="32" />
      <line x1="10" y1="40" x2="24" y2="40" />
    </svg>
  )
}

function IconVideo({ color, size = 48 }: { color: string; size?: number }) {
  const h = size * (64 / 88)
  return (
    <svg viewBox="0 0 88 64" fill="none" width={size} height={h}
      stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'stroke 0.35s ease' }}>
      <rect x="2.5" y="2.5" width="54" height="59" rx="12" />
      <path d="M60 18 L85 5 L85 59 L60 46 Z" />
    </svg>
  )
}

/* ── Data ───────────────────────────────────────────────────────────── */

const projects = [
  {
    index: '01',
    title: 'Token de Interacción\nMinera (TIM)',
    desc: 'Token Web3 para trazar, autenticar y valorizar credenciales laborales en la minería chilena.',
    icon: 'badge'    as const,
    dark: false,
    feature: true,
    href: null,
  },
  {
    index: '02',
    title: 'Sus certificados,\nimposibles de falsificar.',
    desc: 'Emisión de certificados como NFTs en blockchain. Verificación instantánea.',
    icon: 'document' as const,
    dark: true,
    feature: false,
    href: '/certificados',
  },
  {
    index: '03',
    title: 'Un video de dron como\nprueba judicial válida.',
    desc: 'Streaming en vivo + SHA-256 + blockchain. Ninguna objeción de defensa es válida.',
    icon: 'video'    as const,
    dark: false,
    feature: false,
    href: '/validacion-videos',
  },
] as const

/* ── Card ───────────────────────────────────────────────────────────── */

function ProjectCard({ project, isMobile }: { project: typeof projects[number]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false)
  const { dark, feature, href } = project

  const bg          = dark ? '#080D2B' : '#FFFFFF'
  const borderBase  = dark ? 'rgba(255,255,255,0.07)'   : 'rgba(8,13,43,0.08)'
  const borderHover = dark ? 'rgba(0,87,255,0.35)'      : 'rgba(0,87,255,0.22)'
  const iconBase    = dark ? 'rgba(248,248,244,0.65)'   : 'rgba(8,13,43,0.45)'
  const iconHover   = dark ? '#60A0FF'                  : '#0057FF'
  const titleBase   = dark ? '#F8F8F4'                  : '#080D2B'
  const titleHover  = dark ? '#60A0FF'                  : '#0057FF'
  const descColor   = dark ? 'rgba(248,248,244,0.55)'   : 'rgba(8,13,43,0.48)'
  const shadowBase  = dark
    ? '0 2px 16px rgba(0,0,0,0.28)'
    : '0 1px 4px rgba(8,13,43,0.06), 0 4px 16px rgba(8,13,43,0.04)'
  const shadowHover = dark
    ? '0 20px 56px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.18)'
    : '0 20px 56px rgba(8,13,43,0.10), 0 8px 24px rgba(8,13,43,0.06)'

  // On mobile all cards share the same compact layout regardless of feature flag
  const isFeatureLayout = feature && !isMobile
  const pad     = isFeatureLayout ? 'clamp(28px, 3.5vw, 48px)' : 'clamp(20px, 2.5vw, 32px)'
  const iconSz  = isFeatureLayout ? 180 : 40
  const titleSz = isFeatureLayout ? 'clamp(22px, 2.8vw, 40px)' : 'clamp(15px, 1.7vw, 22px)'

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    borderRadius: '20px',
    background: bg,
    border: `1px solid ${hovered ? borderHover : borderBase}`,
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isFeatureLayout ? 'flex-start' : 'space-between',
    gap: isFeatureLayout ? 'clamp(28px, 5vh, 56px)' : '0',
    padding: pad,
    boxShadow: hovered ? shadowHover : shadowBase,
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: [
      'transform 0.50s cubic-bezier(0.16,1,0.3,1)',
      'box-shadow 0.50s cubic-bezier(0.16,1,0.3,1)',
      'border-color 0.30s ease',
    ].join(', '),
    textDecoration: 'none',
  }

  const inner = (
    <>
      {/* Blue progress line — slides in from left on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: '#0057FF',
        transformOrigin: 'left center',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        borderRadius: '0 0 2px 0',
      }} />

      {/* Ghost index — decorative */}
      <span aria-hidden style={{
        position: 'absolute',
        bottom: '-0.15em', right: '-0.05em',
        fontFamily: DISPLAY, fontWeight: 900,
        fontSize: 'clamp(80px, 14vw, 160px)',
        lineHeight: 1, letterSpacing: '-0.06em',
        color: dark ? 'rgba(96,160,255,0.38)' : 'rgba(8,13,43,0.08)',
        userSelect: 'none', pointerEvents: 'none',
        transition: 'opacity 0.4s ease',
        opacity: hovered ? 1 : 0.85,
      }}>
        {project.index}
      </span>

      {/* Icon */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {project.icon === 'badge'    && <IconBadge    color={hovered ? iconHover : iconBase} size={iconSz} />}
        {project.icon === 'document' && <IconDocument color={hovered ? iconHover : iconBase} size={iconSz} />}
        {project.icon === 'video'    && <IconVideo    color={hovered ? iconHover : iconBase} size={iconSz} />}
      </div>

      {/* Title + desc */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: DISPLAY, fontWeight: 300,
          fontSize: titleSz,
          lineHeight: 1.1, letterSpacing: '-0.025em',
          color: hovered ? titleHover : titleBase,
          marginBottom: '8px',
          whiteSpace: 'pre-line',
          transition: 'color 0.30s ease',
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: 'clamp(11px, 0.95vw, 13px)',
          fontFamily: BODY,
          color: descColor,
          lineHeight: 1.65,
          maxWidth: feature ? '40ch' : '32ch',
          margin: 0,
        }}>
          {project.desc}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="project-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={cardStyle}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={cardStyle}
    >
      {inner}
    </div>
  )
}

/* ── Section ────────────────────────────────────────────────────────── */

export default function ProjectsV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.fromTo('.projects-heading',
      { y: 72, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    )
    gsap.fromTo('.project-card',
      { opacity: 0, y: 48, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1,
        duration: 1.0, ease: 'expo.out',
        stagger: { amount: 0.7, from: 'start' },
        delay: 0.25,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', background: '#F8F8F4', overflow: 'hidden' }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 3,
        maxWidth: '1280px', margin: '0 auto',
        padding: isMobile ? '48px 20px 28px' : 'clamp(96px, 10vh, 108px) clamp(24px, 5vw, 64px) 48px',
      }}>
        <h2
          className="projects-heading"
          style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: 'clamp(44px, 6.5vw, 88px)',
            lineHeight: 0.97, letterSpacing: '-0.03em', color: '#080D2B',
          }}
        >
          Lo que estamos<br /><span style={{ color: '#0057FF' }}>construyendo hoy.</span>
        </h2>
      </div>

      {/* Bento grid — TIM left (tall), Certs + Video right (stacked) / stacked on mobile */}
      <div style={{
        position: 'relative', zIndex: 3,
        maxWidth: '1280px', margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 clamp(24px, 5vw, 64px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '5fr 3fr',
        gridTemplateRows: isMobile ? 'auto' : '1fr 1fr',
        gap: isMobile ? '12px' : '10px',
        minHeight: isMobile ? 'auto' : 'clamp(460px, 60vh, 640px)',
      }}>
        {/* 01 TIM */}
        <div style={isMobile ? { height: '200px' } : { gridColumn: '1', gridRow: '1 / 3' }}>
          <ProjectCard project={projects[0]} isMobile={isMobile} />
        </div>

        {/* 02 Certificados */}
        <div style={isMobile ? { height: '200px' } : { gridColumn: '2', gridRow: '1' }}>
          <ProjectCard project={projects[1]} isMobile={isMobile} />
        </div>

        {/* 03 Video */}
        <div style={isMobile ? { height: '200px' } : { gridColumn: '2', gridRow: '2' }}>
          <ProjectCard project={projects[2]} isMobile={isMobile} />
        </div>
      </div>

      {/* Bottom spacing */}
      <div style={{ height: isMobile ? '40px' : 'clamp(72px, 10vh, 108px)' }} />

    </section>
  )
}
