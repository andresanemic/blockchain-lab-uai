/**
 * GP-4 · Sin bleed desktop/móvil al cambiar viewport
 *
 * HALLAZGO (2026-06-14): Tailwind v4 genera `display: none !important` para la
 * clase `hidden`, lo que gana sobre el inline style={{ display: 'flex' }}.
 * La inspección en browser confirma: computedDisplay = 'none' en mobile (390px)
 * aunque inlineDisplay = 'flex'. El conflicto de código existe pero NO causa
 * bleed visual. Ver ROOT_CAUSE_ANALYSIS.md — addendum a RC-2.
 *
 * Estado: todos los tests son REGRESSION GUARDS (no gates rojo-verde de Etapa 1).
 * RC-2 sigue siendo higiene de código recomendada, pero no es bug crítico.
 */

import { test, expect } from '@playwright/test'

test.describe('GP-4 · Viewport bleed — desktop nav visible en móvil', () => {
  test('A · desktop nav display:none en viewport 390px [regression guard]', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const desktopNav = page.locator('nav').first()
    await expect(desktopNav).toBeAttached()

    const display = await desktopNav.evaluate(el =>
      window.getComputedStyle(el).display
    )
    // BUG: actualmente 'flex' porque inline style gana sobre className="hidden md:flex"
    // ESPERADO post-fix: 'none'
    expect(display).toBe('none')
  })

  test('A · desktop nav display:none en viewport 390px — en /certificados [regression guard]', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')

    const desktopNav = page.locator('nav').first()
    await expect(desktopNav).toBeAttached()

    const display = await desktopNav.evaluate(el =>
      window.getComputedStyle(el).display
    )
    expect(display).toBe('none')
  })

  test('A · desktop nav oculto tras resize desktop→móvil [regression guard]', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Resize a móvil — los media queries CSS se recomputan instantáneamente
    await page.setViewportSize({ width: 390, height: 844 })

    const desktopNav = page.locator('nav').first()
    const display = await desktopNav.evaluate(el =>
      window.getComputedStyle(el).display
    )
    expect(display).toBe('none')
  })

  test('B · hamburger NO visible en viewport desktop 1440px [regression guard]', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Mobile nav: className="flex md:hidden" sin display inline → CSS funciona correctamente
    // Hamburger oculto porque su contenedor padre tiene display:none en >=md
    const hamburger = page.locator('button[aria-label="Abrir menú"]')
    await expect(hamburger).toBeHidden()
  })
})
