'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const phases = [
  {
    phase: 'Captura',
    steps: [
      {
        n: '01',
        title: 'Activación del vuelo',
        desc: 'El operador activa el dron. El firmware verifica conectividad a internet, establece conexión con el canal del consorcio y registra hora UTC + coordenadas GPS iniciales.',
      },
      {
        n: '02',
        title: 'Transmisión en vivo',
        desc: 'El dron transmite en tiempo real al canal del consorcio en la plataforma de streaming. La plataforma registra automáticamente el timestamp de inicio. El feed es público y visible para cualquier observador.',
      },
      {
        n: '03',
        title: 'Grabación continua con metadatos',
        desc: 'Durante el vuelo, el dron incrusta coordenadas GPS, altitud, velocidad, orientación de cámara y tiempo UTC en intervalos regulares. Los metadatos son visibles en el archivo de video.',
      },
      {
        n: '04',
        title: 'Fin de la transmisión',
        desc: 'Al terminar el vuelo, la transmisión se cierra. La plataforma registra el timestamp de término. El video queda disponible como archivo grabado con URL permanente.',
      },
    ],
  },
  {
    phase: 'Registro',
    steps: [
      {
        n: '05',
        title: 'Ejecución del Smart Contract',
        desc: 'Al detectar el cierre de la transmisión, el sistema ejecuta automáticamente el Smart Contract: genera el hash SHA-256 del video, empaqueta los metadatos del dron, firma la transacción con la clave privada del consorcio y la transmite a la red blockchain.',
      },
      {
        n: '06',
        title: 'Confirmación del bloque',
        desc: 'La red blockchain confirma la transacción y la incluye en un bloque. El bloque recibe un timestamp generado por la red — independiente del consorcio. La transacción queda registrada de forma permanente con un Transaction Hash único.',
      },
    ],
  },
  {
    phase: 'Evidencia',
    steps: [
      {
        n: '07',
        title: 'Custodia del registro',
        desc: 'El consorcio guarda el Transaction Hash, la URL del video y una copia local del archivo. El notario es notificado y puede emitir constancia si es requerido.',
      },
      {
        n: '08',
        title: 'Uso como prueba judicial',
        desc: 'El fiscal o querellante presenta el video (URL pública), adjunta el registro blockchain como certificado de autenticidad, solicita informe notarial y puede requerir informe técnico del dron al consorcio.',
      },
    ],
  },
]

export default function ValidFlow() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.valid-step', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section id="flujo" ref={sectionRef} className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Flujo del Protocolo
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Del despegue a la{' '}
            <span style={{ color: '#3B5BDB' }}>sala del tribunal</span>
          </h2>
          <p className="mt-5 text-base max-w-2xl leading-relaxed" style={{ color: '#9898B0' }}>
            La única acción humana requerida es iniciar el vuelo. El registro en streaming,
            el hash criptográfico y los tres eventos on-chain ocurren de forma automática.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {phases.map(({ phase, steps }) => (
            <div key={phase}>
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="font-mono text-xs px-3 py-1 rounded"
                  style={{
                    background: 'rgba(59,91,219,0.12)',
                    color: '#3B5BDB',
                    border: '1px solid rgba(59,91,219,0.25)',
                  }}
                >
                  Fase — {phase}
                </span>
                <div className="flex-1 h-px" style={{ background: '#1E1E2E' }} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map(({ n, title, desc }) => (
                  <div
                    key={n}
                    className="valid-step p-6 rounded flex flex-col gap-3"
                    style={{ background: '#111118', border: '1px solid #1E1E2E' }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0"
                        style={{ background: '#1E2D6B', color: '#3B5BDB' }}
                      >
                        {n}
                      </span>
                      <h3 className="font-semibold text-xs leading-snug" style={{ color: '#F0F0F5' }}>
                        {title}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#9898B0' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="mt-14 p-8 rounded"
          style={{ background: '#111118', border: '1px solid #1E1E2E' }}
        >
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#3B5BDB' }}>
            Resumen del sistema
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              ['Streaming en vivo', 'Testigo neutral y público de la captura'],
              ['Hash SHA-256', 'Huella digital única del archivo de video'],
              ['Smart Contract', 'Registro automático sin intervención humana'],
              ['Notaría pública', 'Certifica el protocolo en el ordenamiento jurídico chileno'],
            ].map(([label, desc]) => (
              <div key={label}>
                <p className="font-semibold text-sm mb-1" style={{ color: '#F0F0F5' }}>{label}</p>
                <p className="text-xs leading-snug" style={{ color: '#9898B0' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
