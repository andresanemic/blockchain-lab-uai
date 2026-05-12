'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const members = [
  {
    initials: 'GTO',
    name: 'Giacomo Tomasoni Orozco',
    title: 'Jefe de Vinculación I+D',
    color1: '#3B5BDB',
    color2: '#1E2D6B',
  },
  {
    initials: 'FT',
    name: 'Francisco Toro',
    title: 'Investigador, Sistemas Descentralizados',
    color1: '#2A4BC7',
    color2: '#0D1A50',
  },
  {
    initials: 'PG',
    name: 'Pablo Guzmán',
    title: 'Transformación Digital',
    color1: '#3B5BDB',
    color2: '#C9A84C',
  },
  {
    initials: 'AP',
    name: 'Andrés Peña',
    title: 'Investigador y operaciones',
    color1: '#4A6FE8',
    color2: '#1A3A7A',
  },
]

function Avatar({
  initials,
  color1,
  color2,
}: {
  initials: string
  color1: string
  color2: string
}) {
  const id = `grad-${initials}`
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill={`url(#${id})`} />
      <text
        x="40"
        y="45"
        textAnchor="middle"
        fontFamily="var(--font-inter, sans-serif)"
        fontSize={initials.length > 2 ? '14' : '18'}
        fontWeight="700"
        fill="rgba(240,240,245,0.95)"
      >
        {initials}
      </text>
    </svg>
  )
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>('.team-card')
    )
    if (!cards.length) return

    gsap.set(cards, { opacity: 0, y: 40 })

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.14,
          ease: 'power3.out',
        })
      },
    })

    return () => {
      trigger.kill()
      gsap.set(cards, { clearProps: 'all' })
    }
  }, [])

  return (
    <section
      id="equipo"
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: '#111118' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: '#3B5BDB' }}
          >
            Equipo
          </p>
          <h2
            className="text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ color: '#F0F0F5' }}
          >
            Las personas detrás del{' '}
            <span style={{ color: '#3B5BDB' }}>Lab</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div
              key={m.name}
              className="team-card p-8 rounded flex flex-col items-start gap-5"
              style={{
                background: '#0A0A0F',
                border: '1px solid #2A2A3C',
                transition: 'transform 0.25s, border-color 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(59,91,219,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#2A2A3C'
              }}
            >
              <Avatar
                initials={m.initials}
                color1={m.color1}
                color2={m.color2}
              />
              <div>
                <p
                  className="font-semibold text-sm mb-1 leading-snug"
                  style={{ color: '#F0F0F5' }}
                >
                  {m.name}
                </p>
                <p
                  className="text-xs leading-snug"
                  style={{ color: '#9898B0' }}
                >
                  {m.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
