/**
 * GP-10 (revisado 2026-06-15) · Navegación del nav lleva a destino correcto
 *
 * Plataforma: desktop + móvil
 * Recorrido: (a) en home, verifica que el nav muestra los links de landing;
 *            (b) desde una página interna, verifica que el nav muestra links
 *            de páginas internas y NO muestra Áreas/Proyectos.
 *
 * DEBE: cada link tiene el href correcto según el contexto de página.
 * NO DEBE: mostrar href="/#proyectos" o href="/#areas" en páginas internas.
 *
 * Gate RED→GREEN (tests que fallan antes del fix de NavV2.tsx):
 *   S-02 [desktop]: nav interna NO tiene /#proyectos / /#areas
 *   S-05 [mobile]:  mob-links de interna NO tienen /#proyectos / /#areas
 *
 * Técnica: aserciones por href — inmune a ScrambleText, GSAP y clip-path.
 * Señal de hidratación desktop: a.nav-cta (Colaborar — siempre presente en nav).
 * Señal de hidratación mobile:  .mob-link (siempre en DOM, overlay opacity:0 o 1).
 *
 * Historial: GP-10 original cubría FPL a /#proyectos (gate RC-8, resuelto en
 * Etapa 3 de INC-001). RC-9 y RC-7b vueltos irrelevantes por cambio de scope.
 * Ver incidents/INC-001.md § Decisión de scope.
 */

import { test, expect } from '@playwright/test'

// ── Desktop (hereda viewport Desktop Chrome del config: 1280×720) ──────────

test.describe('GP-10 · Desktop — links del nav según contexto de página', () => {

  test('GP-10 S-01: [desktop / home] nav muestra links de landing (Proyectos, Áreas)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Esperar hidratación — nav-cta siempre presente en nav desktop post-hydration
    await page.waitForFunction(() => !!document.querySelector('a.nav-cta'), { timeout: 8000 })

    const nav = page.locator('nav')
    await expect(nav.locator('a[href="/#proyectos"]')).toHaveCount(1)
    await expect(nav.locator('a[href="/#areas"]')).toHaveCount(1)
    // No debe mostrar links de páginas internas en home
    await expect(nav.locator('a[href="/certificados"]')).toHaveCount(0)
    await expect(nav.locator('a[href="/validacion-videos"]')).toHaveCount(0)
  })

  test('GP-10 S-02: [desktop / interna] [gate] nav NO muestra Proyectos/Áreas — sí muestra links de páginas', async ({ page }) => {
    await page.goto('/certificados', { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => !!document.querySelector('a.nav-cta'), { timeout: 8000 })

    const nav = page.locator('nav')
    // RED antes del fix: nav muestra /#proyectos / /#areas (links de landing)
    // GREEN post-fix:    nav NO los muestra
    await expect(nav.locator('a[href="/#proyectos"]')).toHaveCount(0)
    await expect(nav.locator('a[href="/#areas"]')).toHaveCount(0)
    // Debe mostrar links de páginas internas
    await expect(nav.locator('a[href="/certificados"]')).toHaveCount(1)
    await expect(nav.locator('a[href="/validacion-videos"]')).toHaveCount(1)
  })

  test('GP-10 S-03: [desktop / interna] link "Certificados" tiene href correcto', async ({ page }) => {
    await page.goto('/certificados', { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => !!document.querySelector('a.nav-cta'), { timeout: 8000 })

    const link = page.locator('nav a[href="/certificados"]')
    await expect(link).toHaveCount(1)
    await expect(link).toHaveAttribute('href', '/certificados')
  })

})

// ── Mobile (390×844) ────────────────────────────────────────────────────────

test.describe('GP-10 · Mobile — links del overlay según contexto de página', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('GP-10 S-04: [mobile / home] overlay muestra links de landing (Proyectos, Áreas)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // .mob-link siempre en DOM (overlay opacity:0 pero renderizado)
    await page.waitForFunction(() => document.querySelectorAll('.mob-link').length > 0, { timeout: 8000 })

    const hrefs = await page.locator('.mob-link').evaluateAll(
      (els) => els.map((el) => (el as HTMLAnchorElement).getAttribute('href'))
    )
    expect(hrefs).toContain('/#proyectos')
    expect(hrefs).toContain('/#areas')
    expect(hrefs).not.toContain('/certificados')
    expect(hrefs).not.toContain('/validacion-videos')
  })

  test('GP-10 S-05: [mobile / interna] [gate] overlay NO muestra Proyectos/Áreas — sí muestra links de páginas', async ({ page }) => {
    await page.goto('/certificados', { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => document.querySelectorAll('.mob-link').length > 0, { timeout: 8000 })

    // RED antes del fix: hrefs contiene /#proyectos / /#areas
    // GREEN post-fix:    NO los contiene; contiene /certificados y /validacion-videos
    const hrefs = await page.locator('.mob-link').evaluateAll(
      (els) => els.map((el) => (el as HTMLAnchorElement).getAttribute('href'))
    )
    expect(hrefs).not.toContain('/#proyectos')
    expect(hrefs).not.toContain('/#areas')
    expect(hrefs).toContain('/certificados')
    expect(hrefs).toContain('/validacion-videos')
  })

})
