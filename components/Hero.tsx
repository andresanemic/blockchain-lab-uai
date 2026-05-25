'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const nodes = [
  { cx: 100, cy: 110, r: 5 },
  { cx: 250, cy: 75, r: 7 },
  { cx: 400, cy: 115, r: 5 },
  { cx: 510, cy: 210, r: 8 },
  { cx: 455, cy: 340, r: 5 },
  { cx: 300, cy: 415, r: 6 },
  { cx: 155, cy: 365, r: 5 },
  { cx: 75, cy: 230, r: 6 },
  { cx: 335, cy: 205, r: 9 },
  { cx: 195, cy: 265, r: 5 },
  { cx: 420, cy: 260, r: 5 },
  { cx: 80, cy: 390, r: 4 },
]

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [6, 7], [7, 0], [1, 8], [8, 10], [8, 9], [9, 6],
  [9, 5], [10, 4], [7, 9], [2, 8], [6, 11], [7, 11],
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<SVGGElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(textRef.current!.children, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      })

      tl.from(
        orbRef.current,
        { opacity: 0, scale: 0.6, duration: 1.2, ease: 'power2.out' },
        0.2
      )

      const dots = graphRef.current?.querySelectorAll('circle')
      if (dots) {
        gsap.to(dots, {
          scale: 1.35,
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.25, from: 'random' },
          transformOrigin: 'center center',
        })
      }

      gsap.to(graphRef.current, {
        rotation: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: '293px 245px',
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: '#0A0A0F' }}
    >
      {/* Gradient orb */}
      <div
        ref={orbRef}
        className="orb w-[700px] h-[700px] opacity-[0.12]"
        style={{
          top: '50%',
          left: '-10%',
          transform: 'translateY(-50%)',
          background: 'radial-gradient(circle, #3B5BDB 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
        {/* Text column */}
        <div ref={textRef}>
          <p className="font-mono text-xs tracking-[0.25em] text-uai-accent uppercase mb-6">
            Universidad Adolfo Ibáñez
          </p>

          <h1 className="font-sans font-extrabold text-[2.1rem] sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] text-uai-text-primary mb-6 text-balance">
            Innovación Económica y{' '}
            <span className="text-uai-accent">Relaciones Descentralizadas</span>
          </h1>

          <p className="text-uai-text-secondary text-lg leading-relaxed max-w-lg mb-10">
            Transformando confianza, transparencia y nuevos modelos de
            colaboración mediante tecnologías descentralizadas.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#nosotros"
              className="inline-flex items-center px-7 py-3 rounded bg-uai-accent hover:bg-uai-accent-muted text-white text-sm font-medium transition-colors duration-200"
            >
              Conocer el Lab
            </a>
            <a
              href="#areas"
              className="inline-flex items-center px-7 py-3 rounded border border-uai-border text-uai-text-secondary hover:border-uai-accent hover:text-uai-accent text-sm font-medium transition-colors duration-200"
            >
              Ver Áreas de Trabajo
            </a>
          </div>
        </div>

        {/* Blockchain graph */}
        <div className="hidden lg:flex items-center justify-center">
          <svg
            viewBox="0 0 586 490"
            width="520"
            height="435"
            aria-hidden="true"
          >
            <g ref={graphRef}>
              {edges.map(([a, b], i) => (
                <line
                  key={i}
                  x1={nodes[a].cx}
                  y1={nodes[a].cy}
                  x2={nodes[b].cx}
                  y2={nodes[b].cy}
                  stroke="#3B5BDB"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
              ))}
              {nodes.map((n, i) => (
                <circle
                  key={i}
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r}
                  fill="#3B5BDB"
                  fillOpacity={i === 8 ? '0.9' : '0.55'}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0A0A0F)',
        }}
      />
    </section>
  )
}
