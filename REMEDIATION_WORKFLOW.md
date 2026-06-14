# REMEDIATION_WORKFLOW.md

Versión: 2.0 · Workflow de remediación y estabilización

---

# PROPÓSITO

Proceso para diagnosticar, corregir y validar errores en un proyecto **ya en desarrollo** (no greenfield), minimizando regresiones. Pensado para sistemas con historial de correcciones acumuladas donde arreglar un bug suele romper otra cosa.

Objetivos: priorizar causa raíz sobre parches, evitar debugging por intuición, preservar UX y comportamiento esperado, dejar conocimiento reutilizable.

Este documento es **metodología genérica y reutilizable**. Lo específico de cada proyecto vive en archivos aparte: `GOLDEN_PATHS.md`, `PROTECTED_SYSTEMS.md`, `/incidents`, `lore/`.

---

# DOS TRACKS

Antes de cualquier trabajo, clasificar la tarea:

- **FULL** — el cambio toca un High Risk System, un Protected System o un Golden Path. Ejecuta todas las fases.
- **LIGHT** — no toca ninguno de esos. Salta el análisis profundo (Historical Audit, System Inventory, Dependency Map) y va directo a diagnóstico puntual → plan mínimo → implementación.

Regla no negociable: **el track LIGHT igual corre la validación completa de Golden Paths.** Lo único que se omite es el análisis profundo de causa raíz, nunca el guard de regresión. Ante la duda → FULL.

---

# REFERENCIA POR NOMBRE

Las fases se referencian por **nombre** (ej. "fase CONTROLLED IMPLEMENTATION"), nunca por número. El orden puede cambiar; los nombres no.

---

# EVIDENCE HIERARCHY

Toda afirmación se basa en evidencia. Si hay contradicción, gana el nivel más alto:

1. Código actual
2. Comportamiento observable
3. Resultado de pruebas (Playwright)
4. Arquitectura detectada
5. Documentación histórica

El nivel 2 sólo es válido si proviene de una corrida real de Playwright o de una observación reportada por el humano. El modelo **no infiere** comportamiento runtime leyendo código.

---

# CONFIDENCE (CUALITATIVO)

Toda hipótesis lleva un nivel **+ evidencia concreta que lo justifica** (qué archivo, qué comportamiento). El número no importa; la evidencia sí.

- **ALTA** — convergen varios niveles de la jerarquía (código + comportamiento/prueba). Se puede implementar.
- **MEDIA** — evidencia razonable pero con un gap explícito. Implementar sólo documentando el riesgo residual y reforzando validación.
- **BAJA** — especulativa o sin evidencia de código. **No implementar.** Recopilar más evidencia primero.

Sin evidencia citada, la confianza es BAJA por defecto.

---

# GOLDEN PATHS

Recorridos críticos de usuario que **no pueden romperse nunca**.

- Los **define el humano** en `GOLDEN_PATHS.md` (lenguaje natural) antes de la fase VALIDATION DESIGN. Si el archivo no existe, el workflow se detiene y lo pide. El modelo no inventa Golden Paths.
- En VALIDATION DESIGN el modelo los traduce a **scripts de Playwright**. Los tests asertan **estado settled / estructura** (existe el elemento, layout correcto, sin bleed, scroll restaurado), corriendo con `reducedMotion: 'reduce'`. **Nunca** asertan timing ni feel de animación (genera falsos positivos).
- **Regla red-green:** cada script debe primero **fallar** contra el estado actual con el bug presente. Un test que nunca se vio fallar no es evidencia. Sólo tras verlo fallar se confía en su verde post-fix.
- El humano **aprueba los scripts** antes de usarlos como gate.

---

# PROTECTED SYSTEMS

Componentes ya estabilizados (listados en `PROTECTED_SYSTEMS.md`). Si una modificación los afecta: informar explícitamente, explicar impacto, correr validación completa. Promover un sistema a Protected sólo con confirmación humana, nunca automático.

---

# HIGH RISK SYSTEMS

Routing, Navigation, State Management, Responsive Layer, Animation Layer (GSAP / ScrollTrigger), History API, Scroll Systems (Lenis), Shared Components. Cualquier cambio aquí → track FULL, validación completa, sin excepciones.

---

# SEVERIDAD DE REGRESIÓN

- **Crítica** — Golden Path roto o Protected System roto. Detener y revertir.
- **Media** — degradación funcional o de UX fuera de un Golden Path.
- **Menor** — cosmético, sin impacto funcional.

Cualquier regresión crítica o media → detener y revertir al checkpoint.

---

# NO SOLUTION MODE

Hasta cerrar REMEDIATION PLAN: no escribir código, no modificar archivos, no commits, no asumir causa raíz, no cambios preventivos. Comprender → diagnosticar → recién entonces implementar.

---

# PHASE GATE SYSTEM

Ninguna fase cierra hasta que la siguiente confirme que la información recibida es suficiente. Evidencia nueva puede **reabrir cualquier fase anterior**; no continuar hasta resolver la deficiencia.

---

# HIGIENE DE CONTEXTO

- Cada fase escribe su informe a `reports/<NOMBRE_FASE>.md`.
- `/clear` entre fases. La memoria persistente son los archivos (`reports/`, `incidents/`, `GOLDEN_PATHS.md`), no el historial del chat.
- No leer el código completo. Leer estructura/arquitectura primero, luego drill-down sólo en los sistemas sospechosos.

---

# FASES — TRACK FULL

## HISTORICAL AUDIT

Analizar como memoria histórica (no como fuente de verdad): `/incidents`, `lore/`, `reports/PRE_WORKFLOW_LEADS.md` (si existe) y `changelog.md` (si existe). Toda info histórica se revalida contra el código actual. Las entradas marcadas 🔴 en PRE_WORKFLOW_LEADS son sospechosas de haber causado bugs actuales: priorízalas como leads.

Entregables: patrones recurrentes, regresiones históricas, áreas frágiles.

**Exit criteria:** existe lista de patrones, de regresiones históricas y de áreas frágiles, cada ítem con referencia al incidente o commit. Si falta una, la fase queda abierta.

STOP — aprobación humana.

## SYSTEM INVENTORY

Inventariar componentes, listeners, observers, hooks, dependencias, estados compartidos.

**Exit criteria:** cada sistema sospechoso del intake aparece mapeado con sus dependencias. Si falta alguno, abierta.

STOP.

## ROOT CAUSE ANALYSIS

Identificar causas raíz. Cada hipótesis lleva Confidence + evidencia concreta (archivo + comportamiento).

**Exit criteria:** cada síntoma del intake tiene al menos una hipótesis con Confidence y evidencia citada; ninguna causa raíz queda asumida sin evidencia. Si falta, abierta.

STOP.

## DEPENDENCY MAP

Mapear dependencias críticas, puntos únicos de falla, sistemas acoplados.

**Exit criteria:** todo sistema tocado por las causas raíz tiene sus dependencias mapeadas. Si falta, abierta.

STOP.

## REMEDIATION PLAN

Diseñar el plan: etapas, scope por etapa, archivos afectados, riesgos, validaciones requeridas.

**Exit criteria:** cada etapa tiene scope cerrado, archivos listados y Golden Paths asociados a validar. Si falta, abierta.

STOP.

## VALIDATION DESIGN

Precondición: `GOLDEN_PATHS.md` existe y está aprobado. Si no, detener y pedirlo.

Traducir cada Golden Path a script Playwright. Probar cada uno contra el estado actual: **debe fallar (red)**. Construir matriz de validación (Golden Paths + navegación + responsive + estados + plataformas).

**Exit criteria:** cada Golden Path tiene script aprobado por el humano y demostrado en rojo sobre el bug actual. Si alguno no fue visto fallar, abierta.

STOP.

## CONTROLLED IMPLEMENTATION

1. Crear checkpoint git (branch o commit) antes de tocar nada.
2. Implementar **sólo** la etapa aprobada. Sin ampliar scope, sin refactors innecesarios, sin tocar sistemas fuera del alcance. Documentar cambios.
3. Correr la matriz completa + todos los Golden Paths. Los scripts en rojo deben pasar a verde (red→green).
4. Asignar Confidence al resultado, con evidencia.

Si aparece regresión crítica o media: detener, revertir al checkpoint, documentar incidente, indicar qué fase reabrir.

STOP.

## QA LOOP

Tras cada implementación: correr matriz + Golden Paths, comparar comportamiento, detectar regresiones y efectos secundarios. No avanzar mientras exista regresión crítica/media o Golden Path roto.

**El Confidence final lo asigna el subagente `verifier`** (contexto fresco, read-only), nunca el agente que implementó. El que hace el trabajo no se autocalifica: el verifier reconstruye los hechos, vuelve a correr toda la suite y devuelve VEREDICTO + Confidence + evidencia. Su veredicto cierra el QA LOOP.

Evidencia de nivel 2: Playwright debe estar configurado con `trace`, `video` y `screenshot` on-failure, para que el comportamiento runtime quede capturado y no dependa de afirmaciones.

## FINAL AUDIT

Verificar estabilidad, Protected Systems, Golden Paths, deuda técnica, riesgos futuros. Entregar: resueltos, pendientes, riesgos, recomendaciones.

---

# FASES — TRACK LIGHT

TARGETED DIAGNOSIS (hipótesis + Confidence + evidencia, sólo el área afectada) → REMEDIATION PLAN mínimo → CONTROLLED IMPLEMENTATION (con checkpoint git y red-green sobre los Golden Paths afectados) → QA LOOP.

Si en cualquier punto el cambio resulta tocar un High Risk / Protected / Golden Path no previsto → escalar a FULL.

---

# CONTINUOUS IMPROVEMENT LOOP

Tras cada incidente resuelto, crear/actualizar `incidents/INC-XXX.md` (síntoma, causa raíz, solución, Confidence, validaciones, regresiones, estado) y actualizar `incidents/index.md`. Campos faltantes → marcar **UNKNOWN**, nunca asumir.

**Cada incidente resuelto deja un test de Playwright permanente** en la suite (y en CI). La memoria de regresiones deja de ser prosa y pasa a ser ejecutable: lo que se rompió una vez queda vigilado para siempre.

**Promoción a lore (genérico · opcional · human-gated).** Si la causa raíz es un patrón **generalizable** a otros proyectos (no una rareza de este código) y el fix quedó verificado en **ALTA**, propón al humano destilar una entrada en `lore/<sistema>.md`. Reglas: nunca automático; sólo lo generalizable y verificado; se escribe como **pista, no receta**, con confianza `conjetura` en la primera aparición y `confirmado` recién cuando el patrón se repite. La mayoría de los incidentes **NO** ascienden a lore — si todo asciende, recreas el monolito de 40 que estás dejando atrás. Al crear o promover una entrada de lore, **actualiza `lore/index.md`** (una línea: sistema · síntoma · confianza · archivo).

---

# ROADMAP — CONSTRUIDO, NO ACTIVAR AÚN

Estas mejoras ya existen como archivos, pero **NO deben activarse** hasta tener datos de fricción de un run real. Activarlas antes es over-process.

- **Loops autónomos (Stop hook).** Archivo: `.claude/hooks/golden-paths-gate.sh` (+ registro en `.claude/settings.json`). Deja que el track LIGHT y el ciclo red→green iteren solos con Playwright como juez, sin gate humano por turno.
  Activar cuando: los scripts de Golden Path se hayan demostrado fiables (red-green real) en al menos un ciclo completo.

- **Paralelizar fases pesadas con subagentes.** Archivos: `.claude/agents/inventory-scanner.md`, `dependency-mapper.md`. Corren System Inventory y Dependency Map en contexto aislado devolviendo resumen; o usa git worktrees.
  Activar cuando: un run real degrade por contexto lleno y la espera lo justifique.
