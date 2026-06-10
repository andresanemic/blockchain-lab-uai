'use client'

import { useEffect, useRef } from 'react'

export default function CursorV2() {
  const blobRef = useRef<HTMLDivElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const blob = blobRef.current
    const dot  = dotRef.current
    if (!blob || !dot) return

    // Target (raw mouse)
    const t = { x: -200, y: -200 }
    // Current interpolated
    const c = { x: -200, y: -200 }
    const LERP = 0.09

    let raf = 0
    let hovered = false

    const onMove = (e: MouseEvent) => {
      t.x = e.clientX
      t.y = e.clientY
      // Dot follows instantly
      dot.style.transform = `translate(${t.x - 3}px, ${t.y - 3}px)`
    }

    const tick = () => {
      c.x += (t.x - c.x) * LERP
      c.y += (t.y - c.y) * LERP
      const size = hovered ? 72 : 48
      blob.style.transform = `translate(${c.x - size / 2}px, ${c.y - size / 2}px)`
      blob.style.width  = `${size}px`
      blob.style.height = `${size}px`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const enter = () => {
      hovered = true
      blob.style.background = 'rgba(0,87,255,0.10)'
      blob.style.borderColor = 'rgba(0,87,255,0.55)'
      blob.style.mixBlendMode = 'normal'
    }
    const leave = () => {
      hovered = false
      blob.style.background = 'rgba(8,13,43,0.06)'
      blob.style.borderColor = 'rgba(8,13,43,0.18)'
      blob.style.mixBlendMode = 'normal'
    }
    const down = () => { blob.style.transform += ' scale(0.75)' }
    const up   = () => { /* scale resets via tick */ }

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
      })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', down)
    document.addEventListener('mouseup', up)
    attach()

    // Re-attach when DOM changes (for SSR-hydrated links)
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', down)
      document.removeEventListener('mouseup', up)
      mo.disconnect()
    }
  }, [])

  return (
    <>
      {/* Blob — large, lerp-following */}
      <div
        ref={blobRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '48px', height: '48px',
          borderRadius: '50%',
          background: 'rgba(8,13,43,0.06)',
          border: '1px solid rgba(8,13,43,0.18)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform, width, height',
          transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, border-color 0.25s',
        }}
      />
      {/* Dot — instant, precise */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#0057FF',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
    </>
  )
}
