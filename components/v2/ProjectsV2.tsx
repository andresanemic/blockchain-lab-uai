'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    id: 'chatterpay',
    label: 'Caso de Estudio',
    title: 'ChatterPay',
    desc: 'Wallet DeFi que opera vía WhatsApp. Account abstraction en L2 para pagos sin fricción entre usuarios comunes.',
    tags: ['Account Abstraction', 'L2', 'DeFi'],
    href: '#',
    accent: '#3B5BDB',
    nodes: [[20,40],[60,15],[100,38],[60,62],[38,22],[82,54],[50,38]] as [number,number][],
    edges: [[0,1],[1,2],[2,3],[3,0],[4,6],[5,6],[1,6],[3,6]] as [number,number][],
  },
  {
    id: 'certificados',
    label: 'Producto Activo',
    title: 'Certificados UAI',
    desc: 'Emisión y validación de credenciales académicas on-chain. Verificación inmutable para títulos y certificados de la universidad.',
    tags: ['ERC-721', 'Identidad Digital', 'UAI'],
    href: '/certificados',
    accent: '#C9A84C',
    nodes: [[20,40],[60,15],[100,38],[60,62],[38,22],[82,54],[50,38]] as [number,number][],
    edges: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]] as [number,number][],
  },
]

function NetworkSVG({ nodes, edges, accent }: {
  nodes: [number,number][]
  edges: [number,number][]
  accent: string
}) {
  return (
    <svg viewBox="0 0 120 78" width="100%" height="100%" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={accent}
          strokeOpacity={0.18}
          strokeWidth={1}
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx} cy={cy}
          r={i === 6 ? 5.5 : 3}
          fill={accent}
          fillOpacity={i === 6 ? 0.7 : 0.4}
        />
      ))}
    </svg>
  )
}

export default function ProjectsV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.proj-v2', {
        y: 52,
        opacity: 0,
        duration: 0.85,
        stagger: 0.22,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      style={{
        background: '#0e0e0e',
        padding: 'clamp(80px, 12vh, 120px) clamp(20px, 4vw, 48px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <p
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-jetbrains-mono)',
              color: 'rgba(59,91,219,0.65)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Proyectos
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
              fontWeight: 300,
              fontSize: 'clamp(30px, 4.2vw, 54px)',
              letterSpacing: '-0.025em',
              color: '#f2f0ed',
              lineHeight: 1.1,
            }}
          >
            Tecnología que opera
            <br />
            en el mundo real.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              className="proj-v2"
              style={{
                background: '#181818',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.accent}38`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              {/* Visual */}
              <div
                style={{
                  height: '110px',
                  background: 'rgba(0,0,0,0.35)',
                  borderRadius: '10px',
                  padding: '16px 24px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <NetworkSVG nodes={p.nodes} edges={p.edges} accent={p.accent} />
              </div>

              <p
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  color: p.accent,
                  opacity: 0.65,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {p.label}
              </p>

              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  color: '#f2f0ed',
                  letterSpacing: '-0.015em',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}
              >
                {p.title}
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(242,240,237,0.38)',
                  lineHeight: 1.65,
                  marginBottom: '22px',
                  flexGrow: 1,
                }}
              >
                {p.desc}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-jetbrains-mono)',
                      color: 'rgba(242,240,237,0.35)',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={p.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  color: p.accent,
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  transition: 'gap 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = '11px')}
                onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
              >
                Ver proyecto <ArrowUpRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
