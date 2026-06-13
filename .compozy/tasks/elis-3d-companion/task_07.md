---
status: pending
title: '`ElisScene`: Canvas, load, crossfade de clips, gaze procedural'
type: frontend
complexity: high
dependencies:
  - task_04
  - task_05
  - task_06
---

# Task 07: `ElisScene`: Canvas, load, crossfade de clips, gaze procedural

## Overview

Monta a cena 3D da Elis: o `<Canvas frameloop="demand">` transparente com luz
flat e sem sombras dinâmicas, o carregamento do `elis.glb` via `useGLTF` +
`DracoLoader` (decoder self-hosted), o crossfade entre clips dirigido pelo
seletor (task 04) via `useAnimations`, o gaze procedural por bone em cima da
animação, e o `tick(dt)` da store dentro do `useFrame`. Faz o `dynamic`-import
`ssr:false` da cena dentro do `index.tsx` com `<Suspense>`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST renderizar `<Canvas frameloop="demand">` com fundo transparente (alpha), luz flat (`ambient` + um `directional`) e sem sombras dinâmicas (no máximo contact shadow baked/fake).
- MUST carregar `public/elis.glb` via `useGLTF` configurado com `DracoLoader` apontando para o decoder self-hosted em `public/draco/`.
- MUST dirigir o crossfade entre clips com drei `useAnimations`, usando o seletor/tabela de transição da task 04.
- MUST aplicar gaze procedural (lerp por bone da cadeia head/neck no `useFrame`) em direção ao alvo de `use-pointer-target` (task 05), por cima do clip ativo.
- MUST chamar `store.tick(dt, inputs)` (task 03) a cada frame, montando `BehaviorInputs` a partir dos hooks da task 05.
- MUST fazer `dynamic`-import da cena com `ssr: false`, dentro de `<Suspense fallback={null}>`, a partir de `index.tsx`.
- MUST tratar falha de load do modelo/decoder resolvendo para renderizar nada (overlay vazio) — Elis nunca pode lançar erro na página.
</requirements>

## Subtasks

- [ ] 7.1 Criar `elis-scene.tsx` com o `<Canvas frameloop="demand">` transparente + luz flat.
- [ ] 7.2 Configurar `useGLTF` + `DracoLoader` com o decoder self-hosted; carregar `elis.glb`.
- [ ] 7.3 Cabear o crossfade via `useAnimations` dirigido pelo seletor da task 04.
- [ ] 7.4 Implementar o gaze procedural por bone (lerp head/neck) a partir de `use-pointer-target`.
- [ ] 7.5 Chamar `store.tick(dt, inputs)` no `useFrame` com os `BehaviorInputs` dos hooks da task 05.
- [ ] 7.6 Cabear o `dynamic`-import `ssr:false` + `<Suspense>` no `index.tsx` e o fallback de erro (render nada).
- [ ] 7.7 Escrever os testes (helpers puros de gaze + smoke do import dinâmico).

## Implementation Details

Ver TechSpec "Component Overview" (`ElisScene`) e ADR-005 (clips baked
crossfadeados + gaze procedural). O `tick` não deve causar re-render React (a
store é externa, ADR-003). A orquestração do loop on-demand (invalidate, pausa,
DPR cap, relocação) é a task 08 — aqui apenas estabelecer `frameloop="demand"` e
a estrutura. Extrair a matemática de gaze (clamp/lerp do alvo→ângulo do bone)
como função pura testável. NÃO duplicar interfaces da TechSpec.

### Relevant Files

- `src/components/elis/index.tsx` (task 01) — entry; recebe o `dynamic`-import `ssr:false` + `<Suspense>`.
- `src/components/elis/elis-clips.ts` (task 04) — seletor/tabela que dirige o crossfade.
- `src/components/elis/elis-store.ts` (task 03) — `tick(dt, inputs)` no `useFrame`.
- `src/components/elis/use-pointer-target.ts` (task 05) — alvo do gaze.
- `src/components/elis/use-device-tier.ts` / `use-reading-activity.ts` (task 05) — montam `BehaviorInputs`.
- `public/elis.glb` + `public/draco/` (task 06) — asset e decoder carregados.

### Dependent Files

- `src/components/elis/elis-scene.tsx` — estendido pela task 08 (loop) e tasks 10–13 (interações/play).
- `src/app/layout.tsx` — monta `<Elis />`, que agora renderiza a cena de fato.

### Related ADRs

- [ADR-005: Baked Animation Clips on a Draco-Compressed GLB with Procedural Gaze](adrs/adr-005.md) — Crossfade por humor + gaze procedural.
- [ADR-003: Mood/Energy State in an External Store Driven by the Render Loop](adrs/adr-003.md) — `tick` no `useFrame`, sem re-render React por frame.
- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md) — Base `frameloop="demand"` (orquestração completa na task 08).

## Deliverables

- `src/components/elis/elis-scene.tsx` (Canvas, load Draco, crossfade, gaze, tick).
- `index.tsx` com `dynamic`-import `ssr:false` + `<Suspense>` e fallback de erro.
- Helper puro de gaze extraído e testável.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Teste de integração do load/render da cena **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] O helper de gaze converte um alvo normalizado em ângulo de bone com clamp dentro dos limites (não vira a cabeça além do range).
  - [ ] Com `use-pointer-target` retornando `null`, o gaze relaxa para a pose neutra (sem NaN/jump).
  - [ ] O seletor escolhido para um estado de store resulta no clip esperado passado ao crossfade.
- Integration tests:
  - [ ] Falha de load do `elis.glb`/decoder resolve para renderizar nada (overlay vazio) sem lançar erro na página.
  - [ ] Smoke: o `dynamic`-import `ssr:false` resolve e a cena monta sob `<Suspense>` sem erro de SSR.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Elis renderiza com fundo transparente, luz flat e sem sombras dinâmicas.
- Crossfade reflete o humor da store; gaze segue o cursor/toque suavemente.
- Falha de asset nunca propaga erro para a página.
