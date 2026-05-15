'use client'

import Image from 'next/image'

const navLinks = [
  { label: 'Áreas', href: '/#areas' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Equipo', href: '/#equipo' },
  { label: 'Certificados', href: '/certificados' },
]

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: '#1E1E2E', background: '#0A0A0F' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/uai_logo.png"
            alt="UAI"
            width={120}
            height={40}
            style={{ height: '24px', width: 'auto' }}
            className="filter brightness-0 invert opacity-70"
          />
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: '#5A5A72' }}
          >
            Blockchain Lab
          </span>
        </a>

        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs transition-colors"
              style={{ color: '#5A5A72' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = '#9898B0')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = '#5A5A72')
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-center md:text-right" style={{ color: '#5A5A72' }}>
          © 2026 Blockchain Lab UAI — Universidad Adolfo Ibáñez
        </p>
      </div>
    </footer>
  )
}
