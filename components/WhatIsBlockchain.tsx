'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Shield, Eye, Lock, Network } from 'lucide-react'

const features = [
  {
    icon: Shield,
    label: 'Segura',
    desc: 'Criptografía de extremo a extremo en cada transacción',
  },
  {
    icon: Eye,
    label: 'Transparente',
    desc: 'Registro público y auditable por cualquier participante',
  },
  {
    icon: Lock,
    label: 'Inmutable',
    desc: 'Los datos confirmados no pueden alterarse ni borrarse',
  },
  {
    icon: Network,
    label: 'Descentralizada',
    desc: 'Sin punto único de fallo ni autoridad central',
  },
]

export default function WhatIsBlockchain() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.wib-left', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from('.wib-pill', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.from('.wib-tagline', {
        opacity: 0,
        duration: 0.9,
        scrollTrigger: { trigger: '.wib-tagline', start: 'top 85%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      style={{ background: '#111118' }}
      className="py-20 px-6"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-10">
        {/* Left */}
        <div className="wib-left">
          <p className="font-mono text-xs tracking-[0.25em] text-uai-accent uppercase mb-4">
            Tecnología
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-uai-text-primary leading-tight mb-6">
            Infraestructura para la{' '}
            <span className="text-uai-accent">confianza digital</span>
          </h2>
          <p className="text-uai-text-secondary leading-relaxed">
            La Blockchain es una base de datos distribuida que registra
            transacciones de forma criptográficamente verificada entre múltiples
            participantes. Sin intermediarios: el protocolo garantiza la
            integridad. Transparencia, trazabilidad y ejecución automática de
            acuerdos como propiedades nativas del sistema.
          </p>
        </div>

        {/* Right: feature pills 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="wib-pill p-5 rounded border flex flex-col gap-3"
              style={{
                background: 'rgba(10,10,15,0.6)',
                borderColor: '#1E1E2E',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Icon className="w-5 h-5 text-uai-accent" strokeWidth={1.5} />
              <div>
                <p className="font-semibold text-uai-text-primary text-sm mb-1">
                  {label}
                </p>
                <p className="text-xs text-uai-text-secondary leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p className="wib-tagline text-center font-mono text-uai-text-muted italic text-base tracking-wide max-w-2xl mx-auto">
        &ldquo;Elimina intermediarios. Crea confianza.&rdquo;
      </p>
    </section>
  )
}
