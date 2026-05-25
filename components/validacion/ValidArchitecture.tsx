'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const layers = [
  {
    tag: 'Web2',
    title: 'Captura y transmisión en vivo',
    color: '#3B5BDB',
    items: [
      'Dron con firmware certificado y módulo de streaming',
      'Transmisión en tiempo real a plataforma pública (YouTube / Twitch / LiveU)',
      'GPS sincronizado con servidores NTP — timestamp universal confiable',
      'La plataforma registra automáticamente hora de inicio y término de transmisión',
      'Copia del video alojada en servidores de terceros, fuera del control de cualquier parte',
    ],
  },
  {
    tag: 'Web3',
    title: 'Registro e inmutabilidad',
    color: '#3B5BDB',
    items: [
      'Blockchain pública (Ethereum / Polygon) o permisionada (Hyperledger Fabric)',
      'Smart Contract que ejecuta automáticamente el registro al finalizar la transmisión',
      'Hash SHA-256 del archivo de video — huella digital única e irrepetible',
      'Firma digital del consorcio mediante criptografía ECDSA',
      'Explorer público: cualquier persona puede verificar el hash de forma independiente',
    ],
  },
  {
    tag: 'Institucional',
    title: 'Confianza y gobernanza',
    color: '#3B5BDB',
    items: [
      'Consorcio RUC-D: Asociación de Empresas Forestales + UAI — sin control unilateral',
      'Gobernanza multi-firma: ninguna acción crítica puede ejecutarse por un solo actor',
      'Registro de drones certificados bajo el protocolo, con auditorías periódicas de firmware',
      'Notario público que certifica el protocolo mediante escritura pública',
      'Puente legal entre el mundo técnico y el ordenamiento jurídico chileno',
    ],
  },
]

const responses = [
  {
    via: 'Origen',
    attack: '"No sabemos de dónde viene el video."',
    response:
      'El número de serie del dron, coordenadas GPS, timestamp UTC y la transmisión en vivo son datos que existen antes, durante y después de la captura. La plataforma de streaming actúa como testigo neutral del momento exacto de captura.',
  },
  {
    via: 'Integridad',
    attack: '"El video pudo ser editado."',
    response:
      'El hash SHA-256 registrado en blockchain al finalizar la transmisión es único. Si el video hubiera sido modificado en un solo píxel o fotograma, su hash sería completamente diferente. Son idénticos o no lo son — no hay término medio.',
  },
  {
    via: 'Custodia',
    attack: '"La cadena de custodia fue rota."',
    response:
      'La cadena de custodia no pasa por manos humanas hasta que el registro blockchain ya existe. El video está en servidores de terceros, el hash en la blockchain, y la certificación en la notaría — tres sistemas independientes sin relación entre sí.',
  },
]

export default function ValidArchitecture() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.valid-layer', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
      gsap.from('.valid-response', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 45%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">

        {/* Tech layers */}
        <div className="mb-20">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
              Arquitectura del Sistema
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
              Tres capas de{' '}
              <span style={{ color: '#3B5BDB' }}>verificación independiente</span>
            </h2>
            <p className="mt-5 text-base max-w-2xl leading-relaxed" style={{ color: '#9898B0' }}>
              Ninguna capa es infalible por sí sola. La fortaleza del sistema reside en que
              falsificar la prueba requeriría comprometer las tres simultáneamente — algo
              prácticamente imposible sin dejar rastro.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {layers.map(({ tag, title, items }) => (
              <div
                key={tag}
                className="valid-layer rounded overflow-hidden"
                style={{ border: '1px solid #1E1E2E', background: '#111118' }}
              >
                <div
                  className="px-6 py-4"
                  style={{ background: '#0A0A0F', borderBottom: '1px solid #1E1E2E' }}
                >
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(59,91,219,0.15)', color: '#3B5BDB', border: '1px solid rgba(59,91,219,0.3)' }}
                  >
                    Capa {tag}
                  </span>
                  <p className="mt-2 font-semibold text-sm" style={{ color: '#F0F0F5' }}>
                    {title}
                  </p>
                </div>
                <ul className="p-6 flex flex-col gap-3">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs leading-snug" style={{ color: '#9898B0' }}>
                      <span
                        className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ background: '#1E2D6B' }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3B5BDB', display: 'block' }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Responses to attack vectors */}
        <div>
          <div className="mb-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
              Por qué es inimpugnable
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
              Una respuesta técnica a cada{' '}
              <span style={{ color: '#3B5BDB' }}>vía de impugnación</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {responses.map(({ via, attack, response }) => (
              <div
                key={via}
                className="valid-response p-6 rounded grid sm:grid-cols-[160px_1fr_2fr] gap-5 items-start"
                style={{ background: '#111118', border: '1px solid #1E1E2E' }}
              >
                <span
                  className="font-mono text-xs px-2 py-1 rounded self-start"
                  style={{ background: 'rgba(59,91,219,0.12)', color: '#3B5BDB', border: '1px solid rgba(59,91,219,0.25)' }}
                >
                  Vía — {via}
                </span>
                <p className="text-sm italic leading-relaxed" style={{ color: '#5A5A72' }}>
                  {attack}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#9898B0' }}>
                  <span style={{ color: '#F0F0F5', fontWeight: 600 }}>Respuesta RUC-D: </span>
                  {response}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
