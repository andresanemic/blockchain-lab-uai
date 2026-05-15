'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const stats = [
  { value: '<2s', label: 'Tiempo de verificación' },
  { value: 'SHA-256', label: 'Algoritmo de hash' },
  { value: '100%', label: 'A prueba de falsificación' },
]

export default function CertHero() {
  const containerRef = useRef<HTMLElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.cert-hero-text > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 })
      tl.from(orbRef.current, { opacity: 0, scale: 0.6, duration: 1.2, ease: 'power2.out' }, 0.2)
      tl.from('.cert-stat', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.5)
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
          right: '-10%',
          transform: 'translateY(-50%)',
          background: 'radial-gradient(circle, #3B5BDB 0%, transparent 70%)',
        }}
      />

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,91,219,0.55) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          opacity: 0.06,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="cert-hero-text max-w-3xl">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#3B5BDB' }}>
            Credenciales Digitales · UAI
          </p>

          <h1 className="font-sans font-extrabold text-[2.1rem] sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-6 text-balance" style={{ color: '#F0F0F5' }}>
            Títulos que no se pueden{' '}
            <span style={{ color: '#3B5BDB' }}>falsificar</span>
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl mb-10" style={{ color: '#9898B0' }}>
            La Universidad Adolfo Ibáñez puede emitir diplomas, títulos y certificados con
            verificación criptográfica instantánea — sin intermediarios, sin llamadas, sin
            posibilidad de alteración.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#demo"
              className="inline-flex items-center px-7 py-3 rounded text-sm font-medium transition-colors duration-200"
              style={{ background: '#3B5BDB', color: '#ffffff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1E2D6B' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#3B5BDB' }}
            >
              Ver demo en vivo
            </a>
            <a
              href="/#contacto"
              className="inline-flex items-center px-7 py-3 rounded text-sm font-medium transition-colors duration-200"
              style={{ border: '1px solid #1E1E2E', color: '#9898B0' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB'; e.currentTarget.style.color = '#3B5BDB' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9898B0' }}
            >
              Hablar con el equipo
            </a>
          </div>
        </div>

        {/* Stat bar */}
        <div className="mt-16 grid grid-cols-3 gap-px" style={{ background: '#1E1E2E' }}>
          {stats.map((s) => (
            <div key={s.value} className="cert-stat flex flex-col gap-1 px-6 py-5" style={{ background: '#0A0A0F' }}>
              <span className="font-mono font-bold text-2xl" style={{ color: '#3B5BDB' }}>
                {s.value}
              </span>
              <span className="text-xs" style={{ color: '#9898B0' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0F)' }}
      />
    </section>
  )
}
