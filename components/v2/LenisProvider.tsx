'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      // lerp replaces duration+easing — da una desaceleración orgánica tipo spring
      // 0.06 = muy suave/elegante; rango típico 0.05–0.12
      lerp: 0.07,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.2,
      smoothWheel: true,
    })

    // Exponer instancia globalmente para que cualquier componente pueda llamar lenis.scrollTo()
    ;(window as any).__lenis = lenis

    // Tie Lenis RAF to GSAP ticker so ScrollTrigger stays in sync
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Global anchor click handler — routes all #hash links through Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const link = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 5) })
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(update)
      ;(window as any).__lenis = null
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
