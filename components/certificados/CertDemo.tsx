'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { Check, Phone } from 'lucide-react'

const STEPS = ['Participante', 'NFT', 'Emisión', 'On-chain', 'Certificado']

const participants = [
  { name: 'María Fernández Rojas', phone: '+56 9 8821 4432', wallet: 'GPART1X7K...M2N9' },
  { name: 'Carlos Herrera Vidal', phone: '+56 9 7734 8821', wallet: 'GPART2R3P...X4Q8' },
  { name: 'Ana Luz Jiménez Torres', phone: '+56 9 6643 2217', wallet: 'GPART3N1T...R6W2' },
]

const COURSE = {
  nombre: 'Innovación y Blockchain · Ed. 2026',
  periodo: 'Mar 2026 — May 2026',
  institucion: 'Universidad Adolfo Ibáñez',
  firmante: 'GUAI1J9K...L3M7 · Blockchain Lab UAI',
}

const HASH = 'a3f8b2c1d4e9f2a7b8c3d6e1f4a7b2c5'

const logs = [
  { text: '📝 Generando metadata del NFT…', delay: 0 },
  { text: `✓ Hash SHA-256: ${HASH}…`, delay: 700 },
  { text: '🔐 Firmando con wallet institucional UAI…', delay: 1400 },
  { text: '⬡ [MINT] NFT creado en contrato Soroban…', delay: 2100 },
  { text: '⬡ [TRANSFER] Wallet UAI → wallet del participante…', delay: 2900 },
  { text: '⬡ [LEDGER ENTRY] Confirmado · Bloque #9.182.445', delay: 3700 },
  { text: '✅ Certificado emitido · 8.3s · Costo: $0.008 USD', delay: 4400 },
]

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold"
        style={{ background: '#1E2D6B', color: '#3B5BDB' }}
      >
        B
      </div>
      <div
        className="flex-1 p-4 rounded text-sm leading-relaxed"
        style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', color: '#9898B0' }}
      >
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div
        className="px-4 py-3 rounded text-sm"
        style={{ background: '#1E2D6B', color: '#F0F0F5', maxWidth: '70%' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function CertDemo() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<typeof participants[0] | null>(null)
  const [visibleLogs, setVisibleLogs] = useState(0)

  useEffect(() => {
    if (step !== 3) return
    setVisibleLogs(0)
    const timers = logs.map((log, i) =>
      setTimeout(() => setVisibleLogs(i + 1), log.delay)
    )
    const advance = setTimeout(() => setStep(4), logs[logs.length - 1].delay + 800)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(advance)
    }
  }, [step])

  function handleSelect(p: typeof participants[0]) {
    setSelected(p)
    setTimeout(() => setStep(1), 500)
  }

  function reset() {
    setStep(0)
    setSelected(null)
    setVisibleLogs(0)
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <section id="demo" className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Demo Interactivo
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Chatbot de emisión{' '}
            <span style={{ color: '#3B5BDB' }}>UAI</span>
          </h2>
          <p className="mt-4 text-base" style={{ color: '#9898B0' }}>
            Simulación del flujo desde el punto de vista del operador. Selecciona un participante
            y observa cómo el sistema genera, firma y registra el certificado NFT en Stellar.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>
          {/* Window bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#FF5F57' }} />
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#FEBC2E' }} />
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#28C840' }} />
            <span className="flex-1 text-center font-mono text-xs" style={{ color: '#5A5A72' }}>
              Chatbot UAI — Emisión de Certificados NFT
            </span>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0"
              style={{ background: 'rgba(40,200,64,0.15)', color: '#28C840', border: '1px solid rgba(40,200,64,0.3)' }}
            >
              ● Stellar Testnet
            </span>
          </div>

          {/* Sidebar + chat */}
          <div className="flex" style={{ minHeight: '520px' }}>
            {/* Sidebar */}
            <div
              className="shrink-0 flex flex-col py-6 gap-1"
              style={{ width: '120px', background: '#0A0A0F', borderRight: '1px solid #1E1E2E' }}
            >
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => { if (i < step) setStep(i) }}
                  className="flex items-center gap-2 px-3 py-2 text-left transition-colors w-full"
                  style={{
                    fontSize: '11px',
                    color: i === step ? '#F0F0F5' : i < step ? '#3B5BDB' : '#5A5A72',
                    background: i === step ? '#1E1E2E' : 'transparent',
                    cursor: i < step ? 'pointer' : 'default',
                  }}
                >
                  {i < step ? (
                    <Check className="w-3 h-3 shrink-0" style={{ color: '#3B5BDB' }} />
                  ) : (
                    <span
                      className="w-3 h-3 rounded-full shrink-0 border flex-none"
                      style={{
                        borderColor: i === step ? '#3B5BDB' : '#1E1E2E',
                        background: i === step ? '#3B5BDB' : 'transparent',
                      }}
                    />
                  )}
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">

                {/* Step 0 — Select participant */}
                {step === 0 && (
                  <>
                    <BotBubble>
                      Chatbot UAI listo. Selecciona el participante para emitir su certificado NFT,
                      o ingresa su número de WhatsApp.
                    </BotBubble>
                    <div className="flex flex-col gap-2 mt-1">
                      {participants.map((p) => (
                        <button
                          key={p.phone}
                          onClick={() => handleSelect(p)}
                          className="flex items-center gap-4 p-4 rounded text-left w-full transition-colors"
                          style={{ background: '#0A0A0F', border: '1px solid #1E1E2E' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E' }}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: '#1E2D6B' }}
                          >
                            <Phone className="w-4 h-4" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
                              {p.name}
                            </p>
                            <p className="text-xs font-mono mt-0.5" style={{ color: '#5A5A72' }}>
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
                      <p className="mb-3">
                        Wallet Soroban del participante verificada. Estos son los datos que quedarán
                        registrados permanentemente en el NFT:
                      </p>
                      <div className="rounded overflow-hidden" style={{ border: '1px solid #1E1E2E' }}>
                        <div
                          className="px-4 py-2 flex items-center gap-2"
                          style={{ background: '#111118', borderBottom: '1px solid #1E1E2E' }}
                        >
                          <span className="font-mono text-xs font-bold" style={{ color: '#3B5BDB' }}>NFT</span>
                          <span className="font-mono text-xs" style={{ color: '#5A5A72' }}>· Metadata on-chain</span>
                        </div>
                        <div className="p-4 flex flex-col gap-2.5">
                          {([
                            ['Participante', selected.name],
                            ['Wallet Soroban', selected.wallet],
                            ['Curso', COURSE.nombre],
                            ['Período', COURSE.periodo],
                            ['Institución', COURSE.institucion],
                            ['Hash SHA-256', `${HASH}…`],
                            ['Firmante UAI', COURSE.firmante],
                          ] as [string, string][]).map(([k, v]) => (
                            <div key={k} className="flex gap-3 text-xs">
                              <span
                                className="shrink-0"
                                style={{ color: '#5A5A72', minWidth: '96px' }}
                              >
                                {k}
                              </span>
                              <span className="font-mono break-all" style={{ color: '#F0F0F5' }}>
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </BotBubble>
                    <button
                      onClick={() => setStep(2)}
                      className="self-start mt-1 px-6 py-3 rounded text-sm font-medium transition-colors"
                      style={{ background: '#3B5BDB', color: '#F0F0F5' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1E2D6B' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3B5BDB' }}
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
                      <p className="mb-4">
                        Listo para emitir. La transacción firmará el NFT con la wallet institucional
                        UAI y lo transferirá a la wallet Soroban del participante. Esta operación no
                        puede revertirse.
                      </p>
                      <div
                        className="flex items-center gap-3 p-4 rounded"
                        style={{ background: '#111118', border: '1px solid #1E1E2E' }}
                      >
                        <div className="flex flex-col items-center text-center gap-1 flex-1">
                          <p className="font-mono text-[10px]" style={{ color: '#5A5A72' }}>
                            WALLET UAI
                          </p>
                          <p className="font-mono text-xs" style={{ color: '#3B5BDB' }}>
                            GUAI1J9K...L3M7
                          </p>
                          <p className="text-[10px]" style={{ color: '#5A5A72' }}>
                            Emisor · Firmante
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <span
                            className="font-mono text-xs px-2 py-0.5 rounded"
                            style={{ background: 'rgba(59,91,219,0.15)', color: '#3B5BDB' }}
                          >
                            NFT →
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1 flex-1">
                          <p className="font-mono text-[10px]" style={{ color: '#5A5A72' }}>
                            WALLET PARTICIPANTE
                          </p>
                          <p className="font-mono text-xs" style={{ color: '#3B5BDB' }}>
                            {selected.wallet}
                          </p>
                          <p className="text-[10px]" style={{ color: '#5A5A72' }}>
                            {selected.name}
                          </p>
                        </div>
                      </div>
                    </BotBubble>
                    <button
                      onClick={() => setStep(3)}
                      className="self-start mt-1 px-6 py-3 rounded text-sm font-medium transition-colors"
                      style={{ background: '#3B5BDB', color: '#F0F0F5' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1E2D6B' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3B5BDB' }}
                    >
                      Firmar y emitir NFT en Stellar →
                    </button>
                  </>
                )}

                {/* Step 3 — Processing: 3 on-chain events */}
                {step === 3 && (
                  <>
                    <UserBubble>Confirmar emisión.</UserBubble>
                    <BotBubble>
                      <p className="mb-3">Iniciando emisión en Stellar Testnet…</p>
                      <div className="flex flex-col gap-1.5">
                        {logs.slice(0, visibleLogs).map((log, i) => (
                          <p
                            key={i}
                            className="font-mono text-xs"
                            style={{
                              color: log.text.startsWith('✅')
                                ? '#28C840'
                                : log.text.includes('[MINT]') ||
                                  log.text.includes('[TRANSFER]') ||
                                  log.text.includes('[LEDGER')
                                ? '#3B5BDB'
                                : '#9898B0',
                            }}
                          >
                            {log.text}
                          </p>
                        ))}
                      </div>
                    </BotBubble>
                  </>
                )}

                {/* Step 4 — Certificate issued */}
                {step === 4 && selected && (
                  <div
                    className="p-6 rounded flex flex-col gap-5"
                    style={{ background: '#0A0A0F', border: '1px solid rgba(40,200,64,0.3)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(40,200,64,0.15)' }}
                      >
                        <Check className="w-5 h-5" style={{ color: '#28C840' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#F0F0F5' }}>
                          Certificado NFT emitido en Stellar
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#5A5A72' }}>
                          3 eventos on-chain · Inmutable · Verificable públicamente
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      {([
                        ['Participante', selected.name],
                        ['Wallet receptora', selected.wallet],
                        ['Curso', COURSE.nombre],
                        ['Hash SHA-256', `${HASH}…`],
                        ['Bloque', '#9.182.445'],
                        ['Hash TX', '7f4c2a91e8b3d5f6…a219'],
                        ['Timestamp', timestamp],
                        ['Red', 'Stellar Testnet'],
                        ['Eventos on-chain', 'MINT · TRANSFER · LEDGER ENTRY'],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} className="flex gap-4">
                          <span style={{ color: '#5A5A72', minWidth: '104px' }}>{k}</span>
                          <span className="font-mono" style={{ color: '#F0F0F5' }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1">
                      <a
                        href="#"
                        className="px-5 py-2 rounded text-xs transition-colors"
                        style={{ border: '1px solid #1E1E2E', color: '#9898B0' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB'; e.currentTarget.style.color = '#3B5BDB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9898B0' }}
                      >
                        Ver en Stellar Expert →
                      </a>
                      <button
                        onClick={reset}
                        className="px-5 py-2 rounded text-xs transition-colors"
                        style={{ border: '1px solid #1E1E2E', color: '#9898B0' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB'; e.currentTarget.style.color = '#3B5BDB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E'; e.currentTarget.style.color = '#9898B0' }}
                      >
                        Reiniciar demo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: '1px solid #1E1E2E', background: '#0A0A0F' }}
              >
                <input
                  readOnly
                  placeholder="Chatbot UAI · Modo operador…"
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: '#5A5A72' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
