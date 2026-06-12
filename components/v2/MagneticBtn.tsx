'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'

interface Props {
  children: ReactNode
  strength?: number
  style?: React.CSSProperties
  className?: string
}

export default function MagneticBtn({ children, strength = 0.42, style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let bounds: DOMRect

    const onEnter = () => {
      bounds = el.getBoundingClientRect()
      gsap.to(el, { scale: 1.04, duration: 0.3, ease: 'power2.out' })
    }
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - (bounds.left + bounds.width  / 2)
      const dy = e.clientY - (bounds.top  + bounds.height / 2)
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.45, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return (
    <div ref={ref} style={{ display: 'inline-block', ...style }} className={className}>
      {children}
    </div>
  )
}
