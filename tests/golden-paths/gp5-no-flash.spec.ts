/**
 * GP-5 · Carga de página interna sin flash / FOUC
 *
 * El flash en páginas internas ocurre porque NavV2 monta con opacity:0 y GSAP
 * espera 0.3s de delay + 1.1s de animación expo.out → el nav es invisible ~1.4s.
 * Evidencia nivel 2 (2026-06-14): timeline Playwright confirmó opacity=0.000
 * de t=111ms a t=1393ms, luego salta a 1.000.
 *
 * Test S-02 (skip-animation gate) — discriminador por DURACIÓN de animación GSAP:
 *   Mide el tiempo entre el primer write de GSAP al style del nav y cuando
 *   opacity alcanza ≥0.999. Esta medición es independiente del tiempo de carga
 *   del servidor (compile time, React hydration, etc.).
 *
 *   OLD code (gsap.fromTo delay:0.3s dur:1.1s):
 *     1. GSAP aplica fromVars sincrónicamente al crear el tween:
 *        top cambia de 14px → -34px → primer mutation en t_mount
 *     2. Delay 0.3s + animación 1.1s → opacity≥0.999 en t_mount + ~1397ms
 *     → gap ≈ 1397ms >> 500ms → FALLA
 *
 *   NEW code (gsap.set inmediato):
 *     gsap.set escribe opacity:1 en una sola operación → primer mutation = visible
 *     → gap = 0ms < 500ms → PASA
 *
 *   El threshold de 500ms tiene ~500ms de margen en cada lado (0ms vs 1397ms).
 *   No depende de velocidad de servidor ni de cuándo monta React.
 *
 * Regression guards (GREEN siempre):
 *   - Nav existe en DOM después de carga
 *   - No hay dos navs simultáneos
 *   - /validacion-pruebas-multimedia no tiene NavV2
 */

import { test, expect } from '@playwright/test'

test.describe('GP-5 · Estructura del nav en carga inicial', () => {
  test('S-02: animación GSAP del nav dura <500ms en páginas internas [gate skip-animation]', async ({ page }) => {
    // Inject observer BEFORE navigation. Measures time between:
    //   - first style mutation on <nav> (GSAP writes fromVars OR gsap.set)
    //   - when nav.style.opacity ≥ 0.999 (animation complete or immediate set)
    // This gap discriminates gsap.fromTo (~1400ms) vs gsap.set (~0ms).
    await page.addInitScript(() => {
      (window as any).__navAnimMs = null

      function attachObserver(): void {
        const nav = document.querySelector('nav')
        if (!nav) {
          requestAnimationFrame(attachObserver)
          return
        }

        let firstMutationTime: number | null = null

        const obs = new MutationObserver(() => {
          const t = performance.now()
          const opacity = parseFloat((nav as HTMLElement).style.opacity)
          if (isNaN(opacity)) return

          // Capture time of first GSAP write to nav style (any value including 0)
          if (firstMutationTime === null) firstMutationTime = t

          // Capture when opacity reaches final value; compute gap from first write
          if (opacity >= 0.999 && (window as any).__navAnimMs === null) {
            (window as any).__navAnimMs = Math.round(t - firstMutationTime!)
            obs.disconnect()
          }
        })
        obs.observe(nav, { attributes: true, attributeFilter: ['style'] })
      }

      requestAnimationFrame(attachObserver)
    })

    await page.goto('/certificados')

    // Wait for GSAP to complete (old code takes ~1.4s from mount)
    await page.waitForFunction(
      () => (window as any).__navAnimMs !== null,
      { timeout: 3000 }
    )

    const animMs: number = await page.evaluate(() => (window as any).__navAnimMs)

    // gsap.set (NEW): opacity:1 in one write → animMs ≈ 0ms < 500ms
    // gsap.fromTo (OLD): delay:0.3 + expo.out:1.1 → animMs ≈ 1397ms > 500ms
    expect(animMs).toBeLessThan(500)
  })

  test('nav en DOM al cargar /certificados tras networkidle', async ({ page }) => {
    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('nav').first()).toBeAttached()
  })

  test('nav en DOM al cargar /validacion-videos tras networkidle', async ({ page }) => {
    await page.goto('/validacion-videos')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('nav').first()).toBeAttached()
  })

  test('exactamente un <nav> en landing', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const count = await page.locator('nav').count()
    expect(count).toBe(1)
  })

  test('exactamente un <nav> en /certificados', async ({ page }) => {
    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')

    const count = await page.locator('nav').count()
    expect(count).toBe(1)
  })

  test('/validacion-pruebas-multimedia: sin NavV2 (usa Nav legacy)', async ({ page }) => {
    await page.goto('/validacion-pruebas-multimedia')
    await page.waitForLoadState('networkidle')

    // NavV2 desktop nav tiene borderRadius: 18px — no debe existir en esta página
    const hasNavV2Pill = await page.evaluate(() => {
      const navs = document.querySelectorAll('nav')
      return Array.from(navs).some(nav => {
        const style = window.getComputedStyle(nav)
        return style.borderRadius === '18px' && style.position === 'fixed'
      })
    })
    expect(hasNavV2Pill).toBe(false)
  })
})
