'use client'
import { useState, useEffect, useLayoutEffect } from 'react'

// useLayoutEffect on client (runs before paint), useEffect on server (avoids SSR warning)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}
