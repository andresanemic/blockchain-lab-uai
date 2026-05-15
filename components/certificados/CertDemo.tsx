'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { Check, Upload, FileText } from 'lucide-react'

const STEPS = ['Subir', 'Firmante', 'Acceso', 'Registrar', 'Resultado']

const wallets = [
  { name: 'Facultad de Ingeniería y Ciencias', address: 'GUAI1...X7K9M', network: 'Stellar' },
  { name: 'Escuela de Negocios UAI', address: 'GUAI2...N2PQR', network: 'Stellar' },
  { name: 'Rectoría UAI', address: 'GUAI3...H5TLV', network: 'Stellar' },
]

const perms = [
  { label: 'Egresado — María José Rodríguez', address: 'GSTUDENT...X4M2K' },
  { label: 'Empleador — empresa verificadora', address: 'GEMPRESA...N2PQR' },
  { label: 'MINEDUC — Ministerio de Educación', address: 'GMINEDUC...Q9VWR' },
  { label: 'Público (cualquiera puede verificar)', address: 'Sin wallet requerida' },
]

const logs = [
  { text: '🔐 Generando hash SHA-256 del documento…', delay: 0 },
  { text: '✓ Hash generado: a3f8b2c1…f5a7', delay: 900 },
  { text: '⬡ Conectando con Stellar Testnet vía Soroban…', delay: 1500 },
  { text: '📝 Transmitiendo transacción al ledger…', delay: 2400 },
  { text: '🔗 Configurando permisos para 2 cuentas…', delay: 3200 },
  { text: '✅ Transacción confirmada · Bloque #8.447.291', delay: 4000 },
]

function AiBubble({ children }: { children: ReactNode }) {
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
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])
  const [visibleLogs, setVisibleLogs] = useState(0)

  // Animate processing logs and auto-advance to result
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

  function handleUpload() {
    setTimeout(() => setStep(1), 900)
  }

  function handleWallet(name: string) {
    setSelectedWallet(name)
    setTimeout(() => setStep(2), 600)
  }

  function togglePerm(label: string) {
    setSelectedPerms((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    )
  }

  function reset() {
    setStep(0)
    setSelectedWallet(null)
    setSelectedPerms([])
    setVisibleLogs(0)
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <section id="demo" className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Demo en Vivo
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Pruébalo{' '}
            <span style={{ color: '#3B5BDB' }}>tú mismo</span>
          </h2>
          <p className="mt-4 text-base" style={{ color: '#9898B0' }}>
            Sube un documento, configura el acceso y observa cómo queda registrado en la
            blockchain — en tiempo real.
          </p>
        </div>

        {/* Demo window */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1E1E2E', background: '#111118' }}>

          {/* macOS top bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#FF5F57' }} />
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#FEBC2E' }} />
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#28C840' }} />
            <span className="flex-1 text-center font-mono text-xs" style={{ color: '#5A5A72' }}>
              Agente de Certificación UAI
            </span>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0"
              style={{ background: 'rgba(40,200,64,0.15)', color: '#28C840', border: '1px solid rgba(40,200,64,0.3)' }}
            >
              ● Testnet activa
            </span>
          </div>

          {/* Body: sidebar + chat */}
          <div className="flex" style={{ minHeight: '500px' }}>

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

                {/* Step 0 — Upload */}
                {step === 0 && (
                  <>
                    <AiBubble>
                      Hola. Soy el agente de certificación del Blockchain Lab UAI. Te ayudaré a
                      registrar un título o certificado en la blockchain con prueba criptográfica
                      de autenticidad. Tu documento nunca se almacena — solo su huella digital.
                      Para comenzar, sube el documento que deseas certificar.
                    </AiBubble>
                    <button
                      onClick={handleUpload}
                      className="self-start mt-2 flex flex-col items-center justify-center gap-3 p-8 rounded w-full sm:w-auto sm:min-w-[280px] transition-colors"
                      style={{ border: '2px dashed #1E2D6B' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E2D6B' }}
                    >
                      <Upload className="w-8 h-8" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
                      <span className="text-sm font-medium text-center" style={{ color: '#F0F0F5' }}>
                        Arrastra tu archivo aquí o busca
                      </span>
                      <span className="text-xs" style={{ color: '#5A5A72' }}>
                        PDF, DOCX, PNG — máx. 50MB
                      </span>
                    </button>
                  </>
                )}

                {/* Step 1 — Wallet selection */}
                {step === 1 && (
                  <>
                    <UserBubble>Aquí está mi documento.</UserBubble>
                    <AiBubble>
                      <div
                        className="mb-4 p-4 rounded flex items-center gap-4"
                        style={{ background: '#111118', border: '1px solid #1E1E2E' }}
                      >
                        <FileText className="w-8 h-8 shrink-0" style={{ color: '#3B5BDB' }} strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#F0F0F5' }}>
                            titulo_ingenieria_comercial_2025.pdf
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#5A5A72' }}>
                            1.8 MB · PDF · Cargado ahora
                          </p>
                        </div>
                        <span
                          className="text-xs px-2 py-1 rounded shrink-0"
                          style={{ background: 'rgba(59,91,219,0.15)', color: '#3B5BDB' }}
                        >
                          ✓ Listo
                        </span>
                      </div>
                      Documento recibido. ¿Qué unidad académica emitirá este certificado? Esta
                      será la firma criptográfica del documento en la cadena.
                    </AiBubble>
                    <div className="flex flex-col gap-2 mt-1">
                      {wallets.map((w) => (
                        <button
                          key={w.name}
                          onClick={() => handleWallet(w.name)}
                          className="flex items-center justify-between p-4 rounded text-left w-full transition-colors"
                          style={{ background: '#0A0A0F', border: '1px solid #1E1E2E' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B5BDB' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E2E' }}
                        >
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#F0F0F5' }}>{w.name}</p>
                            <p className="text-xs mt-0.5 font-mono" style={{ color: '#5A5A72' }}>
                              {w.address} · {w.network}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2 — Permissions */}
                {step === 2 && (
                  <>
                    <UserBubble>Usaré {selectedWallet}.</UserBubble>
                    <AiBubble>
                      Firmante configurado:{' '}
                      <code
                        className="font-mono text-xs px-1 py-0.5 rounded"
                        style={{ background: '#1E1E2E', color: '#3B5BDB' }}
                      >
                        GUAI2...N2PQR
                      </code>
                      . ¿Quién puede verificar este documento? Tú controlas el acceso — nadie más
                      puede verificarlo sin tu autorización.
                    </AiBubble>
                    <div className="flex flex-col gap-2 mt-1">
                      {perms.map((p) => {
                        const checked = selectedPerms.includes(p.label)
                        return (
                          <button
                            key={p.label}
                            onClick={() => togglePerm(p.label)}
                            className="flex items-center gap-3 p-4 rounded text-left w-full transition-colors"
                            style={{
                              background: checked ? 'rgba(59,91,219,0.1)' : '#0A0A0F',
                              border: `1px solid ${checked ? '#3B5BDB' : '#1E1E2E'}`,
                            }}
                          >
                            <span
                              className="w-4 h-4 rounded shrink-0 flex items-center justify-center"
                              style={{
                                background: checked ? '#3B5BDB' : 'transparent',
                                border: `1px solid ${checked ? '#3B5BDB' : '#1E1E2E'}`,
                              }}
                            >
                              {checked && <Check className="w-3 h-3" style={{ color: '#fff' }} />}
                            </span>
                            <div>
                              <p className="text-sm" style={{ color: '#F0F0F5' }}>{p.label}</p>
                              <p className="text-xs font-mono mt-0.5" style={{ color: '#5A5A72' }}>
                                {p.address}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="mt-3 w-full sm:w-auto px-6 py-3 rounded text-sm font-medium transition-colors"
                      style={{ background: '#3B5BDB', color: '#F0F0F5' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1E2D6B' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3B5BDB' }}
                    >
                      Confirmar y registrar en blockchain →
                    </button>
                  </>
                )}

                {/* Step 3 — Processing */}
                {step === 3 && (
                  <>
                    <UserBubble>Otorgar acceso y registrar.</UserBubble>
                    <AiBubble>
                      <p className="mb-3">Iniciando registro en blockchain…</p>
                      <div className="flex flex-col gap-1.5">
                        {logs.slice(0, visibleLogs).map((log, i) => (
                          <p
                            key={i}
                            className="font-mono text-xs"
                            style={{ color: log.text.startsWith('✅') ? '#28C840' : '#9898B0' }}
                          >
                            {log.text}
                          </p>
                        ))}
                      </div>
                    </AiBubble>
                  </>
                )}

                {/* Step 4 — Result */}
                {step === 4 && (
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
                          Credencial registrada en Stellar
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#5A5A72' }}>
                          Prueba criptográfica almacenada en la cadena · Inmutable
                        </p>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded font-mono text-xs break-all"
                      style={{ background: '#111118', color: '#3B5BDB', border: '1px solid #1E1E2E' }}
                    >
                      SHA-256: a3f8b2c1d4e9f2a7b8c3d6e1f4a7b2c5d8e3f6a1b4c7d2e5f8a3b6c1d4e7f2a5
                    </div>

                    <div className="flex flex-col gap-2.5 text-xs">
                      {[
                        ['Estado', '✓ Verificado'],
                        ['Firmante', 'Escuela de Negocios UAI'],
                        ['Bloque', '#8.447.291'],
                        ['Timestamp', timestamp],
                        ['Red', 'Stellar Testnet'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-4">
                          <span style={{ color: '#5A5A72', minWidth: '72px' }}>{k}</span>
                          <span style={{ color: '#F0F0F5' }}>{v}</span>
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
                        Verificar credencial →
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

              {/* Decorative input bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: '1px solid #1E1E2E', background: '#0A0A0F' }}
              >
                <input
                  readOnly
                  placeholder="Escribe un comando o usa los pasos..."
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
