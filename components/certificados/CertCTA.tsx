'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export default function CertCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-cta-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="grain relative py-24 px-6 overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Radial glow */}
      <div
        className="orb w-[700px] h-[700px] opacity-[0.08]"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #3B5BDB 0%, transparent 65%)',
        }}
      />

      <div className="cert-cta-content relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: '#3B5BDB' }}>
          Implementación
        </p>

        <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight" style={{ color: '#F0F0F5' }}>
          Implementemos esto juntos
        </h2>

        <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#9898B0' }}>
          El Blockchain Lab UAI puede diseñar, prototipar e implementar el sistema de
          certificación digital para la Universidad Adolfo Ibáñez.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <a
            href="mailto:blockchain@uai.cl"
            className="inline-flex items-center px-8 py-3 rounded text-sm font-medium transition-colors duration-200"
            style={{ background: '#3B5BDB', color: '#ffffff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1E2D6B' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#3B5BDB' }}
          >
            Iniciar conversación
          </a>
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 rounded text-sm font-medium transition-colors duration-200"
            style={{ border: '1px solid #1E1E2E', color: '#9898B0' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB'; e.currentTarget.style.color = '#3B5BDB' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9898B0' }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </section>
  )
}
