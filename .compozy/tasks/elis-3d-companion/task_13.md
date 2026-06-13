---
status: pending
title: 'Brinquedos adicionais: feather wand + laser dot'
type: frontend
complexity: medium
dependencies:
  - task_12
---

# Task 13: Brinquedos adicionais: feather wand + laser dot

## Overview

Completa o roster de brinquedos do play mode reusando o framework e a abstração
de input drag da task 12: o **feather wand** (varinha de penas) e o **laser
dot** (ponto de laser), cada um com seu loop de play característico, na ordem
bola → feather wand → laser dot. Inclui o re-export do `elis.glb` com os clips
adicionais necessários. Tiers 1 e 2.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implementar o feather wand e o laser dot como brinquedos fetcháveis da den, reusando o framework de play (task 11) e a abstração de input drag (task 12).
- MUST dar a cada brinquedo seu loop de play característico (ex.: wiggle/bat para a varinha; chase errático/darting para o laser), distinto do da bola.
- MUST respeitar a ordem de roster bola → feather wand → laser dot (fetch e disponibilização na sequência definida).
- MUST estender `ELIS_CLIPS` (task 04) com quaisquer clips adicionais necessários e re-exportar `elis.glb`.
- MUST suportar mouse e touch-drag para ambos os brinquedos e disponibilizá-los apenas nos tiers 1 e 2.
- O play dos novos brinquedos MUST pausar em quiet mode e nunca capturar scroll/foco da página (mesmos guardrails da bola).
</requirements>

## Subtasks

- [ ] 13.1 Implementar o feather wand reusando o framework de play e o input drag.
- [ ] 13.2 Implementar o laser dot reusando o framework de play e o input drag.
- [ ] 13.3 Dar a cada brinquedo seu loop de play característico.
- [ ] 13.4 Cabear a ordem de roster bola → feather wand → laser dot no ritual de fetch.
- [ ] 13.5 Estender `ELIS_CLIPS` com os clips adicionais e re-exportar `elis.glb`.
- [ ] 13.6 Escrever os testes (loops distintos por brinquedo, ordem de roster, gating) e o spec E2E de um novo brinquedo.

## Implementation Details

Ver ADR-002 (roster: bola, feather wand, laser dot — cada um com seu loop) e
TechSpec "Development Sequencing" passo 8 (ordem dos brinquedos). Esta task é
majoritariamente reúso: o framework de play (task 11) e a abstração de input
drag (task 12) já existem; aqui se adicionam dois brinquedos e seus
comportamentos distintos. As funções de comportamento por brinquedo SHOULD ser
puras/testáveis. Re-export do asset via pipeline MCP/Blender da task 06 quando
clips novos forem necessários.

### Relevant Files

- `src/components/elis/behaviors.ts` (task 03/11) — loops de play por brinquedo (puros).
- `src/components/elis/elis-clips.ts` (task 04) — estender com clips adicionais se necessário.
- input drag (task 12) — abstração reusada para mover varinha/laser.
- framework de play / den (task 11) — fetch e play corner reusados.
- `src/components/elis/elis-scene.tsx` (task 07/08) — render dos novos brinquedos e clips.
- `public/elis.glb` (task 06) — re-exportado com clips adicionais.

### Dependent Files

- Nenhum downstream — esta é a última task do roster de play (encerra a Fase 3).

### Related ADRs

- [ADR-002: Play Mode as a Toy-Den Metaphor](adrs/adr-002.md) — Roster completo de brinquedos, cada um com seu loop.
- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Clips adicionais e transições da Fase-3.

## Deliverables

- Feather wand e laser dot como brinquedos fetcháveis, com loops de play distintos.
- Ordem de roster bola → feather wand → laser dot no ritual de fetch.
- Suporte a mouse e touch-drag para ambos; gating tier 1/2 e quiet mode.
- `elis.glb` re-exportado com clips adicionais; `ELIS_CLIPS` estendido se necessário.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Spec E2E de um dos novos brinquedos **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] O feather wand dispara seu loop característico (ex.: wiggle/bat), distinto do chase/pounce da bola.
  - [ ] O laser dot dispara seu loop característico (ex.: chase errático/darting).
  - [ ] O ritual de fetch oferece os brinquedos na ordem bola → feather wand → laser dot.
  - [ ] Em quiet mode, o play dos novos brinquedos pausa; em tier 0 estão indisponíveis.
  - [ ] `ELIS_CLIPS` inclui os clips adicionais e a tabela roteia suas transições.
- Integration tests (Playwright):
  - [ ] Arrastar o feather wand (ou laser dot) com mouse/touch faz Elis reagir com o loop correto, sem capturar scroll/foco da página.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Os três brinquedos coexistem com loops distintos, na ordem definida.
- Reúso do framework/input sem duplicação significativa de lógica.
- Guardrails de leitura mantidos; play disponível só em tiers 1/2.
