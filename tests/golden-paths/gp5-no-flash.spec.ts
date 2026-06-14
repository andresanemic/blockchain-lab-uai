/**
 * GP-5 · Carga de página interna sin flash / FOUC
 *
 * El flash en páginas internas ocurre porque NavV2 monta con opacity:0 y GSAP
 * espera 0.3s de delay + 1.1s de animación expo.out → el nav es invisible ~1.4s.
 * Evidencia nivel 2 (2026-06-14): timeline Playwright confirmó opacity=0.000
 * de t=111ms a t=1393ms, luego salta a 1.000 (expo.out casi-step-function).
 *
 * Test RED (S-02 skip-animation):
 *   "nav visible dentro de 200ms en /certificados" → RED ahora, GREEN tras Etapa 2
 *   (pathname !== '/' → gsap.set(navRef, { opacity:1, top:'14px' }) inmediato).
 *
 * Regression guards (GREEN ahora):
 *   - Nav existe en DOM después de carga
 *   - No hay dos navs simultáneos
 *   - /validacion-pruebas-multimedia no tiene NavV2
 */

import { test, expect } from '@playwright/test'

test.describe('GP-5 · Estructura del nav en carga inicial', () => {
  test('S-02: nav visible dentro de 200ms en páginas internas [RED AHORA → fix Etapa 2 skip-animation]', async ({ page }) => {
    // waitUntil: 'commit' devuelve control tan pronto como el servidor responde,
    // antes de que JS hidrate. Permite capturar la opacidad en los primeros ms.
    await page.goto('/certificados', { waitUntil: 'commit' })

    // Poll: muestrear opacidad cada 50ms, 4 veces → ventana de 200ms
    let maxOpacity = 0
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(50)
      const opacity = await page.evaluate(() => {
        const nav = document.querySelector('nav')
        if (!nav) return 0
        return parseFloat(window.getComputedStyle(nav).opacity)
      })
      if (opacity > maxOpacity) maxOpacity = opacity
    }

    // RED AHORA: expo.out 1.4s → maxOpacity ≈ 0.000 a los 200ms
    // GREEN post-Etapa 2: gsap.set en internas → opacity = 1 en el primer frame
    expect(maxOpacity).toBeGreaterThan(0.9)
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
    // Nav legacy tiene su propia estructura (no es un <nav> fijo con ese border-radius)
    const navV2Elements = await page.locator('nav').count()

    // La página legacy puede tener 0 o 1 nav, pero si tiene 1 no debe ser NavV2
    // Check: no hay elemento con el pill style de NavV2 (clipPath inset)
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
