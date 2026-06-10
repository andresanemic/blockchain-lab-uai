'use client'

import Image from 'next/image'

const links = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Certificados', href: '/certificados' },
  { label: 'Validación', href: '/validacion-pruebas-multimedia' },
]

export default function FooterV2() {
  return (
    <footer
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.045)',
        padding: 'clamp(40px, 6vh, 64px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '36px',
          }}
        >
          <a href="/">
            <Image
              src="/logo-lab-uai.png"
              alt="Blockchain Lab UAI"
              width={130}
              height={32}
              style={{ height: '22px', width: 'auto', opacity: 0.5 }}
            />
          </a>

          <nav style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  color: 'rgba(242,240,237,0.25)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(242,240,237,0.65)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,240,237,0.25)')}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains-mono)',
              color: 'rgba(242,240,237,0.18)',
              letterSpacing: '0.05em',
            }}
          >
            © 2026 Blockchain Lab UAI — Universidad Adolfo Ibáñez
          </p>
          <a
            href="mailto:blockchain@uai.cl"
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains-mono)',
              color: 'rgba(59,91,219,0.5)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#3B5BDB')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(59,91,219,0.5)')}
          >
            blockchain@uai.cl
          </a>
        </div>
      </div>
    </footer>
  )
}
