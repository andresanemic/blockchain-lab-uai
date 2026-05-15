'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const links = [
  { label: 'Áreas', href: '/#areas' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Roadmap', href: '/#roadmap' },
  { label: 'Equipo', href: '/#equipo' },
  { label: 'Certificados', href: '/certificados' },
]

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const trigger = ScrollTrigger.create({
      start: 'top-=80',
      onEnter: () => {
        nav.style.backdropFilter = 'blur(12px)'
        nav.style.backgroundColor = 'rgba(10,10,15,0.85)'
        nav.style.borderBottomColor = 'rgba(30,30,46,0.6)'
      },
      onLeaveBack: () => {
        nav.style.backdropFilter = 'blur(0px)'
        nav.style.backgroundColor = 'rgba(10,10,15,0)'
        nav.style.borderBottomColor = 'transparent'
      },
    })

    return () => trigger.kill()
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
      style={{ borderBottomColor: 'transparent', backgroundColor: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/uai_logo.png"
            alt="UAI"
            width={120}
            height={40}
            style={{ height: '30px', width: 'auto' }}
            className="filter brightness-0 invert"
            priority
          />
          <span
            className="hidden sm:block font-mono text-xs tracking-widest uppercase"
            style={{ color: '#9898B0' }}
          >
            Blockchain Lab
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-wide transition-colors duration-200"
                style={{ color: '#9898B0' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9898B0')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="/#contacto"
          className="hidden md:inline-flex items-center px-5 py-2 rounded text-sm font-medium transition-colors duration-200"
          style={{ border: '1px solid #3B5BDB', color: '#3B5BDB' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3B5BDB'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#3B5BDB'
          }}
        >
          Colaborar
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span
            className="block h-px w-6 transition-all duration-300 origin-center"
            style={{
              background: '#9898B0',
              transform: open ? 'translateY(4px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300"
            style={{
              background: '#9898B0',
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-6 transition-all duration-300 origin-center"
            style={{
              background: '#9898B0',
              transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '400px' : '0px',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(10,10,15,0.95)',
          borderBottom: open ? '1px solid rgba(30,30,46,0.6)' : 'none',
        }}
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm tracking-wide transition-colors duration-200"
                style={{ color: '#9898B0', borderBottom: '1px solid #1E1E2E' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F0F5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9898B0')}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <a
              href="/#contacto"
              onClick={() => setOpen(false)}
              className="inline-flex items-center px-5 py-2 rounded text-sm font-medium transition-colors duration-200"
              style={{ border: '1px solid #3B5BDB', color: '#3B5BDB' }}
            >
              Colaborar
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
