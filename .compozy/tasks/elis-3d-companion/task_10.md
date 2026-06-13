---
status: pending
title: Reações ao clique/tap + perk no scroll (hit-area DOM)
type: frontend
complexity: high
dependencies:
  - task_09
---

# Task 10: Reações ao clique/tap + perk no scroll (hit-area DOM)

## Overview

Fase 2 — interação direta. Adiciona um hit-area DOM que aproxima a silhueta da
Elis (com `pointer-events: auto`, enquanto o resto do overlay continua
transparente a mouse/scroll) para capturar clique/tap e disparar reações
afetuosas (`scratch`, `bellyUp`), além de um perk consciente de scroll — tudo
subordinado ao quiet mode. Inclui o re-export do `elis.glb` com os clips da
Fase-2. Disponível nos tiers 1 e 2.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST adicionar um hit-area DOM (pequeno elemento aproximando a silhueta da Elis, posição alimentada pela store) com `pointer-events: auto`; o resto do overlay permanece `pointer-events: none`.
- MUST disparar reações ao clique/tap (`scratch`, `bellyUp`) via `notify({type:'click'})` na store, traduzidas em intents e clips.
- MUST implementar o perk consciente de scroll (Elis percebe o scroll e se anima), **subordinado ao quiet mode** — durante leitura ativa a reação é suprimida/minimizada.
- MUST estender `ELIS_CLIPS` (task 04) com os clips da Fase-2 (`scratch`, `bellyUp`, `perk`) e re-exportar `elis.glb` com eles.
- MUST disponibilizar as reações apenas nos tiers 1 e 2 (tier 0 permanece ambient-only/estático).
- O hit-area NÃO pode interceptar clique/scroll da página fora da silhueta aproximada.
</requirements>

## Subtasks

- [ ] 10.1 Estender `ELIS_CLIPS` + tabela de transição com `scratch`/`bellyUp`/`perk` e re-exportar `elis.glb`.
- [ ] 10.2 Implementar o hit-area DOM posicionado pela store, `pointer-events: auto`.
- [ ] 10.3 Cabear clique/tap → `notify` → reações (`scratch`/`bellyUp`).
- [ ] 10.4 Implementar o perk consciente de scroll subordinado ao quiet mode.
- [ ] 10.5 Restringir as reações aos tiers 1 e 2.
- [ ] 10.6 Escrever os testes (mapeamento evento→intent→clip, supressão por quiet, gating de tier) e o spec E2E de não-interferência.

## Implementation Details

Ver TechSpec "Component Overview" (Hit-area), "Development Sequencing" passo 7 e
ADR-007 (clips Fase-2). O hit-area é DOM (não raycast 3D) para nunca interceptar
clique/scroll da página — ver "Key Decisions" (DOM hit-area). A posição on-screen
da Elis vem da store. O re-export do asset segue o pipeline MCP/Blender da task
06, agora com os clips adicionais.

### Relevant Files

- `src/components/elis/elis-store.ts` (task 03) — `notify` de eventos de clique/scroll; posição on-screen para o hit-area.
- `src/components/elis/elis-clips.ts` (task 04) — estender com clips Fase-2 + transições.
- `src/components/elis/use-reading-activity.ts` (task 05) — `quiet` que suprime o perk.
- `src/components/elis/use-device-tier.ts` (task 05) — gating tier 1/2.
- `src/components/elis/index.tsx` / `elis-scene.tsx` — montagem do hit-area e disparo dos clips.
- `public/elis.glb` (task 06) — re-exportado com os clips Fase-2.

### Dependent Files

- `src/components/elis/elis-scene.tsx` — toca os novos clips de reação.
- Task 11 (play) — usa o sinal de engajamento (clique/cursor ativo) introduzido aqui.

### Related ADRs

- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Clips Fase-2 e roteamento de transições.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Reações subordinadas aos guardrails de leitura.

## Deliverables

- Hit-area DOM aproximando a silhueta, `pointer-events: auto`.
- Reações `scratch`/`bellyUp` ao clique/tap e perk consciente de scroll.
- `elis.glb` re-exportado com clips Fase-2; `ELIS_CLIPS` estendido.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Spec E2E de não-interferência do hit-area **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] Clique no hit-area → `notify({type:'click'})` → intent de reação → clip `scratch`/`bellyUp` selecionado.
  - [ ] Durante quiet mode, o perk de scroll é suprimido/minimizado (nenhum clip conspícuo).
  - [ ] Em tier 0, nenhuma reação de clique dispara (ambient-only).
  - [ ] `ELIS_CLIPS` contém os clips Fase-2 e a tabela roteia as transições de entrada/saída deles.
- Integration tests (Playwright):
  - [ ] Clicar fora da silhueta aproximada não é interceptado pela Elis (clique/scroll da página passam normalmente).
  - [ ] Tap no hit-area em viewport mobile (tier 1) dispara a reação.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Reações sentidas como responsivas e fofas, sem aumentar distração nem ferir os guardrails.
- Hit-area nunca intercepta clique/scroll da página fora da silhueta.
- Reações ausentes no tier 0; presentes nos tiers 1/2.
