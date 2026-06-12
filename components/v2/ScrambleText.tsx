'use client'

import { useState, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scramble = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    let frame = 0
    const totalFrames = text.length * 3

    const tick = () => {
      frame++
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ' || char === '.') return char
          if (frame / totalFrames > i / text.length + 0.12) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      if (frame < totalFrames) {
        timerRef.current = setTimeout(tick, 38)
      } else {
        setDisplay(text)
      }
    }

    timerRef.current = setTimeout(tick, 0)
  }, [text])

  return (
    <span
      onMouseEnter={scramble}
      style={{ display: 'inline-block', pointerEvents: 'inherit' }}
    >
      {display}
    </span>
  )
}
