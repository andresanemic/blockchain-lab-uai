'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const items = [
  'Investigar aplicaciones económicas',
  'Diseñar soluciones descentralizadas',
  'Conectar academia, industria y sector público',
  'Promover nuevos modelos de gobernanza',
  'Acelerar adopción de tecnologías emergentes',
]

const marqueeText = items.join('  ·  ') + '  ·  '

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(headRef.current!.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="mision"
      ref={sectionRef}
      className="py-20 overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      <div ref={headRef} className="text-center px-6 mb-16">
        <p className="font-mono text-xs tracking-[0.25em] text-uai-accent uppercase mb-4">
          Nuestra Misión
        </p>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-uai-text-primary">
          Impulsar innovación con{' '}
          <span className="text-uai-accent">impacto real</span>
        </h2>
      </div>

      {/* Marquee */}
      <div
        className="border-t border-b py-6"
        style={{ borderColor: '#1E1E2E' }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-2xl font-light text-uai-text-secondary mx-0 shrink-0"
            >
              {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
