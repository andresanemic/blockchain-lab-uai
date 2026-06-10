'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const LABEL = 'var(--font-oswald)'
const BODY  = 'var(--font-inter)'

const links = [
  { label: 'Áreas',      href: '#areas' },
  { label: 'Proyectos',  href: '#proyectos' },
  { label: 'Equipo',     href: '#equipo' },
  { label: 'Certificados', href: '/certificados' },
]

export default function NavV2() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (window.innerWidth >= 768) setMenuOpen(false)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '68px',
      backgroundColor: scrolled ? 'rgba(248,248,244,0.97)' : 'rgba(248,248,244,0.80)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(8,13,43,0.10)' : 'rgba(8,13,43,0.06)'}`,
      transition: 'background-color 0.35s, border-color 0.35s',
    }}>
      <div style={{
        maxWidth: '1360px', margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={140} height={36}
            style={{ height: '22px', width: 'auto' }}
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '44px', alignItems: 'center' }}>
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  fontSize: '11px',
                  fontFamily: LABEL,
                  fontWeight: 500,
                  color: 'rgba(8,13,43,0.50)',
                  textDecoration: 'none',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#080D2B')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(8,13,43,0.50)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contacto"
          className="hidden md:inline-flex"
          style={{
            alignItems: 'center',
            padding: '9px 22px',
            background: '#080D2B',
            color: '#F8F8F4',
            fontSize: '11px',
            fontFamily: LABEL,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderRadius: '6px',
            textDecoration: 'none',
            border: '1px solid #080D2B',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.borderColor = '#0057FF'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#080D2B'; e.currentTarget.style.borderColor = '#080D2B'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Colaborar
        </a>

        {/* Mobile hamburger — wrapper controls visibility, no inline display conflict */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '1.5px', background: '#080D2B',
                transition: 'transform 0.3s, opacity 0.3s', transformOrigin: 'center',
                transform: i === 0 && menuOpen ? 'translateY(6.5px) rotate(45deg)' : i === 2 && menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden" style={{
        maxHeight: menuOpen ? '320px' : '0',
        overflow: 'hidden', transition: 'max-height 0.3s ease',
        backgroundColor: 'rgba(248,248,244,0.99)',
        borderBottom: menuOpen ? '1px solid rgba(8,13,43,0.08)' : 'none',
      }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: '20px clamp(20px,5vw,80px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '14px', fontFamily: BODY, color: 'rgba(8,13,43,0.65)', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contacto" onClick={() => setMenuOpen(false)} style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Colaborar →
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
