'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const capabilities = [
  {
    label: 'Investigación aplicada',
    detail: 'Rigor académico + ejecución real',
  },
  {
    label: 'Prototipado rápido',
    detail: 'De concepto a MVP en semanas',
  },
  {
    label: 'Despliegue en producción',
    detail: 'Soluciones que operan en el mundo real',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.about-line', {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.out',
        transformOrigin: 'left center',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      })
      gsap.from('.about-eyebrow', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.from('.about-headline', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from('.about-body', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.from('.about-cap', {
        x: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(59,91,219,0.55) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          opacity: 0.09,
        }}
      />

      {/* Large decorative background word */}
      <div
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
        style={{
          fontSize: 'clamp(140px, 20vw, 300px)',
          color: '#3B5BDB',
          opacity: 0.04,
          letterSpacing: '-0.04em',
        }}
      >
        UAI
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-12">
          <div
            className="about-line h-px w-10"
            style={{ background: '#3B5BDB' }}
          />
          <span
            className="about-eyebrow font-mono text-xs tracking-[0.25em] uppercase"
            style={{ color: '#3B5BDB' }}
          >
            Quiénes Somos
          </span>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-14 items-start">
          {/* Left: headline + text */}
          <div>
            <h2
              className="about-headline font-extrabold leading-[1.06] mb-8"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
                color: '#F0F0F5',
              }}
            >
              Donde la academia
              <br />
              <span style={{ color: '#3B5BDB' }}>construye</span> soluciones
              <br />
              de impacto real.
            </h2>

            <p
              className="about-body text-lg leading-relaxed"
              style={{ color: '#9898B0', maxWidth: '520px' }}
            >
              Laboratorio de investigación aplicada de la Universidad Adolfo
              Ibáñez. Diseñamos, prototipamos y desplegamos soluciones
              descentralizadas para organizaciones públicas y privadas.
            </p>
          </div>

          {/* Right: capability cards */}
          <div className="flex flex-col gap-3 pt-2">
            {capabilities.map(({ label, detail }) => (
              <div
                key={label}
                className="about-cap p-5 rounded-sm flex items-start gap-4 transition-colors duration-200"
                style={{
                  background: '#111118',
                  borderTop: '1px solid #1E1E2E',
                  borderRight: '1px solid #1E1E2E',
                  borderBottom: '1px solid #1E1E2E',
                  borderLeft: '3px solid #3B5BDB',
                }}
              >
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: '#F0F0F5' }}
                  >
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: '#5A5A72' }}>
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
