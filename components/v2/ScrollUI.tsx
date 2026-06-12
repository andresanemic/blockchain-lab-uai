'use client'

import { useEffect, useRef } from 'react'

export default function ScrollUI() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const progress = Math.min(1, window.scrollY / max)
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${progress})`
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', right: 0, top: 0,
        width: '3px', height: '100dvh',
        background: 'rgba(8,13,43,0.05)',
        zIndex: 9000, pointerEvents: 'none',
      }}
    >
      <div
        ref={progressRef}
        style={{
          width: '100%', height: '100%',
          background: '#60A0FF',
          transformOrigin: 'top center',
          transform: 'scaleY(0)',
        }}
      />
    </div>
  )
}
