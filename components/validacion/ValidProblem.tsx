'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { FileQuestion, VideoOff, ShieldOff } from 'lucide-react'

const challenges = [
  {
    icon: FileQuestion,
    title: 'Origen cuestionable',
    desc: 'Un abogado defensor puede argumentar que no sabemos de dónde proviene el video. Sin trazabilidad técnica del dispositivo, la procedencia es solo una declaración.',
    via: 'Vía de impugnación 1',
  },
  {
    icon: VideoOff,
    title: 'Video potencialmente editado',
    desc: 'Las herramientas de IA generativa permiten alterar video de forma indetectable a simple vista. Sin hash criptográfico previo a la edición, la integridad no puede probarse.',
    via: 'Vía de impugnación 2',
  },
  {
    icon: ShieldOff,
    title: 'Cadena de custodia rota',
    desc: 'Si el archivo pasó por manos humanas antes de ser presentado como prueba, la defensa puede alegar manipulación. Las grabaciones de dron hoy no tienen un mecanismo robusto de custodia.',
    via: 'Vía de impugnación 3',
  },
]

export default function ValidProblem() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.valid-prob-card', {
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
            Una grabación de dron puede ser{' '}
            <span style={{ color: '#3B5BDB' }}>impugnada por tres vías</span>
          </h2>
          <p className="mt-5 text-base max-w-2xl leading-relaxed" style={{ color: '#9898B0' }}>
            La industria forestal chilena usa drones para vigilar zonas de difícil acceso, pero las
            grabaciones obtenidas carecen de un mecanismo de verificación suficientemente robusto
            para ser presentadas en tribunal sin ser cuestionadas.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {challenges.map(({ icon: Icon, title, desc, via }) => (
            <div
              key={title}
              className="valid-prob-card p-7 rounded flex flex-col gap-5"
              style={{
                background: '#0A0A0F',
                border: '1px solid #2A2A3C',
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,91,219,0.55)'
                e.currentTarget.style.boxShadow = '0 0 28px rgba(59,91,219,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A3C'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="flex items-start justify-between">
                <Icon className="w-6 h-6" style={{ color: '#9898B0' }} strokeWidth={1.5} />
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded"
                  style={{ background: 'rgba(59,91,219,0.1)', color: '#3B5BDB', border: '1px solid rgba(59,91,219,0.2)' }}
                >
                  {via}
                </span>
              </div>
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
