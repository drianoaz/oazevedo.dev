---
status: pending
title: 'Hooks de input: device tier, reading-activity, pointer'
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 05: Hooks de input: device tier, reading-activity, pointer

## Overview

Implementa os três hooks que produzem os sinais de entrada que alimentam a store
da Elis: o tier de dispositivo (capacidade/`prefers-reduced-motion`), o detector
de leitura ativa (quiet mode) e o alvo de cursor/toque normalizado para o gaze
procedural. Eles reusam os hooks existentes do projeto (`use-scroll-position` e
o padrão de IntersectionObserver de `use-anchor-observer`) e montam o
`BehaviorInputs` consumido a cada frame.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implementar `use-device-tier.ts` retornando `tier: 0 | 1 | 2` a partir de heurística de largura, ponteiro coarse e `prefers-reduced-motion` (reduced-motion → tier 0).
- MUST implementar `use-reading-activity.ts` que detecta quiet mode por scroll sustentado + dwell no artigo, reusando `use-scroll-position` e o padrão IntersectionObserver de `use-anchor-observer`.
- MUST expor as constantes de quiet-mode como tunáveis: `SCROLL_ACTIVE_MS ≈ 6000`, `DWELL_MS ≈ 8000`, `QUIET_EXIT_MS ≈ 2000` (ver TechSpec "Data Models").
- MUST implementar `use-pointer-target.ts` retornando o alvo de cursor/toque normalizado (ou `null` quando ausente) para o gaze.
- MUST guardar todo acesso a APIs de browser (`matchMedia`, listeners) para SSR (dentro de `useEffect`/subárvore `ssr:false`).
- A lógica de threshold do quiet-mode SHOULD ser extraída em função pura testável (decoupada do hook) para teste determinístico com clock simulado.
</requirements>

## Subtasks

- [ ] 5.1 Implementar `use-device-tier.ts` (heurística width/coarse-pointer/reduced-motion).
- [ ] 5.2 Implementar `use-reading-activity.ts` reusando `use-scroll-position` + IntersectionObserver.
- [ ] 5.3 Extrair a função pura de decisão de quiet-mode com as constantes tunáveis.
- [ ] 5.4 Implementar `use-pointer-target.ts` (cursor + toque, normalizado, com fallback `null`).
- [ ] 5.5 Montar o objeto `BehaviorInputs` para alimentar a store (`tick`).
- [ ] 5.6 Escrever os testes Vitest do detector de quiet-mode e do tiering.

## Implementation Details

Ver TechSpec "Component Overview" (hooks `use-device-tier`, `use-reading-activity`,
`use-pointer-target`) e "Data Models" (`BehaviorInputs` + constantes de
quiet-mode). Reusar — não modificar — os hooks existentes em `src/hooks/`. Os
inputs montados aqui são passados a `store.tick(dt, inputs)` na task 07. NÃO
duplicar a definição de `BehaviorInputs` da TechSpec.

### Relevant Files

- `src/hooks/use-scroll-position.ts` — reusado pelo detector de reading-activity (retorna scroll Y).
- `src/hooks/use-anchor-observer.ts` — padrão IntersectionObserver (`rootMargin`/`threshold`) a reusar para dwell no artigo.
- `src/components/elis/elis-store.ts` (task 03) — destino dos `BehaviorInputs`; define `tier`/`quiet`.
- `src/app/blog/[slug]/` — rota de artigo cujo corpo é observado para dwell.

### Dependent Files

- `src/components/elis/elis-scene.tsx` (task 07) — usa os hooks e injeta os inputs no `tick`.
- `src/components/elis/elis-control.tsx` (task 09) — reduced-motion → tier 0 conecta com `use-device-tier`.

### Related ADRs

- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md) — Tier 0 ambient-only/estático; tiers 1/2 com experiência completa.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Quiet mode é guardrail de leitura que tem precedência sobre comportamento lúdico.

## Deliverables

- `src/components/elis/use-device-tier.ts`, `use-reading-activity.ts`, `use-pointer-target.ts`.
- Função pura de decisão de quiet-mode com constantes tunáveis.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Testes do detector de quiet-mode **(REQUIRED)**.

## Tests

- Unit tests (Vitest, clock simulado):
  - [ ] Scroll sustentado por `> SCROLL_ACTIVE_MS` engaja quiet mode (`quiet === true`).
  - [ ] Dwell no artigo por `> DWELL_MS` sem scroll engaja quiet mode.
  - [ ] Após parar a leitura, quiet mode desengaja depois de `QUIET_EXIT_MS`.
  - [ ] `prefers-reduced-motion` força `tier === 0`.
  - [ ] Ponteiro coarse + largura pequena resultam em tier 1; desktop largo → tier 2.
  - [ ] `use-pointer-target` retorna `null` quando não há ponteiro/toque ativo.
- Integration tests:
  - [ ] Os `BehaviorInputs` montados refletem corretamente scroll/dwell/pointer/tier num cenário simulado de leitura.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Quiet-mode engaja/desengaja nos thresholds especificados.
- Nenhum acesso a browser API fora de `useEffect`/guarda SSR.
- Hooks existentes em `src/hooks/` permanecem inalterados.
