'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Check, Phone } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

/* ── Data ─────────────────────────────────────────────────────────────── */

const STEPS = ['Participante', 'Certificado', 'Confirmación', 'Emisión', 'Resultado']

const PARTICIPANTS = [
  { name: 'María Fernández Rojas',   phone: '+56 9 8821 4432', wallet: 'GPART1X7K...M2N9' },
  { name: 'Carlos Herrera Vidal',    phone: '+56 9 7734 8821', wallet: 'GPART2R3P...X4Q8' },
  { name: 'Ana Luz Jiménez Torres',  phone: '+56 9 6643 2217', wallet: 'GPART3N1T...R6W2' },
]

const COURSE = {
  nombre:      'Innovación y Blockchain · Ed. 2026',
  periodo:     'Mar 2026 — May 2026',
  institucion: 'Universidad Adolfo Ibáñez',
  firmante:    'GUAI1J9K...L3M7 · Blockchain Lab UAI',
}

const HASH = 'a3f8b2c1d4e9f2a7b8c3d6e1f4a7b2c5'

const LOGS = [
  { text: '📝 Generando metadata del certificado…',              delay: 0    },
  { text: `✓ Hash SHA-256: ${HASH}…`,                           delay: 700  },
  { text: '🔐 Firmando con wallet institucional UAI…',           delay: 1400 },
  { text: '⬡ [MINT] Certificado acuñado en contrato inteligente…', delay: 2100 },
  { text: '⬡ [TRANSFER] UAI → wallet del participante…',        delay: 2900 },
  { text: '⬡ [LEDGER ENTRY] Confirmado · Bloque #9.182.445',    delay: 3700 },
  { text: '✅ Certificado emitido · 8.3s · Costo: $0.008 USD',   delay: 4400 },
]

/* ── Bubble atoms ─────────────────────────────────────────────────────── */

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: 'rgba(0,87,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, color: '#0057FF' }}>B</span>
      </div>
      <div style={{
        flex: 1, padding: '12px 14px', borderRadius: '8px',
        background: 'rgba(8,13,43,0.04)', border: '1px solid rgba(8,13,43,0.08)',
        fontSize: '13px', fontFamily: BODY, color: 'rgba(8,13,43,0.65)', lineHeight: 1.6,
      }}>
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        padding: '10px 14px', borderRadius: '8px',
        background: '#0057FF', color: '#F8F8F4',
        fontSize: '13px', fontFamily: BODY, maxWidth: '70%',
      }}>
        {children}
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────────── */

export default function CertDemoV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const isMobile = useIsMobile()

  const [step,        setStep]        = useState(0)
  const [selected,    setSelected]    = useState<typeof PARTICIPANTS[0] | null>(null)
  const [visibleLogs, setVisibleLogs] = useState(0)
  const [fading,      setFading]      = useState(false)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function changeStep(next: number) {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setFading(true)
    fadeTimer.current = setTimeout(() => {
      setStep(next)
      setFading(false)
    }, 320)
  }

  useEffect(() => {
    if (step !== 3) return
    setVisibleLogs(0)
    const timers = LOGS.map((log, i) => setTimeout(() => setVisibleLogs(i + 1), log.delay))
    const advance = setTimeout(() => changeStep(4), LOGS[LOGS.length - 1].delay + 800)
    return () => { timers.forEach(clearTimeout); clearTimeout(advance) }
  }, [step])

  function handleSelect(p: typeof PARTICIPANTS[0]) {
    setSelected(p)
    setTimeout(() => changeStep(1), 400)
  }

  function reset() {
    setSelected(null); setVisibleLogs(0); changeStep(0)
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  useGSAP(() => {
    gsap.fromTo('.cert-demo-heading',
      { opacity: 0, y: 64 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' } }
    )
    gsap.fromTo('.cert-demo-artefact',
      { opacity: 0, y: 48, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' } }
    )
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        padding: isMobile
          ? '48px 24px 40px'
          : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: '1280px', margin: '0 auto' }}>
        {/* Heading */}
        <div className="cert-demo-heading" style={{ marginBottom: isMobile ? '32px' : '48px', opacity: 0 }}>
          <p style={{
            fontFamily: MONO, fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(8,13,43,0.38)', marginBottom: '16px',
          }}>
            Demo interactivo
          </p>
          <h2 style={{
            fontFamily: DISPLAY, fontWeight: 300,
            fontSize: isMobile ? 'clamp(32px, 8vw, 48px)' : 'clamp(44px, 6.5vw, 88px)',
            lineHeight: 0.97, letterSpacing: '-0.03em', color: '#080D2B', margin: 0,
          }}>
            {isMobile
              ? <>Chatbot de <span style={{ color: '#0057FF' }}>emisión UAI.</span></>
              : <>Chatbot de<br /><span style={{ color: '#0057FF' }}>emisión UAI.</span></>
            }
          </h2>
        </div>

        {/* Artefact */}
        <div
          className="cert-demo-artefact"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(8,13,43,0.10)',
            boxShadow: '0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.16), 0 40px 80px rgba(8,13,43,0.12), 0 0 0 1px rgba(8,13,43,0.06)',
            display: 'flex', flexDirection: 'column',
            height: isMobile ? 'auto' : 'clamp(480px, 60vh, 580px)',
            minHeight: isMobile ? '520px' : 'auto',
            opacity: 0,
          }}
        >
          {/* Window bar */}
          <div style={{
            background: '#F7F8FA',
            padding: '12px 16px 10px',
            borderBottom: '1px solid rgba(8,13,43,0.07)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57', flexShrink: 0 }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E', flexShrink: 0 }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840', flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: '11px', color: 'rgba(8,13,43,0.30)' }}>
              Chatbot UAI — Emisión de Certificados
            </span>
            <span style={{
              fontFamily: MONO, fontSize: '9px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
              background: 'rgba(22,163,74,0.10)', color: '#16a34a',
              border: '1px solid rgba(22,163,74,0.25)',
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>
              ● Testnet
            </span>
          </div>

          {/* Sidebar + chat */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Sidebar — hidden on mobile */}
            {!isMobile && (
              <div style={{
                width: '160px', flexShrink: 0,
                background: '#F7F8FA',
                borderRight: '1px solid rgba(8,13,43,0.07)',
                display: 'flex', flexDirection: 'column', padding: '8px 0',
              }}>
                {STEPS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => { if (i < step) changeStep(i) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', fontSize: '11px', fontFamily: MONO,
                      textAlign: 'left', width: '100%', border: 'none', cursor: i < step ? 'pointer' : 'default',
                      color: i === step ? '#080D2B' : i < step ? '#0057FF' : 'rgba(8,13,43,0.32)',
                      background: i === step ? 'rgba(0,87,255,0.07)' : 'transparent',
                      borderLeft: i === step ? '2px solid #0057FF' : '2px solid transparent',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {i < step ? (
                      <Check style={{ width: '11px', height: '11px', color: '#0057FF', flexShrink: 0 }} strokeWidth={2.5} />
                    ) : (
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                        border: `1.5px solid ${i === step ? '#0057FF' : 'rgba(8,13,43,0.20)'}`,
                        background: i === step ? '#0057FF' : 'transparent',
                        display: 'block',
                      }} />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#FFFFFF' }}>
              <div style={{
                flex: 1,
                padding: isMobile ? '16px' : '20px',
                display: 'flex', flexDirection: 'column', gap: '14px',
                overflowY: 'auto',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.32s ease',
              }}>

                {/* Step 0 — Select participant */}
                {step === 0 && (
                  <>
                    <BotBubble>
                      Chatbot UAI listo. Selecciona el participante para emitir su certificado, o ingresa su número de WhatsApp.
                    </BotBubble>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                      {PARTICIPANTS.map((p) => (
                        <button
                          key={p.phone}
                          onClick={() => handleSelect(p)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '12px 14px', borderRadius: '8px', textAlign: 'left',
                            width: '100%', cursor: 'pointer',
                            background: '#FFFFFF', border: '1px solid rgba(8,13,43,0.10)',
                            transition: 'border-color 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,87,255,0.30)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(8,13,43,0.10)' }}
                        >
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                            background: 'rgba(0,87,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Phone style={{ width: '14px', height: '14px', color: '#0057FF' }} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', fontFamily: BODY, fontWeight: 500, color: '#080D2B', margin: 0 }}>
                              {p.name}
                            </p>
                            <p style={{ fontSize: '11px', fontFamily: MONO, color: 'rgba(8,13,43,0.38)', margin: '3px 0 0' }}>
                              {p.phone} · Wallet: {p.wallet}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 1 — NFT metadata preview */}
                {step === 1 && selected && (
                  <>
                    <UserBubble>{selected.name} — {selected.phone}</UserBubble>
                    <BotBubble>
                      <p style={{ marginBottom: '10px' }}>
                        Wallet del participante verificada. Estos son los datos que quedarán registrados permanentemente en el certificado:
                      </p>
                      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(8,13,43,0.08)' }}>
                        <div style={{
                          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                          background: '#F7F8FA', borderBottom: '1px solid rgba(8,13,43,0.08)',
                        }}>
                          <span style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, color: '#0057FF' }}>CERT</span>
                          <span style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(8,13,43,0.35)' }}>· Metadata on-chain</span>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#FFFFFF' }}>
                          {([
                            ['Participante',  selected.name],
                            ['Wallet',        selected.wallet],
                            ['Curso',         COURSE.nombre],
                            ['Período',       COURSE.periodo],
                            ['Institución',   COURSE.institucion],
                            ['Hash SHA-256',  `${HASH}…`],
                            ['Firmante UAI',  COURSE.firmante],
                          ] as [string, string][]).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', gap: '12px', fontSize: '11px', minWidth: 0 }}>
                              <span style={{ color: 'rgba(8,13,43,0.38)', fontFamily: BODY, flexShrink: 0, minWidth: '80px' }}>{k}</span>
                              <span style={{ fontFamily: MONO, color: '#080D2B', wordBreak: 'break-word', minWidth: 0 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </BotBubble>
                    <button
                      onClick={() => changeStep(2)}
                      style={{
                        alignSelf: 'flex-start', padding: '10px 18px', borderRadius: '6px',
                        background: '#0057FF', color: '#F8F8F4', border: 'none', cursor: 'pointer',
                        fontFamily: MONO, fontSize: '12px', letterSpacing: '0.08em',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      Confirmar datos →
                    </button>
                  </>
                )}

                {/* Step 2 — Confirm emission */}
                {step === 2 && selected && (
                  <>
                    <UserBubble>Datos confirmados.</UserBubble>
                    <BotBubble>
                      <p style={{ marginBottom: '12px' }}>
                        Listo para emitir. La transacción firmará el certificado con la wallet institucional UAI y lo transferirá al participante. Esta operación no puede revertirse.
                      </p>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '14px',
                        borderRadius: '8px', background: '#F7F8FA', border: '1px solid rgba(8,13,43,0.08)',
                        flexDirection: isMobile ? 'column' : 'row',
                      }}>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                          <p style={{ fontFamily: MONO, fontSize: '9px', color: 'rgba(8,13,43,0.38)', margin: 0 }}>WALLET UAI</p>
                          <p style={{ fontFamily: MONO, fontSize: '11px', color: '#0057FF', margin: 0, wordBreak: 'break-all' }}>GUAI1J9K...L3M7</p>
                          <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.35)', margin: 0 }}>Emisor · Firmante</p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <span style={{
                            fontFamily: MONO, fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                            background: 'rgba(0,87,255,0.08)', color: '#0057FF',
                          }}>
                            CERT →
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                          <p style={{ fontFamily: MONO, fontSize: '9px', color: 'rgba(8,13,43,0.38)', margin: 0 }}>WALLET PARTICIPANTE</p>
                          <p style={{ fontFamily: MONO, fontSize: '11px', color: '#0057FF', margin: 0, wordBreak: 'break-all' }}>{selected.wallet}</p>
                          <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.35)', margin: 0, wordBreak: 'break-word' }}>{selected.name}</p>
                        </div>
                      </div>
                    </BotBubble>
                    <button
                      onClick={() => changeStep(3)}
                      style={{
                        alignSelf: 'flex-start', padding: '10px 18px', borderRadius: '6px',
                        background: '#0057FF', color: '#F8F8F4', border: 'none', cursor: 'pointer',
                        fontFamily: MONO, fontSize: '12px', letterSpacing: '0.08em',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      Firmar y emitir certificado →
                    </button>
                  </>
                )}

                {/* Step 3 — Processing */}
                {step === 3 && (
                  <>
                    <UserBubble>Confirmar emisión.</UserBubble>
                    <BotBubble>
                      <p style={{ marginBottom: '10px' }}>Iniciando emisión en blockchain…</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {LOGS.slice(0, visibleLogs).map((log, i) => (
                          <p key={i} style={{
                            fontFamily: MONO, fontSize: '11px', margin: 0,
                            color: log.text.startsWith('✅')
                              ? '#16a34a'
                              : (log.text.includes('[MINT]') || log.text.includes('[TRANSFER]') || log.text.includes('[LEDGER'))
                              ? '#0057FF'
                              : 'rgba(8,13,43,0.55)',
                          }}>
                            {log.text}
                          </p>
                        ))}
                      </div>
                    </BotBubble>
                  </>
                )}

                {/* Step 4 — Certificate issued */}
                {step === 4 && selected && (
                  <div style={{
                    padding: '20px', borderRadius: '10px',
                    border: '1px solid rgba(22,163,74,0.28)',
                    background: 'rgba(22,163,74,0.04)',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(22,163,74,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check style={{ width: '17px', height: '17px', color: '#16a34a' }} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: '14px', color: '#080D2B', margin: 0 }}>
                          Certificado emitido en blockchain
                        </p>
                        <p style={{ fontSize: '11px', fontFamily: BODY, color: 'rgba(8,13,43,0.45)', margin: '3px 0 0' }}>
                          3 eventos on-chain · Inmutable · Verificable públicamente
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {([
                        ['Participante',      selected.name],
                        ['Wallet receptora',  selected.wallet],
                        ['Curso',             COURSE.nombre],
                        ['Hash SHA-256',      `${HASH}…`],
                        ['Bloque',            '#9.182.445'],
                        ['Hash TX',           '7f4c2a91e8b3d5f6…a219'],
                        ['Timestamp',         timestamp],
                        ['Eventos on-chain',  'MINT · TRANSFER · LEDGER ENTRY'],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: '12px', fontSize: '11px', minWidth: 0 }}>
                          <span style={{ color: 'rgba(8,13,43,0.38)', fontFamily: BODY, minWidth: '80px', flexShrink: 0 }}>{k}</span>
                          <span style={{ fontFamily: MONO, color: '#080D2B', wordBreak: 'break-word', minWidth: 0 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a href="#"
                        style={{
                          padding: '8px 14px', borderRadius: '6px', fontSize: '11px',
                          fontFamily: MONO, textDecoration: 'none',
                          border: '1px solid rgba(8,13,43,0.14)', color: 'rgba(8,13,43,0.50)',
                          transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,87,255,0.30)'; e.currentTarget.style.color = '#0057FF' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(8,13,43,0.14)'; e.currentTarget.style.color = 'rgba(8,13,43,0.50)' }}
                      >
                        Ver en explorador →
                      </a>
                      <button onClick={reset} style={{
                        padding: '8px 14px', borderRadius: '6px', fontSize: '11px',
                        fontFamily: MONO, cursor: 'pointer',
                        border: '1px solid rgba(8,13,43,0.14)', color: 'rgba(8,13,43,0.50)',
                        background: 'transparent', transition: 'border-color 0.2s, color 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,87,255,0.30)'; e.currentTarget.style.color = '#0057FF' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(8,13,43,0.14)'; e.currentTarget.style.color = 'rgba(8,13,43,0.50)' }}
                      >
                        Reiniciar demo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px', flexShrink: 0,
                borderTop: '1px solid rgba(8,13,43,0.07)',
                background: '#F7F8FA',
              }}>
                <input
                  readOnly
                  placeholder="Chatbot UAI · Modo operador…"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: MONO, fontSize: '11px', color: 'rgba(8,13,43,0.30)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
