---
status: pending
title: '`ElisControl` + persistência + a11y + guardrails Playwright (MVP)'
type: frontend
complexity: high
dependencies:
  - task_08
---

# Task 09: `ElisControl` + persistência + a11y + guardrails Playwright (MVP)

## Overview

Fecha a Fase 1 (MVP): o controle discreto de dismiss/silence como `<button>`
focável com rótulo pt-BR, a persistência da preferência em `localStorage`
(com fallback in-memory), a acessibilidade (Canvas decorativo/`aria-hidden`,
fora do tab order, `prefers-reduced-motion` → tier 0) e os specs Playwright que
provam os guardrails P0 de leitura. Aqui Elis vira embarcável com segurança numa
página de leitura.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implementar `elis-control.tsx` como `<button>` real focável com `aria-label` em pt-BR e `aria-pressed`, lendo/escrevendo a `preference` da store via `useSyncExternalStore`.
- MUST suportar os três estados de preferência: `visible` (default), `silenced` (estática, presente) e `dismissed` (some, com botão discreto de retorno).
- MUST persistir `preference` em `localStorage` na chave `elis:preference` e re-hidratar no mount; acesso a storage envolto para degradar a in-memory em modo privado/desabilitado.
- MUST marcar o Canvas como decorativo (`aria-hidden`) e fora do tab order; o controle é o único elemento focável da feature.
- MUST mapear `prefers-reduced-motion` para tier 0 (pose estática), integrando com a task 08.
- MUST autorar os specs Playwright dos guardrails P0 em `e2e/`, asserindo fatos de DOM/comportamento (foco, scroll, atributos, `localStorage`), não pixels/FPS.
- A preferência MUST persistir tanto através de reload quanto de navegação de rota.
</requirements>

## Subtasks

- [ ] 9.1 Implementar `elis-control.tsx` (`<button>` focável, `aria-label` pt-BR, `aria-pressed`) lendo a store via `useSyncExternalStore`.
- [ ] 9.2 Implementar os três estados (`visible`/`silenced`/`dismissed`) e o botão de retorno discreto no estado `dismissed`.
- [ ] 9.3 Cabear a persistência em `localStorage` (`elis:preference`) com hidratação no mount e fallback in-memory.
- [ ] 9.4 Marcar o Canvas `aria-hidden`/fora do tab order e mapear `prefers-reduced-motion` → tier 0.
- [ ] 9.5 Escrever os testes Vitest do round-trip de preferência e do fallback de storage.
- [ ] 9.6 Autorar os specs Playwright dos guardrails P0 em `e2e/`.

## Implementation Details

Ver TechSpec "Component Overview" (`ElisControl`), "Technical Considerations →
Key Decisions" (controle de três estados; Canvas decorativo) e "Testing
Approach → Integration / E2E". A `preference` já existe na store (task 03) — aqui
se conecta a persistência real e a UI. Os guardrails são os specs P0 do ADR-008;
o passo 6 da TechSpec define que o MVP "ships here" com os specs Playwright. NÃO
duplicar a estratégia de teste — referenciar ADR-008.

### Relevant Files

- `src/components/elis/elis-store.ts` (task 03) — slice `preference` + `setPreference`.
- `src/components/elis/index.tsx` — monta `ElisControl` ao lado da cena.
- `src/components/elis/elis-scene.tsx` (task 07/08) — Canvas a marcar `aria-hidden`; integração reduced-motion→tier 0.
- `src/lib/css.ts` — `cn()` para o styling discreto do controle.
- `playwright.config.ts` + `e2e/` (task 02) — onde os specs de guardrail vivem.
- `src/app/blog/[slug]/` — rota de artigo usada nos specs de quiet mode/scroll.

### Dependent Files

- `e2e/*.spec.ts` (novos) — specs de guardrail P0.
- `src/app/layout.tsx` — `<Elis />` agora completo (cena + controle).

### Related ADRs

- [ADR-008: Validation Strategy — Vitest for Simulation Logic, Playwright for Guardrails](adrs/adr-008.md) — Guardrails P0 via Playwright (DOM/comportamento).
- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md) — reduced-motion → tier 0 estático.
- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Visitante sempre no controle; preferência lembrada.

## Deliverables

- `src/components/elis/elis-control.tsx` com os três estados e a11y.
- Persistência `localStorage` (`elis:preference`) com fallback in-memory.
- Canvas `aria-hidden`/fora do tab order; reduced-motion → tier 0.
- Specs Playwright dos guardrails P0 em `e2e/`.
- Testes unitários com 80%+ de cobertura **(REQUIRED)**.
- Specs E2E de guardrail **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] `setPreference` faz round-trip por `localStorage` (`elis:preference`) e re-hidrata o estado correto no mount.
  - [ ] Com `localStorage` indisponível (modo privado), a preferência degrada para in-memory sem lançar.
  - [ ] O `<button>` expõe `aria-pressed` coerente com o estado atual e `aria-label` em pt-BR.
  - [ ] No estado `dismissed`, o controle vira um botão de retorno discreto.
- Integration tests (Playwright, `e2e/`):
  - [ ] Scroll sustentado por um post `/blog/[slug]` engaja quiet mode (Elis reduz a movimento mínimo).
  - [ ] Elis nunca captura foco: tabular pela página não pousa no Canvas; o foco vai apenas ao `<button>` de controle.
  - [ ] Elis nunca rouba scroll nem sobrepõe o corpo do artigo (posição/`pointer-events` verificados).
  - [ ] Dismiss/silence persiste através de reload **e** de navegação de rota (`localStorage` + estado pós-navegação).
  - [ ] Com `prefers-reduced-motion`, Elis renderiza estática (sem troca de clip/gaze).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Guardrails P0 verdes no Playwright (foco, scroll, overlap, persistência, reduced-motion).
- Preferência lembrada através de reload e navegação.
- **Fase 1 (MVP) embarcável**: presença ambiente + guardrails completos.
