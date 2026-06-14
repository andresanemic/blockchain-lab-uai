/**
 * GP-3 · Navbar móvil (abrir / cerrar / navegación / Back)
 *
 * Nota sobre red-green: con el código actual NavV2 remonta en cada ruta, por lo
 * que el estado menuOpen se resetea automáticamente. Los tests pasarán ahora
 * Y después del fix (RC-1) siempre que usePathname + reset estén correctamente
 * implementados. Son regression guards para el riesgo alto documentado en el plan:
 * "menuOpen persiste entre rutas si usePathname no se añade".
 *
 * Un test que falle post-Etapa 2 (sin el reset usePathname) indica regresión crítica.
 */

import { test, expect } from '@playwright/test'

test.describe('GP-3 · Mobile nav — toggle y estado tras navegación', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hamburger visible en móvil (móvil nav activo)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // En móvil, el botón hamburger debe ser visible
    const hamburger = page.locator('button[aria-label="Abrir menú"]')
    await expect(hamburger).toBeVisible()

    // Desktop nav debe estar oculto en móvil (mismo check que GP-4)
    const desktopNav = page.locator('nav').first()
    const display = await desktopNav.evaluate(el =>
      window.getComputedStyle(el).display
    )
    expect(display).toBe('none')
  })

  test('hamburger abre overlay y cambia aria-label', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Estado inicial
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Cerrar menú"]')).not.toBeVisible()

    // Abrir menú
    await page.locator('button[aria-label="Abrir menú"]').click()

    // Estado abierto
    await expect(page.locator('button[aria-label="Cerrar menú"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Abrir menú"]')).not.toBeVisible()
  })

  test('cerrar menú con botón X restaura estado inicial', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('button[aria-label="Abrir menú"]').click()
    await expect(page.locator('button[aria-label="Cerrar menú"]')).toBeVisible()

    await page.locator('button[aria-label="Cerrar menú"]').click()
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible()
  })

  test('overlay cerrado tras navegar (click en mob-link)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Abrir menú
    await page.locator('button[aria-label="Abrir menú"]').click()
    await expect(page.locator('button[aria-label="Cerrar menú"]')).toBeVisible()

    // Navegar via link del overlay
    await page.locator('.mob-link').first().click()
    await page.waitForLoadState('networkidle')

    // En la nueva página, menú debe estar cerrado
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Cerrar menú"]')).not.toBeVisible()
  })

  test('menú cerrado tras Back [regression guard post-RC-1]', async ({ page }) => {
    // Este test es el guard crítico para el riesgo de Etapa 2:
    // "menuOpen persiste entre rutas si usePathname no se añade"
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Abrir menú y luego navegar por URL (sin click en mob-link)
    await page.locator('button[aria-label="Abrir menú"]').click()
    await expect(page.locator('button[aria-label="Cerrar menú"]')).toBeVisible()

    // Navegar directamente (simula Back o cambio de ruta externo)
    await page.goto('/certificados')
    await page.waitForLoadState('networkidle')

    // Back a landing
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Menú debe estar cerrado (no debe haber quedado abierto entre rutas)
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible()
  })
})
