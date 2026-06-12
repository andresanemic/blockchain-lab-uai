'use client'
import { useRef } from 'react'
import type React from 'react'

export function useGridGlow(dark = false) {
  const sectionRef  = useRef<HTMLElement>(null)
  const glowRef     = useRef<HTMLDivElement>(null)
  const gridGlowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mask = `radial-gradient(circle 400px at ${x}px ${y}px, black 0%, black 30%, transparent 70%)`
    if (glowRef.current) {
      glowRef.current.style.background = dark
        ? `radial-gradient(circle 400px at ${x}px ${y}px, rgba(0,87,255,0.012) 0%, rgba(0,87,255,0.004) 50%, transparent 75%)`
        : `radial-gradient(circle 400px at ${x}px ${y}px, rgba(0,87,255,0.0015) 0%, rgba(0,87,255,0.00045) 50%, transparent 75%)`
    }
    if (gridGlowRef.current) {
      gridGlowRef.current.style.maskImage = mask
      gridGlowRef.current.style.setProperty('-webkit-mask-image', mask)
    }
  }

  return { sectionRef, glowRef, gridGlowRef, handleMouseMove }
}
