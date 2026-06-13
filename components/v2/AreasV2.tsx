'use client'

import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY = 'var(--font-inter)'
const MONO = 'var(--font-jetbrains-mono, monospace)'

const areas = [
  { num: '01', tag: 'DeFi',   title: 'Finanzas Descentralizadas',  desc: 'Servicios financieros sin bancos intermediarios.' },
  { num: '02',                 title: 'Gobernanza Digital',         desc: 'Decisiones colectivas transparentes y verificables.' },
  { num: '03',                 title: 'Tokenización de Activos',    desc: 'Representar bienes reales como activos digitales.' },
  { num: '04',                 title: 'Identidad Digital',          desc: 'Identidades autosoberanas y verificables.' },
  { num: '05',                 title: 'Smart Contracts',            desc: 'Acuerdos que se ejecutan solos, sin terceros.' },
  { num: '06',                 title: 'Trazabilidad y Auditoría',   desc: 'Registro inmutable de cada operación.' },
  { num: '07', tag: 'RUC-D',  title: 'Recursos Compartidos',       desc: 'Recursos únicos compartidos descentralizados.' },
]


export default function AreasV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow(true)
  const [hovered, setHovered] = useState<number | null>(null)
  const isMobile = useIsMobile()

  useGSAP(() => {
    gsap.from('.area-row', {
      y: 28, opacity: 0,
      duration: 0.8, ease: 'expo.out', stagger: 0.055,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="areas"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: isMobile ? '48px 0' : 'clamp(96px, 14vh, 128px) 0',
        scrollMarginTop: '12px',
        /* Dark overlay baked into backgroundImage gradient — no extra div competing for z-index */
        backgroundImage: 'linear-gradient(rgba(4,6,20,0.58), rgba(4,6,20,0.58)), url(/areas-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Grid + glow — no overlay div competing for z-index */}
      <GridGlowLayers dark glowRef={glowRef} gridGlowRef={gridGlowRef} />

      {/* Ghost numbers */}
      {areas.map((area, i) => (
        <div key={area.num} aria-hidden style={{
          position: 'absolute', right: 'clamp(-60px, -4vw, -20px)', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: DISPLAY, fontWeight: 700,
          fontSize: 'clamp(220px, 34vw, 480px)',
          lineHeight: 1, letterSpacing: '-0.06em',
          color: 'rgba(96,160,255,0.07)',
          userSelect: 'none', pointerEvents: 'none',
          opacity: hovered === i ? 1 : 0,
          transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 4,
        }}>{area.num}</div>
      ))}

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>

        {/* Meta row */}
        <div style={{
          padding: '0 clamp(24px, 5vw, 64px)',
          marginBottom: '20px',
        }}>
          <span style={{ fontFamily: MONO, fontSize: '14px', color: 'rgba(248,248,244,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Áreas de trabajo
          </span>
        </div>

        {/* List — each row has a fixed height: description is absolute so section never grows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {areas.map((area, i) => {
            const isActive = hovered === i
            const isDimmed = hovered !== null && !isActive

            return (
              <div
                key={area.num}
                className="area-row"
                onMouseEnter={() => !isMobile && setHovered(i)}
                onMouseLeave={() => !isMobile && setHovered(null)}
                onClick={() => isMobile && setHovered(prev => prev === i ? null : i)}
                style={{
                  position: 'relative',
                  padding: `0 clamp(24px, 5vw, 64px)`,
                  opacity: isDimmed ? 0.28 : 1,
                  cursor: isMobile ? 'pointer' : 'default',
                  boxShadow: isActive ? 'inset 3px 0 0 #60A0FF' : 'inset 3px 0 0 transparent',
                  transition: 'opacity 0.4s ease, box-shadow 0.3s ease',
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '40px 1fr' : '64px 1fr auto',
                  alignItems: 'start',
                  gap: isMobile ? '0 16px' : '0 32px',
                  padding: isMobile ? '14px 0' : '14px 0 36px',
                }}>
                  {/* Index */}
                  <span style={{
                    fontFamily: MONO, fontSize: isMobile ? '12px' : '16px', letterSpacing: '0.08em',
                    color: isActive ? '#60A0FF' : 'rgba(248,248,244,0.38)',
                    transition: 'color 0.3s',
                    display: 'block', lineHeight: 1,
                    paddingTop: '3px',
                  }}>{area.num}</span>

                  {/* Title + description */}
                  <div>
                    <p style={{
                      fontFamily: DISPLAY, fontWeight: 400,
                      fontSize: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(18px, 2.1vw, 30px)',
                      color: isActive ? '#60A0FF' : '#F8F8F4',
                      lineHeight: 1.1, letterSpacing: '-0.02em',
                      margin: 0,
                      transform: isActive ? 'translateX(10px)' : 'translateX(0)',
                      transition: 'color 0.3s, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}>{area.title}</p>

                    {/* Description: inline on mobile (no overlap), absolute on desktop */}
                    {isMobile ? (
                      <div style={{
                        overflow: 'hidden',
                        maxHeight: isActive ? '60px' : '0',
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? '6px' : '0',
                        transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease, margin-top 0.3s ease',
                      }}>
                        <p style={{
                          fontFamily: BODY, fontSize: '12px',
                          color: 'rgba(248,248,244,0.55)', lineHeight: 1.55,
                          margin: 0,
                        }}>{area.desc}</p>
                      </div>
                    ) : (
                      <p style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: `calc(clamp(24px, 5vw, 64px) + 96px)`,
                        right: `clamp(24px, 5vw, 64px)`,
                        fontFamily: BODY, fontSize: '12.5px',
                        color: 'rgba(248,248,244,0.55)', lineHeight: 1.6,
                        margin: 0,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(10px)' : 'translateX(0)',
                        transition: 'opacity 0.3s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                        pointerEvents: 'none',
                      }}>{area.desc}</p>
                    )}
                  </div>

                  {/* Tag — hidden on mobile (col removed from grid) */}
                  <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {area.tag && (
                      <span style={{
                        fontFamily: MONO, fontSize: '12px', color: '#60A0FF',
                        border: '1px solid rgba(96,160,255,0.40)',
                        padding: '5px 12px', borderRadius: '4px',
                        letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                        boxShadow: '0 0 0 1px rgba(96,160,255,0.20), 0 0 12px rgba(96,160,255,0.18), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)',
                      }}>{area.tag}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
