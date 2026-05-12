'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cta-content > *', {
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
      id="contacto"
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

      <div className="cta-content relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="font-mono text-xs tracking-[0.25em] text-uai-accent uppercase">
          Colaboremos
        </p>

        <h2 className="text-4xl lg:text-6xl font-extrabold text-uai-text-primary leading-tight">
          Co-creemos soluciones reales
        </h2>

        <p className="text-uai-text-secondary text-lg leading-relaxed max-w-xl">
          Invitamos a empresas, fundaciones e instituciones a colaborar junto
          al Blockchain Lab UAI.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <a
            href="mailto:blockchain@uai.cl"
            className="inline-flex items-center px-8 py-3 rounded bg-uai-accent hover:bg-uai-accent-muted text-white text-sm font-medium transition-colors duration-200"
          >
            Iniciar conversación
          </a>
          <a
            href="#areas"
            className="inline-flex items-center px-8 py-3 rounded border border-uai-border text-uai-text-secondary hover:border-uai-accent hover:text-uai-accent text-sm font-medium transition-colors duration-200"
          >
            Ver áreas de trabajo
          </a>
        </div>
      </div>
    </section>
  )
}
