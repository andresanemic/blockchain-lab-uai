'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const references = [
  {
    name: 'MIT',
    desc: 'Emite diplomas digitales verificables en blockchain desde 2017 mediante el estándar Blockcerts.',
  },
  {
    name: 'Universidad de Brasilia',
    desc: 'Firmó alianza con Cardano Foundation en 2026 para emitir credenciales académicas on-chain en América Latina.',
  },
  {
    name: 'Hyperledger Fabric',
    desc: 'Estándar open-source adoptado por gobiernos y universidades para credenciales educativas verificables a escala.',
  },
]

export default function CertSocialProof() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-ref-card', {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
      gsap.from('.cert-quote', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#111118' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Contexto Global
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Las instituciones líderes ya van{' '}
            <span style={{ color: '#3B5BDB' }}>en esta dirección</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {references.map(({ name, desc }) => (
            <div
              key={name}
              className="cert-ref-card p-7 rounded"
              style={{ background: '#0A0A0F', border: '1px solid #1E1E2E' }}
            >
              <p className="font-bold text-sm mb-3" style={{ color: '#F0F0F5' }}>{name}</p>
              <p className="text-sm leading-relaxed" style={{ color: '#9898B0' }}>{desc}</p>
            </div>
          ))}
        </div>

        <blockquote
          className="cert-quote max-w-3xl mx-auto text-center text-base italic leading-relaxed"
          style={{ color: '#9898B0' }}
        >
          "En un mundo donde confiar en lo que se lee requiere esfuerzo consciente, que la
          universidad pueda decir 'esto es verificable' con infraestructura real — no solo con
          prestigio — cambia todo."
        </blockquote>
      </div>
    </section>
  )
}
