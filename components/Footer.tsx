'use client'

import Image from 'next/image'

const navLinks = [
  { label: 'Áreas', href: '/#areas' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Equipo', href: '/#equipo' },
  { label: 'Certificados', href: '/certificados' },
  { label: 'Validación', href: '/validacion-pruebas-multimedia' },
]

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: '#1E1E2E', background: '#0A0A0F' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-lab-uai.png"
            alt="Blockchain Lab UAI"
            width={140}
            height={35}
            style={{ height: '28px', width: 'auto', opacity: 0.7 }}
          />
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
