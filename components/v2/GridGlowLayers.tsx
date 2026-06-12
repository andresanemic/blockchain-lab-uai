import type { RefObject } from 'react'

interface Props {
  dark?: boolean
  glowRef: RefObject<HTMLDivElement | null>
  gridGlowRef: RefObject<HTMLDivElement | null>
}

export function GridGlowLayers({ dark = false, glowRef, gridGlowRef }: Props) {
  const base = dark ? 'rgba(248,248,244,0.028)' : 'rgba(8,13,43,0.022)'
  const g1   = dark ? 'rgba(0,87,255,0.09)'     : 'rgba(0,87,255,0.054)'
  const g2   = dark ? 'rgba(0,87,255,0.045)'    : 'rgba(0,87,255,0.025)'

  return (
    <>
      {/* Static grid — 120px, fixed attachment keeps lines aligned across sections */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(${base} 1px, transparent 1px),
          linear-gradient(90deg, ${base} 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
        backgroundAttachment: 'fixed',
      }} />

      {/* Cursor glow background */}
      <div ref={glowRef} aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Colored grid revealed by cursor mask */}
      <div ref={gridGlowRef} aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: `
          linear-gradient(${g1} 1px, transparent 1px),
          linear-gradient(90deg, ${g1} 1px, transparent 1px),
          linear-gradient(${g2} 1px, transparent 1px),
          linear-gradient(90deg, ${g2} 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
        backgroundAttachment: 'fixed',
        maskImage: 'none',
      }} />
    </>
  )
}
