/**
 * GP-10 · Link de nav a sección con pin GSAP llega al destino correcto desde página interna
 *
 * Gate RC-8 (isFirstPath bypasea hash handling en FPL):
 *   FPL a /#proyectos reproduce el bug — mismo efecto que clickear "Proyectos"
 *   desde /certificados, ya que en ambos casos LenisProvider monta fresco con isFirstPath=true.
 *   El browser auto-scroll llega a #proyectos ANTES de que GSAP instale el
 *   pin-spacer de BlockchainV2 (≈2× altura sección). Al instalarse, #proyectos
 *   se desplaza hacia abajo; el viewport queda en la posición del auto-scroll nativo,
 *   que ahora apunta a la sección Blockchain en lugar de Proyectos.
 *   Fix: isFirstPath no bypasea hash handling cuando location.hash tiene valor →
 *   setTimeout(400ms) → ScrollTrigger.refresh() → lenis.scrollTo(hash).
 *
 * Nota de carga: se usa waitUntil:'domcontentloaded' en lugar del default 'load'
 *   para evitar que el hash-scroll (que revela imágenes lazy de Proyectos) bloquee
 *   indefinidamente la espera de navegación.
 *
 * GP-10B (RC-6) descartado 2026-06-15:
 *   La premisa "FooterV2 no incluye id='contacto' en /certificados" era incorrecta.
 *   FooterV2.tsx:79 tiene id="contacto" y se renderiza en todas las páginas.
 *   querySelector("#contacto") siempre encuentra el elemento → Guard 2 llama
 *   e.preventDefault() correctamente → no hay URL pollution. Bug no existe.
 *   Ver REMEDIATION_PLAN_etapa3.md § RC-6 descartado.
 */

import { test, expect } from '@playwright/test'

test.describe('GP-10 · Nav section links desde páginas internas', () => {

  test('GP-10: [gate RC-8] FPL a /#proyectos aterriza en sección correcta', async ({ page }) => {
    // FPL directo — equivalente al click desde /certificados:
    // en ambos casos LenisProvider monta fresco con isFirstPath=true.
    await page.goto('/#proyectos', { waitUntil: 'domcontentloaded' })

    // Esperar a que React haya hidratado y renderizado las secciones clave
    await page.waitForFunction(
      () => !!document.getElementById('proyectos') && !!document.getElementById('blockchain'),
      { timeout: 8000 }
    )

    // Dar tiempo al GSAP para instalar el pin-spacer de BlockchainV2 y al
    // useEffect([pathname]) de LenisProvider para ejecutarse (y no corregir en RED).
    // 2500ms: GSAP corre en el primer frame tras mount (<<100ms); los 400ms del
    // setTimeout de LenisProvider ya habrían corrido si el fix estuviera aplicado.
    await page.waitForTimeout(2500)

    const { proyectosTop, viewH, pinSpacerExists, scrollY } = await page.evaluate(() => ({
      proyectosTop: Math.round(document.getElementById('proyectos')?.getBoundingClientRect().top ?? 9999),
      viewH: window.innerHeight,
      pinSpacerExists: !!document.querySelector('.pin-spacer'),
      scrollY: Math.round(window.scrollY),
    }))

    // RED:   pin-spacer instalado + proyectosTop >> viewH
    //        (viewport apuntando a Blockchain; isFirstPath guard bloquea lenis.scrollTo)
    // GREEN: 0 ≤ proyectosTop < viewH
    //        (fix corrió lenis.scrollTo('#proyectos') → posición corregida)
    expect(
      proyectosTop,
      `#proyectos.top=${proyectosTop}px debe ser < viewH=${viewH}px [pinSpacer=${pinSpacerExists}, scrollY=${scrollY}] (RC-8)`
    ).toBeLessThan(viewH)
  })
})
