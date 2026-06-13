---
status: pending
title: Catálogo de clips + tabela de transição + seletor
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 04: Catálogo de clips + tabela de transição + seletor

## Overview

Define o contrato de animação que mantém Blender e código em sincronia: o mapa
tipado `ELIS_CLIPS` (nomes dos clips), a tabela de transição `current→target`
para mudanças de pose conspícuas, e o seletor que lê a intenção da store e
decide o clip alvo (roteando por um clip de transição quando necessário). É a
fronteira de contrato que a task 06 (Blender) precisa respeitar.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST definir `ELIS_CLIPS` como mapa `as const` com os clips da Fase-1 (`idle`, `sleep`, `stretch`, `glance`, `walk`) e o tipo `ClipName` derivado dele (ver TechSpec "Core Interfaces").
- MUST definir a tabela de transição `current→target` que roteia mudanças de pose conspícuas através de um clip de transição em vez de crossfade direto entre poses incompatíveis (ADR-007).
- MUST implementar um seletor puro `(intent/estado da store) → ClipName` (e o próximo passo de transição quando aplicável), sem React/Three.
- MUST mapear cada humor primário ao seu clip de loop primário (sleepy→sleep, curious→glance/idle, bored→idle, playful→walk/stretch).
- MUST manter o catálogo extensível por fase (Fase 2: scratch/bellyUp/perk; Fase 3: fetch/pounce/chase) sem quebrar o tipo.
- A lista de nomes de clips é o **contrato** com o rig do Blender; mudanças aqui implicam re-export do `.glb`.
</requirements>

## Subtasks

- [ ] 4.1 Criar `elis-clips.ts` com `ELIS_CLIPS` (Fase-1) e `ClipName`.
- [ ] 4.2 Definir a tabela de transição `current→target` (entry/exit das mudanças conspícuas).
- [ ] 4.3 Implementar o seletor puro que lê a intenção/estado da store e devolve o clip alvo.
- [ ] 4.4 Implementar o roteamento por clip de transição quando `current→target` for incompatível para crossfade direto.
- [ ] 4.5 Escrever os testes Vitest do mapeamento humor→clip e do roteamento de transições.

## Implementation Details

Ver TechSpec "Core Interfaces" (bloco `ELIS_CLIPS`) e ADR-007 para o desenho do
catálogo faseado e das transições. NÃO copiar a definição da interface da
TechSpec para cá — referenciar a seção. O seletor consome o intent produzido por
`behaviors.ts`/`elis-store.ts` (task 03). A renderização do crossfade em si
(drei `useAnimations`) é responsabilidade da task 07; aqui é só a lógica pura de
seleção/roteamento.

### Relevant Files

- `src/components/elis/elis-store.ts` (task 03) — fonte do intent/estado lido pelo seletor.
- `src/components/elis/behaviors.ts` (task 03) — produz as intenções mapeadas em clips.

### Dependent Files

- `src/components/elis/elis-scene.tsx` (task 07) — usa o seletor para crossfade via `useAnimations`.
- `public/elis.glb` (task 06) — os nomes dos clips/poses devem casar com `ELIS_CLIPS` e a tabela de transição.

### Related ADRs

- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Catálogo faseado por humor + clips de transição dedicados.
- [ADR-005: Baked Animation Clips on a Draco-Compressed GLB with Procedural Gaze](adrs/adr-005.md) — Clips baked crossfadeados por humor; gaze procedural por cima.

## Deliverables

- `src/components/elis/elis-clips.ts` (`ELIS_CLIPS`, `ClipName`, tabela de transição, seletor).
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Testes do roteamento de transição **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] Cada humor primário mapeia ao clip esperado (sleepy→`sleep`, curious→`glance`/`idle`, bored→`idle`, playful→`walk`/`stretch`).
  - [ ] Uma mudança conspícua (ex.: `sleep`→`stretch`) é roteada através do clip de transição, não por crossfade direto.
  - [ ] Uma mudança compatível (ex.: `idle`→`glance`) faz crossfade direto sem transição intermediária.
  - [ ] `ClipName` rejeita (em type-check) nomes fora de `ELIS_CLIPS`.
- Integration tests:
  - [ ] Dada uma trajetória de estado da store (task 03), o seletor produz a sequência de clips coerente sem saltos proibidos pela tabela.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- `ELIS_CLIPS` e a tabela de transição documentam o contrato consumido pela task 06.
- Seletor 100% puro (sem React/Three), determinístico para um dado estado.
