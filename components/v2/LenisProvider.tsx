'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef    = useRef<Lenis | null>(null)
  const isFirstPath = useRef(true)
  const scrollSaved = useRef<Record<string, number>>({})
  const pathname    = usePathname()

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.2,
      smoothWheel: true,
    })

    lenisRef.current = lenis
    ;(window as any).__lenis = lenis

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return

      let link = (e.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null
      let hash: string | null = null

      if (link) {
        hash = link.getAttribute('href') ?? null
      } else {
        const rootLink = (e.target as Element).closest('a[href^="/#"]') as HTMLAnchorElement | null
        if (rootLink && window.location.pathname === '/') {
          hash = (rootLink.getAttribute('href') ?? '').slice(1)
          link = rootLink
        }
      }

      if (!link || !hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 5) })
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(update)
      lenisRef.current = null
      ;(window as any).__lenis = null
      lenis.destroy()
    }
  }, [])

  // Save scroll position before leaving each route (enables back-navigation restore)
  useEffect(() => {
    return () => {
      const pos = lenisRef.current?.scroll ?? 0
      if (pos > 0) scrollSaved.current[pathname] = pos
    }
  }, [pathname])

  // On every client-side route change
  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false
      return
    }

    const lenis = lenisRef.current
    const hash  = window.location.hash

    if (hash) {
      // Wait for new page's GSAP (including BlockchainV2 pin) to fully set up,
      // then refresh trigger positions BEFORE scrolling — otherwise pin spacer
      // shifts #proyectos position and scroll lands in Blockchain section.
      const t = setTimeout(() => {
        ScrollTrigger.refresh()
        requestAnimationFrame(() => {
          const target = document.querySelector(hash)
          if (target && lenis) {
            lenis.scrollTo(target as HTMLElement, {
              duration: 1.6,
              easing: (x: number) => 1 - Math.pow(1 - x, 5),
            })
          }
        })
      }, 400)
      return () => clearTimeout(t)
    }

    const savedPos = scrollSaved.current[pathname]
    const tids: ReturnType<typeof setTimeout>[] = []

    // rAF defers until after Next.js has committed the new page to DOM,
    // preventing a flash of the old page scrolled to top.
    const raf = requestAnimationFrame(() => {
      if (savedPos !== undefined) {
        // Back/forward navigation — restore the saved scroll position
        lenis?.scrollTo(savedPos, { immediate: true })
      } else {
        // Forward navigation to a new page — start at top
        lenis?.scrollTo(0, { immediate: true })
      }
      tids.push(setTimeout(() => ScrollTrigger.refresh(), 100))
    })

    return () => {
      cancelAnimationFrame(raf)
      tids.forEach(clearTimeout)
    }
  }, [pathname])

  return <>{children}</>
}
