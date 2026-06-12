'use client'

import { useState, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { useGridGlow } from '@/lib/useGridGlow'
import { GridGlowLayers } from '@/components/v2/GridGlowLayers'
import { useIsMobile } from '@/lib/useIsMobile'

const DISPLAY = 'var(--font-lato, var(--font-inter))'
const BODY    = 'var(--font-inter)'
const MONO    = 'var(--font-jetbrains-mono, monospace)'

// ── Shared atoms ─────────────────────────────────────────────────────────────
function MiniCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '8px',
      border: '1px solid rgba(8,13,43,0.07)',
      padding: '10px 12px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, color: 'rgba(8,13,43,0.28)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '9px' }}>
      {children}
    </p>
  )
}

function Dot({ color = '#0057FF' }: { color?: string }) {
  return <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, flexShrink: 0 }} />
}

function Chip({ text, blue, green }: { text: string; blue?: boolean; green?: boolean }) {
  const border = blue ? 'rgba(0,87,255,0.25)' : green ? 'rgba(22,163,74,0.25)' : 'rgba(8,13,43,0.10)'
  const color  = blue ? '#0057FF' : green ? '#16a34a' : 'rgba(8,13,43,0.38)'
  return (
    <span style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', border: `1px solid ${border}`, color }}>
      {text}
    </span>
  )
}

// ── Panel 01 · Diagnóstico ────────────────────────────────────────────────────
function PanelDiagnostico() {
  const actors  = ['Gerencia TI', 'Área Legal', 'Operaciones', 'Auditoría Interna']
  const metrics = ['Tiempo de verificación documental', 'Tasa de inconsistencia en registros', 'Costo de procesos manuales']
  return (
    <>
      <SectionLabel>Actores identificados</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {actors.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(8,13,43,0.07)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,87,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontFamily: MONO, fontWeight: 700, color: '#0057FF' }}>{a[0]}</span>
            </div>
            <span style={{ fontSize: '13px', fontFamily: BODY, color: 'rgba(8,13,43,0.65)', fontWeight: 500, flex: 1 }}>{a}</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
          </div>
        ))}
      </div>
      <MiniCard style={{ marginTop: 'auto' }}>
        <SectionLabel>Métricas objetivo</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Dot /><span style={{ fontSize: '12px', fontFamily: BODY, color: 'rgba(8,13,43,0.55)' }}>{m}</span>
            </div>
          ))}
        </div>
      </MiniCard>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['3 entrevistas', '2 talleres', '1 workshop'].map((t, i) => <Chip key={i} text={t} />)}
      </div>
    </>
  )
}

// ── Panel 02 · Diseño ────────────────────────────────────────────────────────
function PanelDiseno() {
  const nodes = [
    { label: 'Plataforma cliente', sub: 'Frontend / ERP' },
    { label: 'API Gateway',        sub: 'REST · Validación' },
    { label: 'Smart Contract',     sub: 'Lógica de negocio', accent: true },
    { label: 'Red blockchain',     sub: 'Registro inmutable' },
  ]
  const integrations = ['API REST', 'IPFS / Arweave', 'ABI onchain', 'Webhooks']
  return (
    <>
      <SectionLabel>Flujo de datos propuesto</SectionLabel>
      <MiniCard style={{ padding: '12px 14px' }}>
        {nodes.map((n, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '6px 0' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '7px', flexShrink: 0,
                background: n.accent ? 'rgba(0,87,255,0.10)' : 'rgba(8,13,43,0.04)',
                border: `1px solid ${n.accent ? 'rgba(0,87,255,0.28)' : 'rgba(8,13,43,0.07)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '10px', fontFamily: MONO, fontWeight: 700, color: n.accent ? '#0057FF' : 'rgba(8,13,43,0.38)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontFamily: BODY, color: n.accent ? '#080D2B' : 'rgba(8,13,43,0.60)', fontWeight: n.accent ? 600 : 400, lineHeight: 1.2 }}>{n.label}</p>
                <p style={{ fontSize: '10px', fontFamily: MONO, color: 'rgba(8,13,43,0.28)', marginTop: '2px' }}>{n.sub}</p>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div style={{ marginLeft: '17px', width: '1.5px', height: '10px', background: 'rgba(8,13,43,0.08)' }} />
            )}
          </div>
        ))}
      </MiniCard>
      <SectionLabel>Integraciones requeridas</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {integrations.map((t, i) => <Chip key={i} text={t} blue={i === 2} />)}
      </div>
    </>
  )
}

// ── Panel 03 · Validación ────────────────────────────────────────────────────
function PanelValidacion() {
  const kpis = [
    { label: 'Costo por transacción', value: '~$0.03', blue: true },
    { label: 'ROI proyectado',        value: '3.4×',   green: true },
    { label: 'Semanas de desarrollo', value: '10 sem', blue: true },
    { label: 'Ahorro anual estimado', value: '18%',    green: true },
  ]
  const nets = [
    { name: 'Ethereum', tag: 'L1', selected: false },
    { name: 'Polygon',  tag: 'L2', selected: true },
    { name: 'Avalanche',tag: 'L1', selected: false },
  ]
  return (
    <>
      <SectionLabel>Indicadores de viabilidad</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {kpis.map((m, i) => (
          <MiniCard key={i} style={{ padding: '10px 12px' }}>
            <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.38)', marginBottom: '4px', lineHeight: 1.3 }}>{m.label}</p>
            <p style={{ fontSize: '26px', fontFamily: MONO, fontWeight: 700, color: m.green ? '#16a34a' : '#0057FF', lineHeight: 1 }}>{m.value}</p>
          </MiniCard>
        ))}
      </div>
      <SectionLabel>Red evaluada</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {nets.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: n.selected ? 'rgba(0,87,255,0.05)' : '#FFFFFF', borderRadius: '8px', border: `1px solid ${n.selected ? 'rgba(0,87,255,0.25)' : 'rgba(8,13,43,0.07)'}` }}>
            <Dot color={n.selected ? '#0057FF' : 'rgba(8,13,43,0.16)'} />
            <span style={{ fontSize: '13px', fontFamily: BODY, color: n.selected ? '#080D2B' : 'rgba(8,13,43,0.40)', fontWeight: n.selected ? 600 : 400, flex: 1 }}>{n.name}</span>
            <Chip text={n.tag} blue={n.selected} />
            {n.selected && <span style={{ fontSize: '9px', fontFamily: MONO, fontWeight: 700, color: '#0057FF', letterSpacing: '0.08em' }}>SELECCIONADA</span>}
          </div>
        ))}
      </div>
    </>
  )
}

// ── Panel 04 · Desarrollo ────────────────────────────────────────────────────
function PanelDesarrollo() {
  const snippet = `function emitir(
  address receptor,
  bytes32 hashDoc,
  uint256 fechaExpiry
) external onlyAdmin {
  emit Certificado(
    receptor, hashDoc,
    block.timestamp
  );
}`
  const stats = [
    { label: 'Commits', value: '62' },
    { label: 'Cobertura tests', value: '94%' },
    { label: 'Usuarios piloto', value: '14' },
  ]
  return (
    <>
      <SectionLabel>Contrato desplegado · staging</SectionLabel>
      <MiniCard style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '11px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#0057FF' }} />
          <span style={{ fontSize: '10px', fontFamily: MONO, fontWeight: 700, color: 'rgba(8,13,43,0.35)' }}>CertificadoUAI.sol</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 5px rgba(22,163,74,0.55)' }} />
            <span style={{ fontSize: '9px', fontFamily: MONO, color: '#16a34a', letterSpacing: '0.10em' }}>COMPILADO</span>
          </div>
        </div>
        <pre style={{ fontSize: '10.5px', fontFamily: MONO, color: 'rgba(8,13,43,0.48)', margin: 0, lineHeight: 1.9, background: 'none', whiteSpace: 'pre' }}>{snippet}</pre>
      </MiniCard>
      <div style={{ display: 'flex', gap: '6px' }}>
        {stats.map((s, i) => (
          <MiniCard key={i} style={{ flex: 1, padding: '10px 12px' }}>
            <p style={{ fontSize: '9px', fontFamily: BODY, color: 'rgba(8,13,43,0.38)', marginBottom: '4px', lineHeight: 1.3 }}>{s.label}</p>
            <p style={{ fontSize: '24px', fontFamily: MONO, fontWeight: 700, color: '#0057FF', lineHeight: 1 }}>{s.value}</p>
          </MiniCard>
        ))}
      </div>
    </>
  )
}

// ── Panel 05 · Escala ────────────────────────────────────────────────────────
function PanelEscala() {
  const checklist = [
    { text: 'Documentación técnica',    done: true },
    { text: 'Capacitación del equipo',  done: true },
    { text: 'SLA y monitoreo activo',   done: true },
    { text: 'Auditoría de seguridad',   done: false },
  ]
  return (
    <>
      <div style={{ display: 'flex', gap: '6px' }}>
        <MiniCard style={{ flex: 1 }}>
          <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.38)', marginBottom: '5px' }}>Uptime</p>
          <p style={{ fontSize: '34px', fontFamily: MONO, fontWeight: 700, color: '#16a34a', lineHeight: 1 }}>99.9%</p>
        </MiniCard>
        <MiniCard style={{ flex: 1 }}>
          <p style={{ fontSize: '10px', fontFamily: BODY, color: 'rgba(8,13,43,0.38)', marginBottom: '5px' }}>Nodos activos</p>
          <p style={{ fontSize: '34px', fontFamily: MONO, fontWeight: 700, color: '#0057FF', lineHeight: 1 }}>12</p>
        </MiniCard>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 13px', background: 'rgba(22,163,74,0.06)', borderRadius: '8px', border: '1px solid rgba(22,163,74,0.20)' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.55)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontFamily: MONO, fontWeight: 700, color: '#16a34a', letterSpacing: '0.10em' }}>EN PRODUCCIÓN · MAINNET</span>
      </div>
      <MiniCard style={{ flex: 1 }}>
        <SectionLabel>Transferencia de conocimiento</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklist.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${c.done ? '#16a34a' : 'rgba(8,13,43,0.18)'}`, background: c.done ? 'rgba(22,163,74,0.10)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.done && <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px', fontFamily: BODY, color: c.done ? 'rgba(8,13,43,0.65)' : 'rgba(8,13,43,0.30)' }}>{c.text}</span>
            </div>
          ))}
        </div>
      </MiniCard>
    </>
  )
}

const PANELS = [PanelDiagnostico, PanelDiseno, PanelValidacion, PanelDesarrollo, PanelEscala]

// ── Steps data ───────────────────────────────────────────────────────────────
const steps = [
  { num: '01', tag: 'Diagnóstico', title: 'Identificación del problema',    desc: 'Entendemos el desafío real de la organización antes de proponer nada. Analizamos el contexto, los actores involucrados y los indicadores que definirán el éxito del proyecto.' },
  { num: '02', tag: 'Diseño',      title: 'Diseño del caso de uso',         desc: 'Definimos dónde y cómo blockchain agrega valor concreto. Mapeamos el flujo de datos, las integraciones necesarias y las restricciones técnicas del entorno de la organización.' },
  { num: '03', tag: 'Validación',  title: 'Validación técnica y económica', desc: 'Comprobamos viabilidad, costos e indicadores de éxito. Evaluamos alternativas de red, modelo de gobernanza y proyección de costos operativos antes de escribir una sola línea de código.' },
  { num: '04', tag: 'Desarrollo',  title: 'Desarrollo de piloto / MVP',     desc: 'Construimos una solución funcional, no una demo de laboratorio. El MVP tiene usuarios reales, datos reales y métricas de adopción desde el primer día de operación.' },
  { num: '05', tag: 'Escala',      title: 'Escalabilidad y acompañamiento', desc: 'Llevamos el piloto a producción y acompañamos su adopción. Definimos el plan de mantenimiento, actualizaciones de protocolo y transferencia de conocimiento al equipo interno.' },
]

// ── Pill style ────────────────────────────────────────────────────────────────
function pillStyle(isActive: boolean): CSSProperties {
  return {
    fontFamily: MONO, fontSize: '12px',
    letterSpacing: '0.10em', textTransform: 'uppercase',
    padding: '5px 12px', borderRadius: '4px',
    cursor: 'pointer',
    border: `1px solid ${isActive ? 'rgba(0,87,255,0.35)' : 'rgba(8,13,43,0.16)'}`,
    background: isActive ? 'rgba(0,87,255,0.06)' : 'transparent',
    color: isActive ? '#0057FF' : 'rgba(8,13,43,0.50)',
    boxShadow: isActive
      ? '0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10), 0 2px 8px rgba(8,13,43,0.06), inset 0 1px 0 rgba(255,255,255,0.60)'
      : 'none',
    transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProcessV2() {
  const { sectionRef, glowRef, gridGlowRef, handleMouseMove } = useGridGlow()
  const [displayed, setDisplayed] = useState(0)
  const isMobile = useIsMobile()

  const leftContentRef  = useRef<HTMLDivElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)
  const progressRef     = useRef<HTMLDivElement>(null)
  const busyRef         = useRef(false)
  const queueRef        = useRef<number | null>(null)

  const goTo = (next: number) => {
    if (next < 0 || next >= steps.length) return

    // If busy: queue the request and return — fires automatically when done
    if (busyRef.current) {
      queueRef.current = next
      return
    }

    busyRef.current = true
    queueRef.current = null

    const dir = next > displayed ? 1 : -1
    const targets = [leftContentRef.current, rightContentRef.current].filter(Boolean)

    gsap.to(targets, {
      opacity: 0,
      y: -12 * dir,
      scale: 0.97,
      duration: 0.20,
      ease: 'power2.in',
      stagger: 0.03,
      overwrite: true,
      onComplete: () => {
        gsap.set(targets, { y: 16 * dir, opacity: 0, scale: 0.97 })
        setDisplayed(next)

        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: (next + 1) / steps.length,
            duration: 0.60,
            ease: 'expo.out',
            overwrite: true,
          })
        }

        // Double RAF — ensures React commits new DOM before GSAP enters
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: 'expo.out',
              stagger: 0.07,
              overwrite: true,
              onComplete: () => {
                busyRef.current = false
                // Fire queued navigation if user clicked during animation
                const queued = queueRef.current
                queueRef.current = null
                if (queued !== null) goTo(queued)
              },
            })
          })
        })
      },
    })
  }

  useGSAP(() => {
    gsap.from('.proc-h2', {
      y: 64, opacity: 0, duration: 1.0, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
    gsap.from('.proc-artifact', {
      opacity: 0, x: 56, scale: 0.96,
      duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
    // Init progress bar to step 1/5
    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 1 / steps.length })
    }
  }, { scope: sectionRef })

  const step = steps[displayed]
  const PanelComponent = PANELS[displayed]

  return (
    <section
      id="proceso"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        background: '#F8F8F4',
        padding: isMobile ? '48px 24px' : 'clamp(96px, 14vh, 136px) clamp(24px, 5vw, 64px)',
        scrollMarginTop: '80px',
      }}
    >
      <GridGlowLayers glowRef={glowRef} gridGlowRef={gridGlowRef} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 3 }}>

        {/* H2 */}
        <h2 className="proc-h2" style={{
          fontFamily: DISPLAY, fontWeight: 300,
          fontSize: 'clamp(44px, 6.5vw, 88px)',
          lineHeight: 0.95, letterSpacing: '-0.03em',
          color: '#080D2B',
          marginBottom: 'clamp(40px, 6vh, 64px)',
        }}>
          Cómo llevamos tu<br />
          idea a <span style={{ color: '#0057FF' }}>producción.</span>
        </h2>

        {/* Artifact */}
        <div
          className="proc-artifact"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(8,13,43,0.10)',
            boxShadow: '0 4px 24px rgba(8,13,43,0.10), 0 16px 56px rgba(8,13,43,0.16), 0 40px 80px rgba(8,13,43,0.12), 0 0 0 1px rgba(8,13,43,0.06)',
            display: 'flex', flexDirection: 'column',
            height: isMobile ? 'auto' : 'clamp(480px, 60vh, 600px)',
            maxWidth: '1100px', margin: '0 auto',
            marginBottom: 'clamp(24px, 3.5vh, 36px)',
          }}
        >
          {/* Header bar */}
          <div style={{
            background: '#F7F8FA',
            padding: '14px 18px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
            borderBottom: '1px solid rgba(8,13,43,0.07)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 5px rgba(22,163,74,0.6)' }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: '9px', fontWeight: 700, color: 'rgba(8,13,43,0.28)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {step.num} / 0{steps.length} · {step.tag}
            </span>
            {/* Progress bar — scaleX driven by GSAP */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(8,13,43,0.06)' }}>
              <div ref={progressRef} style={{ height: '100%', background: '#0057FF', transformOrigin: 'left center', transform: `scaleX(${1 / steps.length})` }} />
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flex: isMobile ? undefined : 1, overflow: isMobile ? 'visible' : 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>

            {/* LEFT — step narrative */}
            <div style={{
              width: isMobile ? '100%' : '42%', flexShrink: 0,
              background: '#FFFFFF',
              borderRight: isMobile ? 'none' : '1px solid rgba(8,13,43,0.07)',
              borderBottom: isMobile ? '1px solid rgba(8,13,43,0.07)' : 'none',
              paddingTop: isMobile ? '24px' : 'clamp(24px, 3.5vw, 40px)',
              paddingBottom: isMobile ? '24px' : 'clamp(24px, 3.5vw, 40px)',
              paddingLeft: 'clamp(24px, 3vw, 36px)',
              paddingRight: isMobile ? 'clamp(24px, 3vw, 36px)' : 'clamp(48px, 6vw, 80px)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div ref={leftContentRef} style={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : '100%' }}>
                {/* Top spacer — desktop only */}
                <div style={{ flex: isMobile ? undefined : '0 0 13%' }} />
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontFamily: MONO, fontSize: '11px', color: '#0057FF',
                    border: '1px solid rgba(0,87,255,0.35)',
                    background: 'rgba(0,87,255,0.06)',
                    padding: '4px 11px', borderRadius: '4px',
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    marginBottom: '20px',
                    boxShadow: '0 0 0 1px rgba(0,87,255,0.12), 0 0 8px rgba(0,87,255,0.10), 0 2px 8px rgba(8,13,43,0.06), inset 0 1px 0 rgba(255,255,255,0.60)',
                  }}>{step.tag}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: MONO, fontSize: '12px', color: 'rgba(8,13,43,0.28)', letterSpacing: '0.08em', flexShrink: 0 }}>{step.num}</span>
                    <h3 style={{
                      fontFamily: DISPLAY, fontWeight: 300,
                      fontSize: 'clamp(22px, 2.4vw, 34px)',
                      lineHeight: 1.08, letterSpacing: '-0.025em',
                      color: '#080D2B', margin: 0,
                    }}>{step.title}</h3>
                  </div>
                  <p style={{ fontFamily: BODY, fontSize: '13.5px', color: 'rgba(8,13,43,0.55)', lineHeight: 1.70, marginBottom: 0 }}>{step.desc}</p>
                </div>
                {!isMobile && <div style={{ flex: 1 }} />}
                {/* Navigation */}
                <div style={{ display: 'flex', gap: '8px', marginTop: isMobile ? '24px' : undefined }}>
                  <button onClick={() => goTo(displayed - 1)} disabled={displayed === 0} style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '4px', cursor: displayed === 0 ? 'default' : 'pointer', border: `1px solid ${displayed === 0 ? 'rgba(8,13,43,0.09)' : 'rgba(8,13,43,0.20)'}`, background: 'transparent', color: displayed === 0 ? 'rgba(8,13,43,0.20)' : 'rgba(8,13,43,0.55)', transition: 'all 0.20s' }}>←</button>
                  <button onClick={() => goTo(displayed + 1)} disabled={displayed === steps.length - 1} style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '4px', cursor: displayed === steps.length - 1 ? 'default' : 'pointer', border: `1px solid ${displayed === steps.length - 1 ? 'rgba(8,13,43,0.09)' : 'rgba(0,87,255,0.30)'}`, background: displayed === steps.length - 1 ? 'transparent' : 'rgba(0,87,255,0.05)', color: displayed === steps.length - 1 ? 'rgba(8,13,43,0.20)' : '#0057FF', transition: 'all 0.20s' }}>→</button>
                </div>
              </div>
            </div>

            {/* RIGHT — contextual step panel (hidden on mobile) */}
            <div style={{
              display: isMobile ? 'none' : undefined,
              flex: 1, background: '#F7F8FA',
              padding: 'clamp(18px, 2.5vw, 28px) clamp(14px, 1.8vw, 22px)',
              overflow: 'hidden',
            }}>
              <div ref={rightContentRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                <PanelComponent />
              </div>
            </div>

          </div>
        </div>

        {/* Step pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          {steps.map((s, i) => (
            <button key={s.num} className="proc-pill" onClick={() => goTo(i)} style={pillStyle(displayed === i)}>{s.tag}</button>
          ))}
        </div>

      </div>
    </section>
  )
}
