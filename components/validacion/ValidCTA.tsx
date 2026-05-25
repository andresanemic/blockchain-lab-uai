'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export default function ValidCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.valid-cta-content > *', {
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
      style={{ background: '#111118' }}
    >
      <div
        className="orb w-[700px] h-[700px] opacity-[0.07]"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #3B5BDB 0%, transparent 65%)',
        }}
      />

      <div className="valid-cta-content relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: '#3B5BDB' }}>
          Prueba de Concepto
        </p>

        <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight" style={{ color: '#F0F0F5' }}>
          Desarrollemos el piloto juntos
        </h2>

        <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#9898B0' }}>
          El Blockchain Lab UAI tiene la capacidad técnica e institucional para diseñar,
          implementar y certificar una prueba de concepto del Protocolo RUC-D para la
          industria forestal chilena.
        </p>

        <div
          className="w-full max-w-xl p-6 rounded text-left"
          style={{ background: '#0A0A0F', border: '1px solid #1E1E2E' }}
        >
          <p className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: '#5A5A72' }}>
            El piloto incluiría
          </p>
          <ul className="flex flex-col gap-2.5">
            {[
              'Despliegue del Smart Contract en blockchain de prueba',
              'Integración con canal de streaming del consorcio',
              'Certificación del firmware del dron bajo el protocolo',
              'Escritura notarial del protocolo y gobernanza multi-firma',
              'Validación con Ministerio Público o asesoría legal especializada',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: '#9898B0' }}>
                <span
                  className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: '#1E2D6B' }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3B5BDB', display: 'block' }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

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
