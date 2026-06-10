'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const links = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Certificados', href: '/certificados' },
]

export default function NavV2() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // On hero (top): transparent over dark navy. On scroll: cream bg + dark text.
  const scrolledStyle = {
    backgroundColor: 'rgba(248,248,244,0.96)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(8,13,43,0.08)',
    boxShadow: '0 1px 0 rgba(8,13,43,0.04)',
  }
  const topStyle = {
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    borderBottom: '1px solid transparent',
    boxShadow: 'none',
  }

  const linkColor = scrolled ? 'rgba(8,13,43,0.55)' : 'rgba(248,248,244,0.55)'
  const linkHoverColor = scrolled ? '#080D2B' : '#F8F8F4'

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '71px',
        transition: 'background-color 0.4s, border-color 0.4s, backdrop-filter 0.4s, box-shadow 0.4s',
        ...(scrolled ? scrolledStyle : topStyle),
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 clamp(24px, 4vw, 56px)',
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={140} height={36}
            style={{
              height: '26px', width: 'auto',
              filter: scrolled ? 'none' : 'brightness(10)',
            }}
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '40px', alignItems: 'center' }}>
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-space-grotesk)',
                  color: linkColor,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
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
            alignItems: 'center', gap: '6px',
            padding: '10px 24px',
            background: '#0057FF',
            color: '#F8F8F4',
            fontSize: '14px',
            fontFamily: 'var(--font-space-grotesk)',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1A40A1'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0057FF'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Colaborar
        </a>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{ background: 'none', border: 'none', padding: '8px', gap: '5px', cursor: 'pointer' }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: '22px', height: '1.5px',
              background: scrolled ? '#080D2B' : '#F8F8F4',
              transition: 'transform 0.3s, opacity 0.3s',
              transformOrigin: 'center',
              transform: i === 0 && menuOpen ? 'translateY(6.5px) rotate(45deg)'
                : i === 2 && menuOpen ? 'translateY(-6.5px) rotate(-45deg)'
                : 'none',
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? '280px' : '0',
          transition: 'max-height 0.3s ease',
          backgroundColor: 'rgba(248,248,244,0.98)',
          borderBottom: menuOpen ? '1px solid rgba(8,13,43,0.08)' : 'none',
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: '20px clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '16px',
                  fontFamily: 'var(--font-space-grotesk)',
                  color: 'rgba(8,13,43,0.7)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '16px', color: '#0057FF', fontFamily: 'var(--font-space-grotesk)', textDecoration: 'none', fontWeight: 500 }}
            >
              Colaborar →
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
