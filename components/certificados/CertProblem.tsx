'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { FileX, AlertTriangle, ShieldOff } from 'lucide-react'

const problems = [
  {
    icon: FileX,
    title: 'Sin verificación real',
    desc: 'Un título compartido digitalmente no puede confirmarse sin contactar directamente a la institución. Un proceso que demora días o semanas.',
  },
  {
    icon: AlertTriangle,
    title: 'Falsificación creciente',
    desc: 'La producción de documentos falsos escala junto con la IA generativa. Las credenciales impresas no ofrecen ninguna defensa técnica.',
  },
  {
    icon: ShieldOff,
    title: 'Legitimidad solo reputacional',
    desc: 'Las universidades tienen autoridad para certificar la verdad. Pero esa autoridad hoy descansa en el papel, no en infraestructura verificable.',
  },
]

export default function CertProblem() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-prob-card', {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
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
            El Problema
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Un título en papel no tiene forma{' '}
            <span style={{ color: '#3B5BDB' }}>de probarse a distancia</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {problems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="cert-prob-card p-7 rounded flex flex-col gap-5"
              style={{ background: '#0A0A0F', border: '1px solid #2A2A3C', transition: 'border-color 0.25s, box-shadow 0.25s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,91,219,0.55)'
                e.currentTarget.style.boxShadow = '0 0 28px rgba(59,91,219,0.13)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A3C'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Icon className="w-6 h-6" style={{ color: '#9898B0' }} strokeWidth={1.5} />
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
