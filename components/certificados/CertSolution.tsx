'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const pillars = [
  {
    tag: '01',
    title: 'Stellar + Soroban',
    desc: 'Blockchain pública de capa 1 con confirmaciones en 3–5 segundos y tarifas menores a $0.01 USD. Soroban es su entorno de contratos inteligentes, disponible desde 2024. El piloto usará Stellar Testnet para validación y Mainnet para la emisión oficial.',
  },
  {
    tag: '02',
    title: 'Account Abstraction — wallet ligada al teléfono',
    desc: 'Cada participante obtiene una cuenta Soroban ligada a su número de WhatsApp. El sistema deriva un par de claves determinístico a partir del número — sin seed phrase, sin app adicional. La UAI patrocina la creación de la cuenta (equivalente al Paymaster en Account Abstraction).',
  },
  {
    tag: '03',
    title: 'Wallet Institucional UAI — único emisor autorizado',
    desc: 'La UAI opera una wallet Soroban gestionada por el Blockchain Lab. Es la única firmante autorizada para mintear certificados del contrato Soroban del curso. Opera exclusivamente a través del chatbot — no existe otra interfaz de emisión.',
  },
]

const metadata = [
  'Nombre completo del participante',
  'Nombre del curso y número de edición',
  'Fechas de inicio y término del curso',
  'Fecha y hora UTC de emisión',
  'Institución emisora: Universidad Adolfo Ibáñez',
  'Hash SHA-256 del documento PDF',
  'Dirección wallet institucional UAI (firmante)',
  'Número de ledger + hash de transacción',
]

export default function CertSolution() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.cert-sol-pillar', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
      gsap.from('.cert-sol-meta', {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Arquitectura Técnica
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Stellar · Soroban ·{' '}
            <span style={{ color: '#3B5BDB' }}>Account Abstraction</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-start">
          {/* Left: technical pillars */}
          <div className="flex flex-col gap-4">
            {pillars.map(({ tag, title, desc }) => (
              <div
                key={tag}
                className="cert-sol-pillar p-6 rounded flex gap-5"
                style={{
                  background: '#111118',
                  border: '1px solid #1E1E2E',
                  borderLeft: '3px solid #3B5BDB',
                }}
              >
                <span
                  className="font-mono font-bold text-xs shrink-0 mt-0.5"
                  style={{ color: '#3B5BDB' }}
                >
                  {tag}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1.5" style={{ color: '#F0F0F5' }}>
                    {title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9898B0' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: NFT metadata card */}
          <div
            className="cert-sol-meta rounded overflow-hidden"
            style={{ border: '1px solid #1E1E2E', background: '#111118' }}
          >
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ background: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}
            >
              <span className="font-mono text-xs" style={{ color: '#3B5BDB' }}>NFT</span>
              <span className="font-mono text-xs" style={{ color: '#5A5A72' }}>·</span>
              <span className="font-mono text-xs" style={{ color: '#9898B0' }}>Metadata on-chain</span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {metadata.map((field, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="font-mono text-xs shrink-0 mt-0.5"
                    style={{ color: '#3B5BDB' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs leading-snug" style={{ color: '#9898B0' }}>
                    {field}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="px-5 py-3 flex flex-col gap-1"
              style={{ borderTop: '1px solid #1E1E2E', background: '#0A0A0F' }}
            >
              <p className="font-mono text-[10px]" style={{ color: '#5A5A72' }}>
                Estándar: Soroban NFT · Stellar
              </p>
              <p className="font-mono text-[10px]" style={{ color: '#5A5A72' }}>
                3 eventos on-chain: MINT · TRANSFER · LEDGER ENTRY
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
