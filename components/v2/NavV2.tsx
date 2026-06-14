'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ScrambleText from './ScrambleText'
import { gsap } from '@/lib/gsap'

const MONO  = 'var(--font-jetbrains-mono, monospace)'
const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY  = 'var(--font-inter)'

const navLinks = [
  { label: 'Proyectos', href: '/#proyectos', sectionId: 'proyectos' },
  { label: 'Áreas',     href: '/#areas',     sectionId: 'areas'     },
  { label: 'Blog',      href: '#',           sectionId: null        },
]


export default function NavV2() {
  const [expanded,      setExpanded]      = useState(false)
  const [hoverExpanded, setHoverExpanded] = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [activeId,      setActiveId]      = useState<string | null>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const menuLinksRef  = useRef<HTMLDivElement>(null)
  const navRef        = useRef<HTMLElement>(null)
  const hoverTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOpen = expanded || hoverExpanded

  const handleNavMouseEnter = () => {
    if (expanded) return
    hoverTimer.current = setTimeout(() => setHoverExpanded(true), 500)
  }
  const handleNavMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setHoverExpanded(false)
  }

  // Expand pill on scroll
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 60
      setExpanded(scrolled)
      if (scrolled) {
        if (hoverTimer.current) clearTimeout(hoverTimer.current)
        setHoverExpanded(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const map: Record<string, string> = {
      areas: 'areas', proyectos: 'proyectos', equipo: 'equipo',
      impacto: 'areas', blockchain: 'proyectos', acerca: 'equipo',
      proceso: 'equipo', roadmap: 'equipo',
    }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) setActiveId(map[visible[0].target.id] ?? null)
      },
      { threshold: 0.25, rootMargin: '-10% 0px -65% 0px' }
    )
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id); if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Entrance animation on mount — desktop only; skip on mobile to prevent GSAP
  // from overriding the display:none from Tailwind's `hidden` class
  useEffect(() => {
    if (navRef.current && window.innerWidth >= 768) {
      gsap.fromTo(navRef.current,
        { opacity: 0, top: '-34px' },
        { opacity: 1, top: '14px', duration: 1.1, ease: 'expo.out', delay: 0.3 }
      )
    }
  }, [])

  // Mobile overlay animation
  useEffect(() => {
    const overlay = overlayRef.current
    const links   = menuLinksRef.current?.querySelectorAll('.mob-link')
    if (!overlay) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { pointerEvents: 'auto' })
      gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'expo.out' })
      if (links?.length) {
        gsap.fromTo(links,
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07, delay: 0.1 }
        )
      }
    } else {
      document.body.style.overflow = ''
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }),
      })
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* ═══ DESKTOP — KDE-style top panel (md+) ═══════════════════════════ */}
      <nav
        ref={navRef}
        className="hidden md:flex"
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
        style={{
          position: 'fixed',
          top: '14px',
          left: '50%',
          opacity: 0,
          // collapsed: translateX(-89px) centers the leftmost 178px pill on screen
          // expanded:  translateX(-50%) centers the full 1120px nav
          transform: isOpen ? 'translateX(-50%)' : 'translateX(-89px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          width: 'min(1120px, 95vw)',
          overflow: 'hidden',
          background: 'rgba(8, 13, 43, 0.78)',
          backdropFilter: 'blur(36px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(36px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 4px 24px rgba(8,13,43,0.28),
            0 12px 48px rgba(8,13,43,0.20)
          `,
          borderRadius: '18px',
          padding: '11px 24px',
          clipPath: isOpen
            ? 'inset(0 0 0 0 round 18px)'
            : 'inset(0 calc(100% - 178px) 0 0 round 18px)',
          transition: 'clip-path 1.0s cubic-bezier(0.22, 1, 0.36, 1), transform 1.0s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'clip-path, transform',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {/* Logo — left side; extra left padding centers it visually within the 178px pill */}
        <a
          href="/"
          style={{
            display: 'flex', alignItems: 'center', textDecoration: 'none',
            flexShrink: 0, padding: '0 8px 0 8px', marginRight: '8px',
          }}
          aria-label="Blockchain Lab UAI"
        >
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={280} height={72}
            quality={100}
            style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
            priority
          />
        </a>

        {/* Right group: links + CTA — pushed to far right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          {/* Nav links — KDE dock item style */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
          }}>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '10px 18px',
                  borderRadius: '11px',
                  fontFamily: MONO, fontSize: '14px', fontWeight: 400,
                  letterSpacing: '0.02em',
                  color: 'rgba(247,245,242,0.72)',
                  background: 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'rgba(247,245,242,0.95)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(247,245,242,0.72)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <ScrambleText text={link.label} />
              </a>
            ))}
          </div>

          {/* Thin separator */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.10)', margin: '0 6px', flexShrink: 0 }} />

          {/* CTA */}
          <a href="#contacto" className="nav-cta">
            <span>Colaborar</span>
          </a>
        </div>
      </nav>

      {/* ═══ MOBILE NAV (< md) ══════════════════════════════════════════════ */}
      <div
        className="flex md:hidden"
        style={{
          position: 'fixed', top: '12px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          alignItems: 'center', justifyContent: 'space-between',
          gap: '16px',
          background: menuOpen ? 'rgba(8,13,43,0.97)' : 'rgba(8,13,43,0.78)',
          backdropFilter: 'blur(36px)',
          WebkitBackdropFilter: 'blur(36px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 24px rgba(8,13,43,0.28)',
          borderRadius: '14px',
          padding: '8px 10px 8px 14px',
          transition: 'background 0.35s, width 0.6s cubic-bezier(0.6,0.14,0,1)',
          width: '200px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Inicio">
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={280} height={72}
            quality={100}
            style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
            priority
          />
        </a>
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{ background: 'none', border: 'none', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', flexShrink: 0 }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '18px', height: '1.5px',
              background: 'rgb(247,245,242)',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
              transformOrigin: 'center',
              transform:
                i === 0 && menuOpen ? 'translateY(5.5px) rotate(45deg)' :
                i === 2 && menuOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* ═══ MOBILE FULL-SCREEN OVERLAY ═════════════════════════════════════ */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#080D2B', opacity: 0, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column',
          padding: '104px clamp(32px, 8vw, 64px) 48px',
        }}
      >
        <div ref={menuLinksRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="mob-link"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                fontFamily: DISPLAY, fontWeight: 300,
                fontSize: 'clamp(40px, 9vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.02em',
                color: '#F8F8F4', textDecoration: 'none',
                padding: '20px 0',
                borderBottom: i < navLinks.length - 1 ? '1px solid rgba(248,248,244,0.07)' : 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0057FF' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#F8F8F4' }}
            >
              <span style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(0,87,255,0.65)', letterSpacing: '0.08em', flexShrink: 0 }}>
                0{i + 1}
              </span>
              {link.label}
            </a>
          ))}

          <a
            href="#contacto"
            className="mob-link"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              marginTop: '40px', fontFamily: MONO, fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#F8F8F4', textDecoration: 'none',
              padding: '13px 22px', background: '#0057FF',
              borderRadius: '8px', alignSelf: 'flex-start',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Colaborar
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div style={{ borderTop: '1px solid rgba(248,248,244,0.07)', paddingTop: '24px' }}>
          <p style={{ fontFamily: BODY, fontSize: '13px', color: 'rgba(248,248,244,0.35)', marginBottom: '4px' }}>Blockchain Lab UAI</p>
          <p style={{ fontFamily: BODY, fontSize: '12px', color: 'rgba(248,248,244,0.20)' }}>© 2026 Todos los derechos reservados.</p>
        </div>
      </div>
    </>
  )
}
