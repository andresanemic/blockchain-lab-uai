'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const steps = [
  {
    n: '01',
    title: 'Identificación del problema',
    desc: 'Diagnóstico del desafío organizacional',
  },
  {
    n: '02',
    title: 'Diseño del caso de uso',
    desc: 'Modelado de la solución blockchain',
  },
  {
    n: '03',
    title: 'Validación técnica y económica',
    desc: 'Evaluación de viabilidad y ROI',
  },
  {
    n: '04',
    title: 'Desarrollo de piloto / MVP',
    desc: 'Construcción e iteración rápida',
  },
  {
    n: '05',
    title: 'Escalabilidad y acompañamiento',
    desc: 'Despliegue y soporte continuo',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGLineElement>(null)

  useGSAP(
    () => {
      gsap.from('.proc-step', {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })

      if (lineRef.current) {
        const len = 1100
        gsap.set(lineRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        })
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
        })
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: '#0A0A0F' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] text-uai-accent uppercase mb-4">
            Metodología
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-uai-text-primary">
            Del problema al{' '}
            <span className="text-uai-accent">MVP</span>
          </h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* SVG connector line */}
          <svg
            className="absolute top-[22px] left-0 w-full"
            height="2"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            <line
              ref={lineRef}
              x1="80"
              y1="1"
              x2="1060"
              y2="1"
              stroke="#1E1E2E"
              strokeWidth="1.5"
            />
          </svg>

          <div className="relative z-10 grid grid-cols-5 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="proc-step flex flex-col items-center text-center gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white shrink-0"
                  style={{ background: '#3B5BDB' }}
                >
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-uai-text-primary text-sm leading-snug mb-1">
                    {s.title}
                  </p>
                  <p className="text-xs text-uai-text-secondary leading-snug">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={s.n} className="proc-step flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white shrink-0"
                  style={{ background: '#3B5BDB' }}
                >
                  {s.n}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-px flex-1 mt-2 mb-2"
                    style={{ background: '#1E1E2E', minHeight: '40px' }}
                  />
                )}
              </div>
              <div className="pb-8">
                <p className="font-semibold text-uai-text-primary text-sm leading-snug mb-1 pt-2">
                  {s.title}
                </p>
                <p className="text-xs text-uai-text-secondary leading-snug">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
