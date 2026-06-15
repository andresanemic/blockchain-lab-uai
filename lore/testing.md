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

---

### [testing] Verificar presencia de elementos en browser real antes de escribir análisis o tests basados en code-reading

- Contexto: INC-001 Etapa 3 — GP-10B fue diseñado asumiendo que `#contacto` no existe en `/certificados`. ROOT_CAUSE_ANALYSIS afirmaba que `app/certificados/page.tsx` no incluye `ContactV2` y por tanto `id="contacto"` no está en el DOM. Sin embargo, `FooterV2.tsx:79` tiene `id="contacto"` en su root element y FooterV2 se renderiza en todas las páginas. El análisis de código puro buscó `ContactV2` (el componente específico) en lugar de buscar el atributo `id="contacto"` en todos los componentes — detectó correctamente la ausencia de ContactV2, pero no detectó que FooterV2 también porta ese ID.
- Causa probable: code-reading produce análisis de intención (¿qué componentes se incluyen?); browser real produce análisis de comportamiento (¿qué existe en el DOM?). Son preguntas distintas para casos donde múltiples componentes pueden definir el mismo ID.
- Pista: antes de escribir una aserción Playwright sobre "este elemento no existe en /X" (o "este elemento existe"), navegar a `/X` en un browser real y ejecutar `document.getElementById(id)` o `document.querySelectorAll('[id="X"]')`. Un grep de `id="contacto"` en `components/v2/**` (en lugar de grep de `ContactV2` en `page.tsx`) habría detectado FooterV2 en segundos.
- Confianza: confirmado (INC-001 Etapa 3 — detectado al intentar demostrar RED en GP-10B; bug no pudo mostrarse RED porque no existe)
- ⚠ Patrón general: para cualquier aserción de presencia/ausencia de ID en el DOM, siempre verificar en browser. Especialmente cuando hay componentes de layout (header, footer, nav) que se renderizan en todas las páginas vía root layout.
