'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { ArrowRight, Mail } from 'lucide-react'

export default function ContactV2() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.contact-v2', {
        y: 52,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="contacto"
      ref={sectionRef}
      style={{
        background: '#0e0e0e',
        padding: 'clamp(96px, 16vh, 160px) clamp(20px, 4vw, 48px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="contact-v2">
        <p
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-jetbrains-mono)',
            color: 'rgba(59,91,219,0.65)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Contacto
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, var(--font-inter))',
            fontWeight: 300,
            fontSize: 'clamp(44px, 7vw, 96px)',
            letterSpacing: '-0.03em',
            color: '#f2f0ed',
            lineHeight: 1.0,
            marginBottom: '44px',
            maxWidth: '680px',
          }}
        >
          Trabajemos
          <br />
          juntos.
        </h2>

        <a
          href="mailto:blockchain@uai.cl"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: 'clamp(16px, 2.2vw, 26px)',
            color: '#3B5BDB',
            textDecoration: 'none',
            fontFamily: 'var(--font-jetbrains-mono)',
            marginBottom: '52px',
            transition: 'gap 0.2s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.gap = '18px'
            e.currentTarget.style.color = '#5577e8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.gap = '10px'
            e.currentTarget.style.color = '#3B5BDB'
          }}
        >
          <Mail size={22} />
          blockchain@uai.cl
          <ArrowRight size={20} />
        </a>

        <div>
          <a
            href="mailto:blockchain@uai.cl"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 38px',
              background: '#3B5BDB',
              color: '#f2f0ed',
              fontSize: '12px',
              fontFamily: 'var(--font-jetbrains-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '7px',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2d4ac7'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3B5BDB'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Enviar mensaje <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
