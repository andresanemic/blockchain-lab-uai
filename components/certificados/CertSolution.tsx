'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Shield, Eye, Lock, Zap } from 'lucide-react'

const pills = [
  { icon: Shield, title: 'Inmutable', desc: 'Ningún actor puede alterar el registro una vez inscrito' },
  { icon: Eye, title: 'Verificable', desc: 'Cualquiera puede comprobar la autenticidad en segundos' },
  { icon: Lock, title: 'Soberano', desc: 'El egresado controla quién accede a su credencial' },
  { icon: Zap, title: 'Instantáneo', desc: 'Verificación sin llamadas, sin esperas, sin burocracia' },
]

export default function CertSolution() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-sol-text > *', {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
      gsap.from('.cert-sol-pill', {
        x: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            La Solución
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Credenciales con{' '}
            <span style={{ color: '#3B5BDB' }}>verificación criptográfica</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: body text */}
          <div className="cert-sol-text flex flex-col gap-5">
            <p className="text-base leading-relaxed" style={{ color: '#9898B0' }}>
              El hash del documento queda inscrito permanentemente en la cadena —
              inmutable, auditable, verificable por cualquier persona en segundos.
            </p>
            <p className="text-base leading-relaxed" style={{ color: '#9898B0' }}>
              La UAI puede emitir títulos, diplomas y certificados que cualquier empleador,
              institución o plataforma puede verificar de forma instantánea, sin intermediarios
              y sin depender del equipo de registros académicos.
            </p>
          </div>

          {/* Right: 2×2 feature pills */}
          <div className="grid grid-cols-2 gap-4">
            {pills.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="cert-sol-pill p-5 rounded flex flex-col gap-3"
                style={{ background: '#111118', border: '1px solid #1E1E2E' }}
              >
                <div
                  className="w-9 h-9 rounded flex items-center justify-center"
                  style={{ background: '#1E2D6B' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#F0F0F5' }}>{title}</p>
                  <p className="text-xs leading-snug" style={{ color: '#9898B0' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
