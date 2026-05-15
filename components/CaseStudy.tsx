'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const paragraphs = [
  'La Cardano Foundation y la Universidad de Brasilia (UnB) formalizaron una alianza para crear el primer laboratorio Cardano de América Latina. El espacio combinará blockchain, inteligencia artificial, IoT e identidad digital, con foco explícito en soluciones para el sector público.',
  'El laboratorio integrará blockchain en los programas académicos de pregrado, posgrado y educación ejecutiva, y servirá como hub regional para startups, gobierno y sector privado. Las áreas prioritarias son identidad digital, integridad de datos y gestión de cadenas de suministro.',
  'Para el Blockchain Lab UAI, este es exactamente el modelo: una universidad con vínculos institucionales profundos, un laboratorio con foco en casos de uso reales y una red que irradia hacia toda la región.',
]

export default function CaseStudy() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.casestudy-img', {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.from('.casestudy-text', {
        x: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
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
      <div className="max-w-7xl mx-auto">
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mb-12"
          style={{ color: '#3B5BDB' }}
        >
          Academia + Blockchain: modelo a replicar
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="casestudy-img rounded-lg overflow-hidden" style={{ border: '1px solid #1E1E2E' }}>
            <Image
              src="/image-12.webp"
              alt="Cardano Foundation × Universidad de Brasilia — primer laboratorio Cardano en América Latina"
              width={0}
              height={0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto"
            />
          </div>

          {/* Text */}
          <div className="casestudy-text flex flex-col gap-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed"
                style={{
                  color: i === paragraphs.length - 1 ? '#F0F0F5' : '#9898B0',
                  borderLeft: i === paragraphs.length - 1 ? '2px solid #3B5BDB' : undefined,
                  paddingLeft: i === paragraphs.length - 1 ? '1rem' : undefined,
                  fontStyle: i === paragraphs.length - 1 ? 'italic' : undefined,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
