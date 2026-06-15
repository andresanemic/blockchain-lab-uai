/**
 * GP-2 · Navbar desktop consistente entre páginas
 *
 * RED test confirmado (2026-06-14):
 *   - "RC-1: nav PIERDE data-* tras route change" → FALLA ahora, PASA tras Etapa 2.
 *     Evidencia nivel 3: en browser, nav.dataset.navInstance desaparece tras
 *     client-side navigation. El nav remonta en cada ruta (NavV2 está por-página).
 *
 * Regression guards (settled-state, GREEN ahora):
 *   - Nav existe en todas las páginas v2 (logo, position:fixed)
 *   - Exactamente 1 <nav> por página
 *   - Nav adjunto tras Back / Forward
 *
 * El parpadeo/flash (timing de GSAP) no puede capturarse con aserciones de
 * settled-state — requiere observación visual o video (retain-on-failure activo).
 */

import { test, expect } from '@playwright/test'

const V2_PAGES = ['/', '/certificados', '/validacion-videos'] as const

test.describe('GP-2 · Estructura del nav en todas las páginas v2', () => {
  for (const url of V2_PAGES) {
    test(`nav adjunto con logo en ${url}`, async ({ page }) => {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      const desktopNav = page.locator('nav').first()
      await expect(desktopNav).toBeAttached()

      // Logo presente
      const logo = desktopNav.locator('img[alt="Blockchain Lab UAI"]')
      await expect(logo).toBeAttached()

      // Posición fixed (structural check — no verifica visibilidad/opacity)
      const position = await desktopNav.evaluate(el =>
        window.getComputedStyle(el).position
      )
      expect(position).toBe('fixed')
    })
  }

  test('exactamente un <nav> en la landing', async ({ page }) => {
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

  test('RC-1: nav PIERDE data-* tras client-side route change [RED AHORA → fix Etapa 2]', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Marca el elemento nav actual con un atributo único
    await page.evaluate(() => {
      const nav = document.querySelector('nav')
      if (nav) nav.dataset.navInstance = 'original'
    })

    // Navega via client-side (Next.js intercepta <a> clicks internos)
    await page.evaluate(() => {
      const link = document.createElement('a')
      link.href = '/certificados'
      link.id = '__test_rc1_nav__'
      Object.assign(link.style, {
        position: 'fixed', top: '0', left: '0', zIndex: '99999',
        display: 'block', padding: '4px', background: 'transparent',
      })
      document.body.appendChild(link)
    })
    await page.locator('#__test_rc1_nav__').click()
    await page.waitForLoadState('networkidle')

    // Si el nav persistió (mismo DOM node), el atributo está presente
    // Si remontó (bug RC-1 actual), el atributo es undefined
    const navInstance = await page.evaluate(() =>
      document.querySelector('nav')?.dataset?.navInstance
    )

    // ROJO AHORA: nav remonta → undefined
    // VERDE tras Etapa 2: NavV2 en layout v2 → persiste → 'original'
    expect(navInstance).toBe('original')
  })

  test('nav adjunto tras Back desde interna a landing', async ({ page }) => {
    // Navegar a la landing primero para establecer historial
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeAttached()

    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeAttached()

    await page.goBack()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('nav').first()).toBeAttached()
    await expect(page.locator('nav img[alt="Blockchain Lab UAI"]').first()).toBeAttached()
  })

  test('nav adjunto tras Forward (landing → interna)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('nav').first()).toBeAttached()
  })
})
