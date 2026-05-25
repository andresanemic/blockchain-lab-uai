'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const phases = [
  {
    n: '01',
    label: 'Onboarding del participante',
    title: 'Una wallet sin seed phrase',
    bullets: [
      'El participante registra su número de WhatsApp al inscribirse al curso.',
      'El sistema deriva un par de claves determinístico a partir del número.',
      'La UAI patrocina la creación de la cuenta Soroban en Stellar.',
      'Sin seed phrase, sin app adicional — el número de teléfono es su identidad.',
    ],
  },
  {
    n: '02',
    label: 'Emisión via chatbot UAI',
    title: 'Operador ejecuta, blockchain registra',
    bullets: [
      'El operador accede al chatbot UAI y selecciona el participante por número.',
      'El chatbot genera el NFT con los datos del curso y del participante.',
      'Firma la transacción con la wallet institucional UAI (único firmante autorizado).',
      'Resultado: MINT + TRANSFER + LEDGER ENTRY automáticos en < 10 segundos.',
    ],
  },
  {
    n: '03',
    label: 'Acceso y verificación',
    title: 'Permanente y público',
    bullets: [
      'Con wallet Stellar compatible (Lobstr, xBull): visualización directa del NFT.',
      'Sin wallet: link de verificación público generado automáticamente por el chatbot.',
      'Verificable en Stellar Expert sin requerir cuenta ni intermediario.',
      'El registro en blockchain es permanente y no puede ser eliminado.',
    ],
  },
]

const summary = [
  ['30', 'Participantes del piloto'],
  ['Stellar', 'Testnet → Mainnet'],
  ['Soroban', 'Contratos inteligentes'],
  ['< $0.01', 'Costo por certificado'],
]

export default function CertBenefits() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-phase-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
      gsap.from('.cert-summary-cell', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#111118' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Flujo Operativo
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            De la inscripción al{' '}
            <span style={{ color: '#3B5BDB' }}>certificado on-chain</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {phases.map(({ n, label, title, bullets }) => (
            <div
              key={n}
              className="cert-phase-card p-7 rounded flex flex-col gap-5"
              style={{ background: '#0A0A0F', border: '1px solid #2A2A3C' }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-xs px-2 py-1 rounded"
                  style={{
                    background: 'rgba(59,91,219,0.12)',
                    color: '#3B5BDB',
                    border: '1px solid rgba(59,91,219,0.25)',
                  }}
                >
                  Fase {n}
                </span>
                <span
                  className="font-mono font-bold text-4xl leading-none"
                  style={{ color: '#1E2D6B' }}
                >
                  {n}
                </span>
              </div>
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-wider mb-1.5"
                  style={{ color: '#5A5A72' }}
                >
                  {label}
                </p>
                <h3 className="font-semibold text-sm" style={{ color: '#F0F0F5' }}>
                  {title}
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs leading-snug"
                    style={{ color: '#9898B0' }}
                  >
                    <span
                      className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: '#1E2D6B' }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#3B5BDB',
                          display: 'block',
                        }}
                      />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: '#1E1E2E' }}>
          {summary.map(([value, label]) => (
            <div
              key={label}
              className="cert-summary-cell flex flex-col gap-1 px-6 py-5"
              style={{ background: '#111118' }}
            >
              <span className="font-mono font-bold text-xl" style={{ color: '#3B5BDB' }}>
                {value}
              </span>
              <span className="text-xs" style={{ color: '#9898B0' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
