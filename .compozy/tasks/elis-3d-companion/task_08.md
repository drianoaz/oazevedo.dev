---
status: pending
title: Orquestração do loop on-demand
type: frontend
complexity: high
dependencies:
  - task_07
---

# Task 08: Orquestração do loop on-demand

## Overview

Limita o custo de runtime da Elis para honrar a métrica must-hold de suavidade
de scroll. Implementa o loop on-demand: `invalidate()` enquanto ela está ativa,
pausa quando entra em rest / a aba fica oculta / o overlay sai do viewport, cap
de DPR, qualidade dirigida por tier, e relocação ocasional de canto (nunca
durante quiet mode, nunca sobre o corpo do artigo).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST chamar `invalidate()` a cada frame enquanto `activity === 'active'` e parar de auto-dirigir o loop quando `activity === 'rest'`.
- MUST pausar o loop em `visibilitychange` (aba oculta) e quando o overlay está off-viewport (IntersectionObserver), retomando ao voltar à atividade.
- MUST aplicar um **cap de DPR** ao renderer e ajustar qualidade conforme o `tier` (0 ambient-only/estático; 1 mobile capaz; 2 desktop).
- MUST relocar Elis ocasionalmente para outro canto inferior — **nunca** durante quiet mode e **nunca** sobre o corpo do artigo.
- MUST garantir que tier 0 / `prefers-reduced-motion` resulte em pose estática única com o loop parado (sem gaze, sem troca de clip).
- A decisão de active/rest e o gating de relocação SHOULD ser funções puras testáveis, separadas do wiring de Three/observers.
</requirements>

## Subtasks

- [ ] 8.1 Cabear `invalidate()` por frame enquanto ativa; parar o auto-drive em rest.
- [ ] 8.2 Adicionar observers de `visibilitychange` e de viewport do overlay para pausar/retomar.
- [ ] 8.3 Aplicar cap de DPR e qualidade por tier no renderer.
- [ ] 8.4 Implementar a relocação ocasional de canto com gating (fora de quiet mode, fora do corpo do artigo).
- [ ] 8.5 Garantir tier 0 estático (loop parado, sem gaze/clip change).
- [ ] 8.6 Escrever os testes das funções puras de active/rest e do gating de relocação.

## Implementation Details

Ver TechSpec "Development Sequencing → Build Order" passo 5 e ADR-004 (loop
on-demand + tiers + DPR cap + rest pausing). A cena base (`frameloop="demand"`)
vem da task 07; aqui se adiciona a orquestração. O sinal `activity` vem da store
(task 03) e o `tier`/`quiet` dos hooks (task 05). A verificação de FPS/perf é
manual (não automatável) — os testes cobrem a lógica de decisão, não os frames.

### Relevant Files

- `src/components/elis/elis-scene.tsx` (task 07) — onde a orquestração é adicionada (invalidate, observers, DPR).
- `src/components/elis/elis-store.ts` (task 03) — fonte do sinal `activity` (active/rest).
- `src/components/elis/use-device-tier.ts` (task 05) — `tier` que dirige qualidade/DPR.
- `src/components/elis/use-reading-activity.ts` (task 05) — `quiet` que bloqueia relocação.
- `src/hooks/use-anchor-observer.ts` — padrão IntersectionObserver reusável para o viewport do overlay.

### Dependent Files

- `src/components/elis/elis-control.tsx` (task 09) — reduced-motion → tier 0 depende do gating estático daqui.
- `e2e/` (task 09) — guardrails verificam que o loop não interfere no scroll.

### Related ADRs

- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md) — Núcleo desta task.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Relocação nunca sobre o artigo; guardrails têm precedência.

## Deliverables

- Orquestração do loop on-demand em `elis-scene.tsx` (invalidate/pausa/DPR/tier/relocação).
- Funções puras de decisão active/rest e gating de relocação.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Testes do gating de relocação e do parking do loop **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] `activity === 'active'` mantém o auto-drive; `activity === 'rest'` para de invalidar.
  - [ ] Aba oculta (`visibilitychange`) e overlay off-viewport resultam em loop pausado.
  - [ ] Tier 0 / reduced-motion → pose estática, loop parado, sem gaze/clip change.
  - [ ] O cap de DPR é aplicado e a qualidade muda por tier.
  - [ ] Gating de relocação: durante quiet mode → nunca reloca; fora dele → reloca apenas para cantos inferiores, nunca sobre o corpo do artigo.
- Integration tests:
  - [ ] Transição ativa→rest→ativa retoma o loop corretamente sem ficar preso parado.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- O loop não roda quando Elis dorme / aba oculta / overlay off-viewport.
- Relocação respeita quiet mode e o corpo do artigo.
- DPR cap e tiers aplicados; verificação manual de FPS de scroll registrada na checklist de perf.
