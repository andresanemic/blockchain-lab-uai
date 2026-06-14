/**
 * GP-1 · Restauración de scroll con Back
 *
 * HALLAZGO CRÍTICO (2026-06-14): toda la navegación del sitio es full page load.
 * Los links de proyecto (href="/certificados") y los de NavV2 son plain <a> tags —
 * no Next.js <Link>. LenisProvider solo intercepta clicks en a[href^="#"] (anchors
 * in-page). Toda navegación entre rutas recarga la página completa.
 *
 * Con full page load:
 * - LenisProvider remonta con scrollSaved.current = {} → no hay scroll guardado.
 * - window.history.scrollRestoration = 'manual' (línea 28 de LenisProvider.tsx)
 *   desactiva la restauración nativa via BFCache.
 * - El scroll siempre empieza en 0 al cargar cualquier página.
 *
 * Test 1 → RED AHORA: scroll no se restaura al volver a / (FPL borra el historial).
 * Permanecerá RED hasta que la navegación sea soft (Next.js <Link>) o se elimine
 * window.history.scrollRestoration = 'manual' para permitir BFCache.
 *
 * Test 2 → GREEN (regression guard): scroll en /certificados empieza en 0.
 *
 * El mecanismo de LenisProvider (scrollSaved) es correcto para soft nav —
 * actualmente no se ejerce porque el sitio no tiene <Link> inter-página.
 */

import { test, expect } from '@playwright/test'

/** Inyecta un link temporal para simular client-side navigation en Next.js App Router */
async function clientSideNavigate(page: import('@playwright/test').Page, href: string) {
  const id = '__test_csnav__'
  await page.evaluate((args) => {
    const existing = document.getElementById(args.id)
    if (existing) existing.remove()
    const link = document.createElement('a')
    link.href = args.href
    link.id = args.id
    Object.assign(link.style, {
      position: 'fixed', top: '0', left: '0', zIndex: '99999',
      display: 'block', padding: '4px', background: 'transparent',
    })
    document.body.appendChild(link)
  }, { id, href })
  await page.locator(`#${id}`).click()
  // waitForURL en vez de networkidle: Turbopack dev hace requests continuos que bloquean networkidle
  await page.waitForURL(`**${href}`, { timeout: 5000 })
}

test.describe('GP-1 · Scroll restoration tras Back (client-side navigation)', () => {

  test('LenisProvider restaura scroll de / al volver desde /certificados (client-side nav)', async ({ page }) => {
    // Nota: page.goBack() desde una entrada page.goto() hace full reload, borrando
    // scrollSaved.current. Por eso simulamos el "Back" como otra navegación soft
    // (funcionalmente equivalente para LenisProvider que es pathname-based).
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Usar Lenis API (window.scrollTo es ignorado por Lenis en modo controlado)
    await page.evaluate(() => {
      const lenis = (window as any).__lenis
      if (lenis) lenis.scrollTo(600, { immediate: true })
    })
    await page.waitForFunction(() => window.scrollY > 200, { timeout: 5000 })

    const scrollBefore = await page.evaluate(() => window.scrollY)
    expect(scrollBefore).toBeGreaterThan(200)

    // Soft nav a /certificados (LenisProvider cleanup guarda scrollSaved['/'] = 600)
    await clientSideNavigate(page, '/certificados')
    expect(page.url()).toContain('/certificados')

    // Scroll en /certificados debe estar en 0
    const scrollOnCert = await page.evaluate(() => window.scrollY)
    expect(scrollOnCert).toBeLessThan(100)

    // Soft nav de vuelta a / (LenisProvider effect lee scrollSaved['/'] = 600 → restaura)
    await clientSideNavigate(page, '/')
    await page.waitForFunction(() => window.scrollY > 100, { timeout: 5000 })

    const scrollAfterBack = await page.evaluate(() => window.scrollY)
    expect(scrollAfterBack).toBeGreaterThan(100)
  })

  test('scroll en /certificados empieza en 0 independientemente del scroll previo', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => {
      const lenis = (window as any).__lenis
      if (lenis) lenis.scrollTo(800, { immediate: true })
    })
    await page.waitForFunction(() => window.scrollY > 400, { timeout: 5000 })

    await clientSideNavigate(page, '/certificados')

    const scrollOnCert = await page.evaluate(() => window.scrollY)
    expect(scrollOnCert).toBeLessThan(100)
  })
})
