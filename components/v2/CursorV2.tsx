'use client'

import { useEffect, useRef } from 'react'

export default function CursorV2() {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const render = () => {
      if (dot) {
        dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      rafId.current = requestAnimationFrame(render)
    }
    rafId.current = requestAnimationFrame(render)

    const onEnter = () => {
      if (!dot) return
      dot.style.width = '20px'
      dot.style.height = '20px'
      dot.style.background = 'rgba(59,91,219,0.3)'
      dot.style.border = '1px solid #3B5BDB'
    }
    const onLeave = () => {
      if (!dot) return
      dot.style.width = '8px'
      dot.style.height = '8px'
      dot.style.background = '#3B5BDB'
      dot.style.border = 'none'
    }

    const attach = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    document.addEventListener('mousemove', onMove)
    attach()

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '8px',
        height: '8px',
        background: '#3B5BDB',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'width 0.18s, height 0.18s, background 0.18s',
        willChange: 'transform',
      }}
    />
  )
}
