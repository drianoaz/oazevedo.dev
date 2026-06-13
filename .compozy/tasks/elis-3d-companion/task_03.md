---
status: pending
title: Store externa de humor/energia + `behaviors`
type: frontend
complexity: high
dependencies:
  - task_01
  - task_02
---

# Task 03: Store externa de humor/energia + `behaviors`

## Overview

Implementa o coração da simulação de "pet vivo": uma store externa plana que
mantém o estado de humor/energia da Elis, com `tick(dt)` (decay de energia +
boost por interação + jitter com RNG semeado) e funções puras de comportamento
que mapeiam estado+inputs em uma intenção. É a única fonte de verdade para
seleção de animação, sinal "active vs rest" e a UI — atualizada dentro do
`useFrame` e exposta ao React só na borda via `useSyncExternalStore`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implementar `elis-store.ts` com a interface `ElisStore` da TechSpec ("Core Interfaces"): `getSnapshot`, `subscribe`, `tick(dtMs, inputs)`, `notify(event)`, `setPreference(p)`.
- MUST modelar `ElisState` (`mood`, `energy` 0..1, `activity`, `quiet`, `tier`, `preference`) como objeto module-level mutado por `tick`, sem causar re-render por frame.
- MUST implementar `behaviors.ts` como funções **puras** `(state, inputs) → intent` (idle, sleep, glance, wander, seek-attention) sem nenhuma referência a React ou Three.
- MUST usar um RNG **semeável** para que o jitter de humor seja determinístico em dev/test.
- MUST derivar `activity: 'rest'` quando dormindo/quiet/minimal e `'active'` caso contrário (sinal que a task 08 usa para parar o loop).
- MUST aceitar um clock injetável/simulado para os testes (não depender de `Date.now()` direto na lógica testável).
- `setPreference` PODE apenas atualizar o estado em memória nesta task; a persistência em `localStorage` é cabeada na task 09 (manter o ponto de extensão claro).
</requirements>

## Subtasks

- [ ] 3.1 Definir os tipos `Mood`, `Activity`, `Preference`, `ElisState`, `ElisStore`, `ElisEvent`, `BehaviorInputs`.
- [ ] 3.2 Implementar a store module-level: `getSnapshot`/`subscribe` (padrão `useSyncExternalStore`) e o objeto de estado.
- [ ] 3.3 Implementar `tick(dtMs, inputs)`: decay de energia, boost por interação, jitter via RNG semeado, e transição de humor por thresholds de energia.
- [ ] 3.4 Implementar `notify(event)` para os eventos discretos (`click`, `scroll`, `pointermove`, `visibility`, `pickup-toy`).
- [ ] 3.5 Implementar `behaviors.ts` (funções puras → intent) e derivar `activity`.
- [ ] 3.6 Implementar o RNG semeável e o ponto de injeção de clock.
- [ ] 3.7 Escrever os testes Vitest dos cenários de decay/threshold/quiet/preference.

## Implementation Details

Tudo novo vive em `src/components/elis/`. Ver TechSpec "Core Interfaces" para o
contrato exato de `ElisStore` e `ElisState`, "Data Models" para `BehaviorInputs`
e `ElisEvent`, e "Error handling conventions" para o RNG semeável. NÃO duplicar
as interfaces aqui — referenciar a TechSpec. A store NÃO deve disparar
re-render por frame; React só lê via `useSyncExternalStore` na borda da UI
(ADR-003).

### Relevant Files

- `src/components/elis/index.tsx` — entry criada na task 01; consumirá a store futuramente.
- `src/hooks/use-on-change.ts` — padrão existente de detecção de mudança (referência de estilo para lógica sync).
- `tsconfig.json` — strict mode; tipos devem ser exaustivos.

### Dependent Files

- `src/components/elis/elis-clips.ts` (task 04) — o seletor de clips lê o intent/estado da store.
- `src/components/elis/use-*.ts` (task 05) — os hooks montam `BehaviorInputs` e alimentam a store.
- `src/components/elis/elis-scene.tsx` (task 07) — chama `tick` no `useFrame`.
- `src/components/elis/elis-control.tsx` (task 09) — lê/escreve `preference` via `useSyncExternalStore`.

### Related ADRs

- [ADR-003: Mood/Energy State in an External Store Driven by the Render Loop](adrs/adr-003.md) — Store plana ticada no `useFrame`, React só na borda.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — A simulação emergente de humor/energia é o hub de comportamento.
- [ADR-008: Validation Strategy](adrs/adr-008.md) — RNG semeado + tempo simulado para testes determinísticos.

## Deliverables

- `src/components/elis/elis-store.ts` implementando `ElisStore`.
- `src/components/elis/behaviors.ts` com funções puras de intenção.
- RNG semeável e clock injetável.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Testes de integração da store↔behaviors (tick → intent) **(REQUIRED)**.

## Tests

- Unit tests (Vitest, RNG semeado + clock simulado):
  - [ ] Energia decai ao longo de `tick`s sucessivos e, ao cruzar o threshold baixo, `mood` vira `sleepy` e depois `activity` vira `rest` (cenário decay → sleepy → sleep → rest).
  - [ ] `notify({type:'click'})` aplica boost de energia e move o humor para um estado mais ativo.
  - [ ] Com `inputs.quiet === true`, o intent resultante é de movimento mínimo (nenhuma intenção conspícua como `wander`).
  - [ ] Com `tier === 0`, a store não produz intents de gaze/clip change (ambient-only estático).
  - [ ] Mesma seed + mesma sequência de `tick` → mesma trajetória de estado (determinismo).
  - [ ] `setPreference('dismissed')` reflete em `getSnapshot()` e dispara os subscribers.
- Integration tests:
  - [ ] Sequência `tick`→`behaviors` produz a intenção esperada para cada humor primário (sleepy→sleep, curious→glance/idle, bored→idle, playful→walk/stretch).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- `subscribe`/`getSnapshot` compatíveis com `useSyncExternalStore` (sem tearing).
- Nenhuma referência a React ou Three em `behaviors.ts`.
- Trajetórias de estado determinísticas sob seed fixa.
