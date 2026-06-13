---
status: pending
title: 'Fundação do play: den + ritual de buscar brinquedo'
type: frontend
complexity: high
dependencies:
  - task_10
---

# Task 11: Fundação do play: den + ritual de buscar brinquedo

## Overview

Fase 3 — fundação do play mode pela metáfora da toquinha (den). Adiciona a den
num canto do viewport, os intents de play na store/`behaviors`, e o ritual em
que Elis — convidada **apenas após um sinal de engajamento** (clique / cursor
muito ativo) — busca um brinquedo na den e o deixa disponível num "play corner"
para o visitante. Inclui o re-export do `elis.glb` com o clip `fetch`. Estabelece
o framework que os brinquedos concretos (tasks 12–13) reusam. Tiers 1 e 2.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST renderizar a den (toquinha) em repouso num canto do viewport, sem sobrepor o corpo do artigo.
- MUST adicionar os intents de play na store (task 03) e em `behaviors.ts`, mantendo as funções de comportamento puras.
- MUST convidar o ritual de fetch **somente após um sinal de engajamento** (clique no hit-area da task 10 / cursor muito ativo), nunca auto-iniciando o play.
- MUST implementar o ritual: Elis entra na den, traz um brinquedo e o deixa disponível no "play corner" — o visitante escolhe engajar.
- MUST estender `ELIS_CLIPS` (task 04) com o clip `fetch` e re-exportar `elis.glb`.
- MUST disponibilizar o play apenas nos tiers 1 e 2, e manter os guardrails de leitura com precedência (nada de fetch durante quiet mode).
- O convite ao play SHOULD ser sutil/ocasional e sempre dismissível (nunca "naggy").
</requirements>

## Subtasks

- [ ] 11.1 Renderizar a den num canto, fora do corpo do artigo.
- [ ] 11.2 Adicionar os intents de play na store e em `behaviors.ts` (puro).
- [ ] 11.3 Detectar o sinal de engajamento (clique/cursor muito ativo) que habilita o convite ao fetch.
- [ ] 11.4 Implementar o ritual de fetch (den → trazer brinquedo → deixar no play corner).
- [ ] 11.5 Estender `ELIS_CLIPS` com `fetch` e re-exportar `elis.glb`; gating tier 1/2 e quiet mode.
- [ ] 11.6 Escrever os testes (gating por engajamento/quiet/tier, máquina de estados do ritual) e o spec E2E de opt-in.

## Implementation Details

Ver ADR-002 (metáfora da toquinha; engajar é escolha do visitante), TechSpec
"Development Sequencing" passo 8 e ADR-007 (clip `fetch`). Esta task entrega o
**framework** de play e o ritual de fetch — sem o loop interativo de
chase/pounce de um brinquedo concreto, que é a task 12. A máquina de estados do
ritual (idle-den → invited → fetching → toy-available) SHOULD ser pura/testável,
separada do wiring 3D. Re-export do asset segue o pipeline MCP/Blender da task 06.

### Relevant Files

- `src/components/elis/elis-store.ts` (task 03) — intents de play + estado do ritual.
- `src/components/elis/behaviors.ts` (task 03) — funções puras de comportamento de play.
- `src/components/elis/elis-clips.ts` (task 04) — estender com `fetch`.
- `src/components/elis/elis-scene.tsx` (task 07/08) — render da den e do ritual.
- `src/components/elis/use-pointer-target.ts` / hit-area (task 05/10) — sinal de engajamento.
- `public/elis.glb` (task 06) — re-exportado com o clip `fetch`.

### Dependent Files

- Task 12 (bola) — usa o framework de play e o "play corner" definidos aqui.
- Task 13 (feather wand + laser dot) — reusa o mesmo framework.

### Related ADRs

- [ADR-002: Play Mode as a Toy-Den Metaphor](adrs/adr-002.md) — Den + fetch; engajar é escolha do visitante.
- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Clip `fetch` e transições da Fase-3.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Convite sutil/dismissível; guardrails com precedência.

## Deliverables

- Den renderizada num canto, fora do artigo.
- Intents de play na store/`behaviors`; máquina de estados do ritual de fetch.
- Sinal de engajamento que habilita o convite (opt-in).
- `elis.glb` re-exportado com `fetch`; `ELIS_CLIPS` estendido.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Spec E2E de opt-in/dismiss do convite **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] Sem sinal de engajamento, o ritual de fetch nunca é convidado (play não auto-inicia).
  - [ ] Após um clique/cursor muito ativo, o convite é habilitado e o ritual transita idle-den → fetching → toy-available.
  - [ ] Durante quiet mode, nenhum fetch dispara (guardrail tem precedência).
  - [ ] Em tier 0, o play está indisponível (sem den interativa).
  - [ ] `ELIS_CLIPS` inclui `fetch` e a tabela roteia suas transições.
- Integration tests (Playwright):
  - [ ] O convite ao play é dismissível e não reaparece de forma "naggy" na mesma sessão.
  - [ ] A den e o play corner nunca sobrepõem o corpo do artigo.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Play é estritamente opt-in (só após engajamento) e dismissível.
- Den/play corner fora do corpo do artigo; sem fetch em quiet mode.
- Framework de play pronto para os brinquedos das tasks 12–13.
