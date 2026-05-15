'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import {
  Landmark,
  GraduationCap,
  HeartPulse,
  HandHeart,
  Building2,
  Truck,
  Users,
} from 'lucide-react'

const row1 = [
  { icon: Landmark, label: 'Sector financiero' },
  { icon: GraduationCap, label: 'Educación y certificaciones' },
  { icon: HeartPulse, label: 'Salud y trazabilidad' },
  { icon: HandHeart, label: 'Fundaciones y ONG' },
]

const row2 = [
  { icon: Building2, label: 'Sector público' },
  { icon: Truck, label: 'Supply chain' },
  { icon: Users, label: 'Recursos humanos' },
]

const marqueeItems = [
  'Investigar aplicaciones económicas',
  'Diseñar soluciones descentralizadas',
  'Conectar academia, industria y sector público',
  'Promover nuevos modelos de gobernanza',
  'Acelerar adopción de tecnologías emergentes',
]
const marqueeText = marqueeItems.join('  ·  ') + '  ·  '

function Pill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div
      className="impact-pill flex items-center gap-3 px-5 py-3 rounded border text-sm transition-colors duration-200"
      style={{ borderColor: '#1E1E2E', background: 'transparent', color: '#9898B0' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3B5BDB'
        e.currentTarget.style.color = '#F0F0F5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1E1E2E'
        e.currentTarget.style.color = '#9898B0'
      }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  )
}

export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.impact-pill', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      style={{ background: '#111118' }}
      className="py-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Impacto Esperado
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Transformación de industrias{' '}
            <span style={{ color: '#3B5BDB' }}>y sectores</span>
          </h2>
        </div>

        {/* Sector pills — two centered rows */}
        <div className="flex flex-col items-center gap-3 mb-16">
          <div className="flex flex-wrap justify-center gap-3">
            {row1.map((s) => <Pill key={s.label} {...s} />)}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {row2.map((s) => <Pill key={s.label} {...s} />)}
          </div>
        </div>
      </div>

      {/* Scrolling marquee — hidden on mobile */}
      <div
        className="hidden sm:block border-t border-b py-6 -mx-6"
        style={{ borderColor: '#1E1E2E' }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-xl font-light shrink-0"
              style={{ color: '#9898B0' }}
            >
              {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
