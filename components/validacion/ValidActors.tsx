'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

const actors = [
  {
    n: '01',
    name: 'El Dron',
    role: 'Dispositivo de captura',
    desc: 'Origen de toda la cadena de evidencia. Firmware certificado, GPS sincronizado con NTP, número de serie único. Los metadatos se incrustan en el video en tiempo real.',
    type: 'Tecnológico',
  },
  {
    n: '02',
    name: 'Plataforma de Streaming',
    role: 'Testigo tecnológico neutral',
    desc: 'YouTube, Twitch, LiveU u equivalente. Registra automáticamente hora de inicio y término de cada transmisión. Genera un identificador único (URL permanente) que ninguna parte puede modificar.',
    type: 'Web2',
  },
  {
    n: '03',
    name: 'Consorcio RUC-D',
    role: 'Gestor del protocolo',
    desc: 'Formado por la Asociación de Empresas Forestales y el Área de Desarrollo Tecnológico de la UAI. Ninguna empresa tiene control unilateral. Gobernanza multi-firma para acciones críticas.',
    type: 'Institucional',
  },
  {
    n: '04',
    name: 'La Blockchain',
    role: 'Registro inmutable',
    desc: 'Recibe automáticamente el hash SHA-256 del video, la URL, los metadatos del dron, el timestamp del bloque y la firma digital del consorcio. Una vez escrito, el registro es permanente.',
    type: 'Web3',
  },
  {
    n: '05',
    name: 'El Notario Garante',
    role: 'Puente legal',
    desc: 'Notario público chileno que certifica el protocolo mediante escritura pública, da fe de los miembros del consorcio y emite informes notariales para uso judicial. Ancla el sistema al ordenamiento jurídico chileno.',
    type: 'Legal',
  },
  {
    n: '06',
    name: 'Ministerio Público',
    role: 'Usuario final de la prueba',
    desc: 'Puede presentar el video como evidencia, adjuntar el registro blockchain como certificado de autenticidad, solicitar informe notarial y requerir informe técnico del dron al consorcio.',
    type: 'Judicial',
  },
]

const typeColors: Record<string, string> = {
  Tecnológico: '#3B5BDB',
  Web2: '#2A6496',
  Institucional: '#3B5BDB',
  Web3: '#3B5BDB',
  Legal: '#5A5A72',
  Judicial: '#9898B0',
}

export default function ValidActors() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.valid-actor-card', {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: '#111118' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3B5BDB' }}>
            Actores del Protocolo
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold" style={{ color: '#F0F0F5' }}>
            Seis roles, ninguno con{' '}
            <span style={{ color: '#3B5BDB' }}>control exclusivo</span>
          </h2>
          <p className="mt-5 text-base max-w-2xl leading-relaxed" style={{ color: '#9898B0' }}>
            La descentralización no es solo tecnológica. El protocolo distribuye también la
            responsabilidad institucional: comprometer el sistema requeriría la complicidad
            simultánea de todos los actores.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actors.map(({ n, name, role, desc, type }) => (
            <div
              key={n}
              className="valid-actor-card p-7 rounded flex flex-col gap-4"
              style={{
                background: '#0A0A0F',
                border: '1px solid #2A2A3C',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,91,219,0.4)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A2A3C' }}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono font-bold text-3xl leading-none" style={{ color: '#1E2D6B' }}>
                  {n}
                </span>
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(59,91,219,0.08)',
                    color: typeColors[type] ?? '#9898B0',
                    border: `1px solid ${typeColors[type] ? typeColors[type] + '33' : '#1E1E2E'}`,
                  }}
                >
                  {type}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#F0F0F5' }}>{name}</h3>
                <p className="font-mono text-xs" style={{ color: '#3B5BDB' }}>{role}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#9898B0' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
