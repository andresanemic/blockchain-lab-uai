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
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(19,19,19,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a href="/">
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={140}
            height={36}
            style={{ height: '28px', width: 'auto' }}
            priority
          />
        </a>

        {/* Desktop links */}
        <ul
          className="hidden md:flex items-center"
          style={{ gap: '36px', listStyle: 'none', margin: 0, padding: 0 }}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  color: 'rgba(242,240,237,0.38)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f2f0ed')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,240,237,0.38)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contacto"
          className="hidden md:inline-flex items-center"
          style={{
            gap: '8px',
            padding: '8px 20px',
            border: '1px solid rgba(59,91,219,0.55)',
            borderRadius: '5px',
            fontSize: '11px',
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#f2f0ed',
            textDecoration: 'none',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#3B5BDB'
            e.currentTarget.style.borderColor = '#3B5BDB'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(59,91,219,0.55)'
          }}
        >
          Contacto →
        </a>

        {/* Mobile hamburger — no inline display so md:hidden can win */}
        <button
          className="flex flex-col md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{ background: 'none', border: 'none', padding: '8px', gap: '5px' }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                background: '#f2f0ed',
                transition: 'transform 0.3s, opacity 0.3s',
                transformOrigin: 'center',
                transform:
                  i === 0 && menuOpen ? 'translateY(6px) rotate(45deg)'
                  : i === 2 && menuOpen ? 'translateY(-6px) rotate(-45deg)'
                  : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '260px' : '0',
          backgroundColor: 'rgba(15,15,15,0.98)',
          borderBottom: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: '20px clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  color: 'rgba(242,240,237,0.55)',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
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
              style={{ fontSize: '13px', color: '#3B5BDB', fontFamily: 'var(--font-jetbrains-mono)', textDecoration: 'none' }}
            >
              Contacto →
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
