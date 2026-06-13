---
status: pending
title: 'Infra de testes: Vitest + Playwright'
type: infra
complexity: medium
dependencies: []
---

# Task 02: Infra de testes: Vitest + Playwright

## Overview

O repositório hoje não tem framework de testes (CLAUDE.md: "There is no test
framework"). Esta task introduz as duas camadas de validação automatizada que a
feature exige: **Vitest** para a lógica pura da simulação e **Playwright** para
os guardrails P0 de leitura. Adiciona as devDeps, os scripts, os arquivos de
config e atualiza a documentação — sem adicionar nenhuma dependência de runtime.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST adicionar `vitest` e `@playwright/test` como **devDependencies** apenas (nenhuma dependência de runtime nova).
- MUST adicionar scripts `test` (Vitest) e `test:e2e` (Playwright) ao `package.json`.
- MUST criar `vitest.config.ts` com resolução do alias `@/*` → `src/*` (consistente com `tsconfig.json`) e ambiente jsdom para componentes.
- MUST criar `playwright.config.ts` apontando para `e2e/`, subindo o dev/preview server do projeto.
- MUST criar o diretório `e2e/` com ao menos um spec de fumaça que carrega a home e confirma o boot.
- MUST atualizar `CLAUDE.md` substituindo a nota "no test framework" pela descrição do uso de Vitest/Playwright.
- MUST manter `lint` (max-warnings 0), `check:types` e `check:prettier` verdes, incluindo os novos arquivos de config.
</requirements>

## Subtasks

- [ ] 2.1 Adicionar `vitest` e `@playwright/test` em devDependencies e os scripts `test`/`test:e2e`.
- [ ] 2.2 Criar `vitest.config.ts` (alias `@/*`, jsdom, globbing de `src/**/*.test.ts(x)`).
- [ ] 2.3 Criar `playwright.config.ts` (baseURL local, `webServer` subindo o app, projeto chromium + mobile).
- [ ] 2.4 Criar `e2e/` com um spec de fumaça mínimo.
- [ ] 2.5 Atualizar a seção de comandos/testes do `CLAUDE.md`.
- [ ] 2.6 Garantir que ESLint/Prettier reconheçam os novos arquivos sem warnings.

## Implementation Details

A TechSpec ("Testing Approach" e "Impact Analysis") fixa Vitest para a lógica
pura de `src/components/elis/` e Playwright em `e2e/` para os guardrails,
asserindo fatos de DOM/comportamento (não pixels/FPS). Os scripts e devDeps
entram no `package.json` ao lado dos existentes (`dev`, `build`, `lint`,
`check:types`, `check:prettier`, `format`). Ver ADR-008 para a estratégia.

### Relevant Files

- `package.json` — scripts e dependências; adicionar devDeps + scripts de teste.
- `tsconfig.json` — fonte do alias `@/*` → `src/*` a replicar no Vitest.
- `eslint.config.mjs` — config flat do ESLint; pode precisar ignorar/abranger arquivos de teste.
- `.prettierrc.json` — formatação (single quotes, 80, trailing commas) a respeitar nos configs.
- `CLAUDE.md` — documento de instruções com a nota "no test framework" a atualizar.

### Dependent Files

- `vitest.config.ts` (novo) — consumido por todas as tasks que escrevem testes unitários (03, 04, 05, 06, 08, 09...).
- `playwright.config.ts` + `e2e/` (novo) — consumidos pelos guardrails da task 09.

### Related ADRs

- [ADR-008: Validation Strategy — Vitest for Simulation Logic, Playwright for Guardrails](adrs/adr-008.md) — Define as duas camadas, RNG semeado, tempo simulado e asserts comportamentais.

## Deliverables

- `package.json` com devDeps `vitest` + `@playwright/test` e scripts `test`/`test:e2e`.
- `vitest.config.ts` e `playwright.config.ts` funcionais.
- `e2e/` com spec de fumaça.
- `CLAUDE.md` atualizado.
- Spec de fumaça que valida o setup **(REQUIRED)**.

## Tests

- Unit tests (Vitest):
  - [ ] Um teste trivial (ex.: `expect(1+1).toBe(2)`) roda via `npm run test` confirmando que o Vitest está configurado e resolve o alias `@/*`.
- Integration tests (Playwright):
  - [ ] Spec de fumaça: `GET /` carrega com status 200 e o `<body>` renderiza, confirmando que `webServer` e baseURL estão corretos.
- Test coverage target: >=80% (da config/lógica introduzida; setup de infra é majoritariamente declarativo)
- All tests must pass

## Success Criteria

- All tests passing
- `npm run test` e `npm run test:e2e` executam sem erro de configuração.
- `lint`, `check:types` e `check:prettier` verdes com os novos arquivos.
- `CLAUDE.md` não menciona mais "no test framework" de forma desatualizada.
