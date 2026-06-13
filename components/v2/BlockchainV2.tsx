'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

const PIN_MULT = 2

const STEPS = [
  {
    title: 'Segura',
    bullets: [
      'Criptografía de clave pública protege cada transacción.',
      'Modificar un registro invalida los bloques posteriores.',
      'La seguridad es estructural, no depende de personas.',
    ],
  },
  {
    title: 'Transparente',
    bullets: [
      'Cualquier nodo audita la historia completa en tiempo real.',
      'Las reglas son públicas y ejecutadas por el protocolo.',
      'El código es la autoridad, sin intermediarios.',
    ],
  },
  {
    title: 'Inmutable',
    bullets: [
      'Lo registrado no puede borrarse ni modificarse.',
      'Cada bloque porta el hash del anterior, cadena inviolable.',
      'Ideal para certificados, contratos y trazabilidad.',
    ],
  },
  {
    title: 'Descentralizada',
    bullets: [
      'Sin servidor central que pueda ser atacado o censurado.',
      'Miles de nodos validan información de forma autónoma.',
      'Opera aunque fallen múltiples nodos: sin punto único de falla.',
    ],
  },
]

function dotShadow(isActive: boolean, isPassed: boolean) {
  if (isActive) return '0 0 0 1px rgba(96,160,255,0.40), 0 0 28px rgba(96,160,255,0.45), 0 4px 16px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.15)'
  if (isPassed) return '0 2px 10px rgba(0,0,0,0.32), inset 0 1px 0 rgba(96,160,255,0.10)'
  return '0 1px 6px rgba(0,0,0,0.22)'
}

export default function BlockchainV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow(true)
  const isMobile = useIsMobile()

  const progressRef   = useRef<HTMLDivElement>(null)
  const stRef         = useRef<gsap.plugins.ScrollTriggerInstance | null>(null)
  const skipRef       = useRef(false)
  const targetStepRef = useRef<number | null>(null)

  const dotRefs       = useRef<(HTMLDivElement     | null)[]>([])
  const lineFillRefs  = useRef<(HTMLDivElement     | null)[]>([])
  const titleRefs     = useRef<(HTMLHeadingElement | null)[]>([])
  const contentRefs   = useRef<(HTMLDivElement     | null)[]>([])

  function activateStep(s: number) {
    STEPS.forEach((_, i) => {
      const isActive = i === s
      const isPassed = i < s
      const isFuture = i > s

      const dot = dotRefs.current[i]
      if (dot) {
        dot.style.width       = isActive ? '38px' : isPassed ? '28px' : '22px'
        dot.style.height      = isActive ? '38px' : isPassed ? '28px' : '22px'
        dot.style.background  = isActive ? '#60A0FF' : isPassed ? 'rgba(96,160,255,0.22)' : 'transparent'
        dot.style.borderColor = isActive ? '#60A0FF' : isPassed ? 'rgba(96,160,255,0.55)' : 'rgba(248,248,244,0.18)'
        dot.style.boxShadow   = dotShadow(isActive, isPassed)
      }

      const title = titleRefs.current[i]
      if (title) {
        title.style.color    = isActive ? '#F8F8F4' : isFuture ? 'rgba(248,248,244,0.22)' : 'rgba(248,248,244,0.48)'
        title.style.fontSize = isActive ? 'clamp(17px, 1.9vw, 26px)' : 'clamp(12px, 1.2vw, 16px)'
      }

          /* Height is instant (no CSS transition) → single synchronous reflow per step.
         Opacity fades separately via transition — no layout impact. */
      const content = contentRefs.current[i]
      if (content) {
        content.style.height        = isActive ? 'auto' : '0'
        content.style.opacity       = isActive ? '1' : '0'
        content.style.pointerEvents = isActive ? 'auto' : 'none'
      }
    })
  }

  function handleDotClick(idx: number) {
    // On mobile there is no pin — just activate the step directly
    if (isMobile) {
      activateStep(idx)
      for (let i = 0; i < STEPS.length - 1; i++) {
        const fill = Math.max(0, Math.min(1, idx - i))
        const inner = lineFillRefs.current[i]
        if (inner) inner.style.transform = `scaleY(${fill})`
      }
      return
    }

    const st = stRef.current
    if (!st) return

    /* Activate with transitions active — dot grows, title expands, content fades in */
    activateStep(idx)

    /* Snap line fills to target position */
    for (let i = 0; i < STEPS.length - 1; i++) {
      const fill = Math.max(0, Math.min(1, idx - i))
      const inner = lineFillRefs.current[i]
      if (inner) inner.style.transform = `scaleY(${fill})`
    }

    skipRef.current       = true
    targetStepRef.current = idx

    const unlock = () => { skipRef.current = false; targetStepRef.current = null }
    const fallback = setTimeout(unlock, 2000)

    const target = st.start + (idx / STEPS.length) * (st.end - st.start) + 1
    const lenis  = (window as any).__lenis
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 0.75,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => { clearTimeout(fallback); unlock() },
      })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  useGSAP(() => {
    const triggerStart = isMobile ? 'top 88%' : 'top 80%'

    gsap.fromTo('.bc-header-line',
      { y: '108%', opacity: 0, filter: 'blur(12px)' },
      { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.25, ease: 'expo.out', stagger: 0.10,
        scrollTrigger: { trigger: sectionRef.current, start: triggerStart } }
    )
    gsap.from('.bc-timeline', {
      y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.15,
      scrollTrigger: { trigger: sectionRef.current, start: triggerStart },
    })

    activateStep(0)

    // Pin and scroll-driven steps — desktop only
    // On mobile the pin causes flashing and layout collapse; dots are tappable instead
    if (!isMobile) {
      gsap.to({}, {
        scrollTrigger: {
          trigger:             sectionRef.current,
          pin:                 true,
          anticipatePin:       1,
          start:               'top top',
          end:                 () => `+=${window.innerHeight * PIN_MULT}`,
          invalidateOnRefresh: true,
          onRefresh(self) { stRef.current = self },
          onUpdate(self) {
            stRef.current = self
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            /* Line fills: continuous, always update regardless of skipRef */
            for (let i = 0; i < STEPS.length - 1; i++) {
              const fill = Math.max(0, Math.min(1, self.progress * STEPS.length - i))
              const inner = lineFillRefs.current[i]
              if (inner) inner.style.transform = `scaleY(${fill})`
            }
            if (skipRef.current) return
            const newStep = Math.min(Math.floor(self.progress * STEPS.length), STEPS.length - 1)
            activateStep(newStep)
          },
        },
      })
    }
  }, { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true })

  return (
    <section
      id="blockchain"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position:    'relative',
        background:  '#080D2B',
        overflow:    'hidden',
        /* Mobile: auto height (no pin) so content never clips or collapses.
           Desktop: fixed 100vh is required for the GSAP pin to work correctly. */
        height:    isMobile ? 'auto' : '100vh',
        minHeight: isMobile ? '100svh' : '600px',
        /* paddingTop/Bottom se controlan en globals.css #blockchain para evitar
           que GSAP revertOnUpdate restaure el valor del primer render (desktop) */
      }}
    >
      <GridGlowLayers dark glowRef={glowRef} gridGlowRef={gridGlowRef} />

      {/* Progress bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 10,
      }}>
        <div ref={progressRef} style={{
          height: '100%', background: '#60A0FF',
          transformOrigin: 'left center', transform: 'scaleX(0)',
        }} />
      </div>

      {/* Main grid */}
      <div style={{
        maxWidth: '1280px',
        margin:   '0 auto',
        width:    '100%',
        padding:  isMobile ? '0 24px' : '0 clamp(24px, 5vw, 80px)',
        position: 'relative',
        zIndex:    3,
        display:   'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap:      isMobile ? '36px' : 'clamp(48px, 8vw, 100px)',
        alignItems: 'start',
        /* On mobile the two columns stack — ensure H2 doesn't stretch */
      }}>

        {/* ── LEFT: header ── */}
        <div className="bc-left" style={{ alignSelf: 'start' }}>
          <h2 style={{
            fontFamily:    DISPLAY, fontWeight: 300,
            fontSize:      isMobile ? 'clamp(36px, 9vw, 56px)' : 'clamp(44px, 6.5vw, 88px)',
            lineHeight:    0.97, letterSpacing: '-0.03em',
            color:         '#F8F8F4', margin: 0,
          }}>
            <div style={{ overflow: 'hidden', lineHeight: 1.04, paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span className="bc-header-line" style={{ display: 'block', transform: 'translateY(108%)', opacity: 0 }}>
                Blockchain hace la
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1.04, paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span className="bc-header-line" style={{ display: 'block', color: '#60A0FF', transform: 'translateY(108%)', opacity: 0 }}>
                confianza
              </span>
            </div>
            <div style={{ overflow: 'hidden', lineHeight: 1.04, paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span className="bc-header-line" style={{ display: 'block', color: '#60A0FF', transform: 'translateY(108%)', opacity: 0 }}>
                verificable.
              </span>
            </div>
          </h2>
        </div>

        {/* ── RIGHT: timeline ── */}
        <div className="bc-timeline" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Step navigation — dots + titles only, fixed layout */}
          {STEPS.map((step, i) => {
            const isFirst = i === 0
            return (
              <div key={step.title} style={{ display: 'flex', gap: '22px' }}>

                {/* Dot column */}
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', width: '40px', flexShrink: 0,
                }}>
                  <div
                    ref={el => { dotRefs.current[i] = el }}
                    onClick={() => handleDotClick(i)}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.18)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
                    style={{
                      width:        isFirst ? '38px' : '22px',
                      height:       isFirst ? '38px' : '22px',
                      borderRadius: '50%',
                      background:   isFirst ? '#60A0FF' : 'transparent',
                      border:       `1.5px solid ${isFirst ? '#60A0FF' : 'rgba(248,248,244,0.18)'}`,
                      boxShadow:    dotShadow(isFirst, false),
                      flexShrink:   0,
                      cursor:       'pointer',
                      transition: [
                        'width 0.75s cubic-bezier(0.33,1,0.68,1)',
                        'height 0.75s cubic-bezier(0.33,1,0.68,1)',
                        'background 0.65s',
                        'border-color 0.65s',
                        'box-shadow 0.65s',
                        'transform 1.8s cubic-bezier(0.33,1,0.68,1)',
                      ].join(', '),
                    }}
                  />

                  {i < STEPS.length - 1 && (
                    <div style={{
                      flex:       '1',
                      width:      '1.5px',
                      minHeight:  'clamp(36px, 4.5vh, 52px)',
                      marginTop:  '7px',
                      background: 'rgba(255,255,255,0.10)',
                      position:   'relative',
                      overflow:   'hidden',
                    }}>
                      <div
                        ref={el => { lineFillRefs.current[i] = el }}
                        style={{
                          position:        'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background:      '#60A0FF',
                          transformOrigin: 'top center',
                          transform:       'scaleY(0)',
                          boxShadow:       '0 0 6px rgba(96,160,255,0.55)',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Title + collapsible content */}
                <div style={{
                  flex:          1,
                  paddingBottom: i < STEPS.length - 1 ? 'clamp(20px, 2.8vh, 32px)' : 0,
                  paddingTop:    '2px',
                }}>
                  <h3
                    ref={el => { titleRefs.current[i] = el }}
                    onClick={() => handleDotClick(i)}
                    style={{
                      fontFamily:    MONO,
                      fontWeight:    400,
                      fontSize:      isFirst ? 'clamp(17px, 1.9vw, 26px)' : 'clamp(12px, 1.2vw, 16px)',
                      lineHeight:    1.1,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color:         isFirst ? '#F8F8F4' : 'rgba(248,248,244,0.22)',
                      margin:        0,
                      cursor:        'pointer',
                      transition:    'color 0.65s cubic-bezier(0.33,1,0.68,1), font-size 0.75s cubic-bezier(0.33,1,0.68,1)',
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Height is instant (no transition), opacity fades — zero ongoing reflow */}
                  <div
                    ref={el => { contentRefs.current[i] = el }}
                    style={{
                      overflow:      'hidden',
                      height:        isFirst ? 'auto' : '0',
                      opacity:       isFirst ? 1 : 0,
                      pointerEvents: isFirst ? 'auto' : 'none',
                      transition:    'opacity 0.65s cubic-bezier(0.33,1,0.68,1)',
                    }}
                  >
                    <ul style={{
                      listStyle: 'none', padding: 0,
                      margin:    '14px 0 16px',
                      display:   'flex', flexDirection: 'column', gap: '9px',
                    }}>
                      {step.bullets.map((bullet, bi) => (
                        <li key={bi} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                          <span style={{
                            width: '4px', height: '4px', borderRadius: '50%',
                            background: '#60A0FF', flexShrink: 0, marginTop: '6px',
                            boxShadow: '0 0 5px rgba(96,160,255,0.55)',
                          }} />
                          <span style={{
                            fontFamily: BODY,
                            fontSize:   'clamp(11px, 0.95vw, 13px)',
                            color:      'rgba(248,248,244,0.62)',
                            lineHeight: 1.65,
                          }}>
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#"
                      onClick={e => e.preventDefault()}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.color = '#60A0FF'
                        el.style.letterSpacing = '0.13em'
                        el.style.textDecorationColor = 'rgba(96,160,255,0.70)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.color = 'rgba(96,160,255,0.65)'
                        el.style.letterSpacing = '0.09em'
                        el.style.textDecorationColor = 'rgba(96,160,255,0.30)'
                      }}
                      style={{
                        fontFamily:          MONO, fontSize: '9px',
                        color:               'rgba(96,160,255,0.65)',
                        letterSpacing:       '0.09em', textTransform: 'uppercase',
                        textDecoration:      'underline',
                        textUnderlineOffset: '4px',
                        textDecorationColor: 'rgba(96,160,255,0.30)',
                        cursor:              'pointer',
                        display:             'inline-block',
                        transition:          'color 0.25s, letter-spacing 0.35s cubic-bezier(0.33,1,0.68,1), text-decoration-color 0.25s',
                      }}
                    >
                      Revisa nuestra documentación →
                    </a>
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
