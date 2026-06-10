'use client'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const LABEL = 'var(--font-oswald, var(--font-inter))'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Soluciones', href: '#soluciones' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Impacto', href: '#impacto' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
]

export default function FooterV2() {
  return (
    <footer
      style={{ background: '#080D2B', color: '#F8F8F4', position: 'relative', overflow: 'hidden' }}
    >
      {/* Huge brand name — Blueprint style */}
      <div
        aria-hidden
        style={{
          padding: 'clamp(48px, 8vh, 96px) clamp(24px, 5vw, 64px) 0',
          overflow: 'hidden',
          lineHeight: 0.88,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 300,
            fontSize: 'clamp(72px, 14vw, 200px)',
            letterSpacing: '-0.04em',
            color: 'rgba(248,248,244,0.06)',
            whiteSpace: 'nowrap',
          }}
        >
          BLOCKCHAIN
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 300,
            fontSize: 'clamp(72px, 14vw, 200px)',
            letterSpacing: '-0.04em',
            color: '#0057FF',
            opacity: 0.12,
            whiteSpace: 'nowrap',
          }}
        >
          LAB UAI.
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 clamp(24px, 5vw, 64px)' }} />

      {/* Info columns */}
      <div style={{ padding: 'clamp(56px, 8vh, 96px) clamp(24px, 5vw, 64px)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(40px, 6vw, 80px)', maxWidth: '1280px', margin: '0 auto' }}>

        {/* Col 1 — About */}
        <div>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Blockchain Lab UAI
          </p>
          <p style={{ fontSize: '14px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', lineHeight: 1.7, maxWidth: '260px' }}>
            Laboratorio de investigación aplicada de la Universidad Adolfo Ibáñez. Transformamos desafíos reales en soluciones blockchain.
          </p>
        </div>

        {/* Col 2 — Nav */}
        <div>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Explorar
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  style={{ fontSize: '14px', fontFamily: BODY, color: 'rgba(248,248,244,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#F8F8F4' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,248,244,0.45)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <p style={{ fontSize: '13px', fontFamily: LABEL, fontWeight: 500, color: '#0057FF', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Contacto
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a
              href="mailto:blockchain@uai.cl"
              style={{ fontFamily: MONO, fontSize: '14px', color: 'rgba(248,248,244,0.7)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0057FF' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,248,244,0.7)' }}
            >
              blockchain@uai.cl
            </a>
            <a
              href="mailto:giacomo.tomasoni@uai.cl"
              style={{ fontFamily: MONO, fontSize: '13px', color: 'rgba(248,248,244,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0057FF' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,248,244,0.4)' }}
            >
              giacomo.tomasoni@uai.cl
            </a>
            <p style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(248,248,244,0.3)', lineHeight: 1.6, marginTop: '8px' }}>
              Universidad Adolfo Ibáñez<br />
              Santiago, Chile
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px clamp(24px, 5vw, 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(248,248,244,0.25)' }}>
          © 2025 Blockchain Lab UAI · Universidad Adolfo Ibáñez
        </p>
        <p style={{ fontSize: '12px', fontFamily: MONO, color: 'rgba(248,248,244,0.18)', letterSpacing: '0.04em' }}>
          blockchain@uai.cl
        </p>
      </div>
    </footer>
  )
}
