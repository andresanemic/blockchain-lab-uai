# lore/testing.md — Testing (Playwright / automatización)

> Pistas históricas, NO fuente de verdad. Leads a validar, no recetas.
> ⚠ Validar contra código actual antes de actuar.

---

### [testing] MutationObserver + gap discriminator para testear `gsap.set` vs `gsap.fromTo` sin depender de timing

- Contexto: Suite Playwright que debe verificar si una animación GSAP fue saltada (`gsap.set` — instantáneo) vs ejecutada (`gsap.fromTo` — tween con duration). Los métodos basados en timing absoluto (ej. "¿es opacity > 0.9 dentro de N ms de carga?") son frágiles: dependen de compile time del dev server, velocidad de hydration y overhead de CI.
- Causa probable: N/A (patrón de testing).
- Pista: Inyectar via `page.addInitScript` un `MutationObserver` que registre (a) el tiempo de la primera mutación de `style` en el elemento (`firstMutationTime`) y (b) el tiempo en que `opacity >= 0.999` (`resolvedTime`). El gap `resolvedTime - firstMutationTime` discrimina: gap ≈ 0ms → `gsap.set` (una sola escritura); gap ≈ duration completa → `gsap.fromTo`. El threshold entre ambos valores (ej. 500ms) es independiente del tiempo de carga del servidor. El observer debe iniciarse con `requestAnimationFrame(attachObserver)` para capturar la primera mutación GSAP (que ocurre al montar el componente) antes de que React pinte el frame. Exponer el resultado como `window.__navAnimMs` y esperar con `waitForFunction`.
- Confianza: conjetura (primera aparición — INC-001 / gp5 S-02)
- ⚠ Validar contra código actual.
