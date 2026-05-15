'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const benefits = [
  {
    n: '01',
    title: 'Reducción de costos operacionales',
    desc: 'Elimina el proceso manual de emisión, autenticación notarial y respuesta a solicitudes de verificación desde empleadores o instituciones extranjeras.',
  },
  {
    n: '02',
    title: 'Protección reputacional',
    desc: 'Una credencial falsificada que usa el nombre de la UAI daña la institución. La blockchain hace que la falsificación sea técnicamente imposible de pasar desapercibida.',
  },
  {
    n: '03',
    title: 'Liderazgo regional',
    desc: 'Posiciona a la UAI como la primera universidad chilena en ofrecer títulos con verificación criptográfica nativa, alineada con la dirección global de las credenciales digitales.',
  },
]

export default function CertBenefits() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-ben-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#111118' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Beneficios Institucionales
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Por qué implementarlo{' '}
            <span style={{ color: '#3B5BDB' }}>en la UAI</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ n, title, desc }) => (
            <div
              key={n}
              className="cert-ben-card p-7 rounded flex flex-col gap-4"
              style={{ background: '#0A0A0F', border: '1px solid #2A2A3C' }}
            >
              <span className="font-mono font-bold text-4xl leading-none" style={{ color: '#1E2D6B' }}>
                {n}
              </span>
              <div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#F0F0F5' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9898B0' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
