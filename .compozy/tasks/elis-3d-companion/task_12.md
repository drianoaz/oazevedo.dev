---
status: pending
title: 'Brinquedo bola: chase/pounce + touch-drag'
type: frontend
complexity: high
dependencies:
  - task_11
---

# Task 12: Brinquedo bola: chase/pounce + touch-drag

## Overview

Primeiro brinquedo concreto do play mode: a bola. O visitante pega/move a bola
(mouse no desktop, arraste com o dedo no touch) e Elis reage com
chase/pounce/wiggle. Implementa o loop interativo de play sobre o framework e o
"play corner" da task 11, com os clips `pounce`/`chase` re-exportados. Disponível
nos tiers 1 e 2.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST renderizar a bola no play corner (entregue pelo ritual de fetch da task 11) e permitir que o visitante a pegue/mova.
- MUST suportar mouse (desktop) **e** touch-drag (arraste com o dedo) para mover a bola.
- MUST implementar o loop de play da bola: Elis persegue (chase), dá o bote (pounce) com as duas patas e wiggle antes de arrancar, dirigido pela posição da bola e pela store.
- MUST estender `ELIS_CLIPS` (task 04) com `pounce`/`chase` e re-exportar `elis.glb`.
- MUST disponibilizar apenas nos tiers 1 e 2 e manter os guardrails de leitura com precedência (play pausa em quiet mode).
- O play NÃO pode capturar scroll/foco da página; a interação com a bola fica contida no overlay/hit-area.
</requirements>

## Subtasks

- [ ] 12.1 Renderizar a bola no play corner e o seu hit-area de pickup/move.
- [ ] 12.2 Implementar mover a bola com mouse e com touch-drag (um caminho de input unificado).
- [ ] 12.3 Implementar o loop chase/pounce/wiggle dirigido pela posição da bola + store.
- [ ] 12.4 Estender `ELIS_CLIPS` com `pounce`/`chase` e re-exportar `elis.glb`.
- [ ] 12.5 Gating tier 1/2 e pausa do play em quiet mode.
- [ ] 12.6 Escrever os testes (lógica de chase/pounce, input drag, gating) e o spec E2E de touch-drag.

## Implementation Details

Ver ADR-002 (cada brinquedo tem seu loop de chase/pounce/wiggle), TechSpec
"Development Sequencing" passo 8 (ordem bola → feather wand → laser dot) e
ADR-007 (clips `pounce`/`chase`). A bola se assenta sobre o framework de play da
task 11; o caminho de input (mouse + touch-drag) SHOULD ser uma abstração
reusável pelos próximos brinquedos. A decisão de chase/pounce (alvo, distância,
threshold de bote) SHOULD ser pura/testável. Re-export do asset via pipeline da
task 06.

### Relevant Files

- `src/components/elis/elis-store.ts` / `behaviors.ts` (task 03/11) — intents de chase/pounce.
- `src/components/elis/elis-clips.ts` (task 04) — estender com `pounce`/`chase`.
- `src/components/elis/use-pointer-target.ts` (task 05) — base para o input de drag (mouse + touch).
- `src/components/elis/elis-scene.tsx` (task 07/08) — render da bola e dos clips de play.
- den/play corner (task 11) — origem e posição da bola.
- `public/elis.glb` (task 06) — re-exportado com `pounce`/`chase`.

### Dependent Files

- Task 13 (feather wand + laser dot) — reusa a abstração de input drag e o loop de play da bola.

### Related ADRs

- [ADR-002: Play Mode as a Toy-Den Metaphor](adrs/adr-002.md) — Loop de play por brinquedo (chase/pounce/wiggle).
- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Clips `pounce`/`chase`.
- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md) — Play disponível em tiers 1/2; loop respeita rest/quiet.

## Deliverables

- Bola interativa no play corner com pickup/move (mouse + touch-drag).
- Loop chase/pounce/wiggle dirigido pela store.
- Abstração de input drag reusável pelos próximos brinquedos.
- `elis.glb` re-exportado com `pounce`/`chase`; `ELIS_CLIPS` estendido.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Spec E2E de touch-drag da bola **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] Mover a bola para perto de Elis dispara `chase`; ao cruzar o threshold de distância, dispara `pounce`.
  - [ ] O caminho de input unifica mouse e touch (mesma posição normalizada da bola para ambos).
  - [ ] Em quiet mode, o play pausa (sem chase/pounce).
  - [ ] Em tier 0, a bola/play não estão disponíveis.
  - [ ] `ELIS_CLIPS` inclui `pounce`/`chase` e a tabela roteia suas transições.
- Integration tests (Playwright):
  - [ ] Arrastar a bola com o dedo (touch) em viewport mobile faz Elis persegui-la; o scroll/foco da página não são capturados.
  - [ ] Mover a bola com o mouse no desktop dispara o loop de play.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- A bola funciona com mouse e touch-drag; Elis persegue/dá o bote de forma fluida.
- Play nunca captura scroll/foco da página e pausa em quiet mode.
- Abstração de input pronta para reúso nas tasks seguintes.
