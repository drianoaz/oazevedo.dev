---
status: pending
title: Remover protótipo `cat` e fazer o mount vazio do `Elis`
type: chore
complexity: low
dependencies: []
---

# Task 01: Remover protótipo `cat` e fazer o mount vazio do `Elis`

## Overview

Limpa o protótipo descartável da gata e prepara o ponto de montagem da nova
feature. Remove `src/components/cat/*` e `public/cat.glb`, cria a entrada
`src/components/elis/index.tsx` (overlay fixo, `pointer-events: none`, ainda sem
cena 3D) e troca `<Cat />` por `<Elis />` no root layout. É o ponto de partida
sem dependências que destrava todo o resto.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST deletar todos os arquivos de `src/components/cat/` e o asset `public/cat.glb`.
- MUST criar `src/components/elis/index.tsx` como Client Component (`'use client'`) que renderiza o container de overlay fixo com `pointer-events: none` e NÃO renderiza nenhuma cena 3D ainda (placeholder vazio / `null`).
- MUST trocar o import e o uso de `<Cat />` por `<Elis />` em `src/app/layout.tsx`, mantendo a posição (último filho do `<body>`).
- MUST garantir que `lint`, `check:types` e `check:prettier` continuem passando após a remoção (nenhum import órfão para `@/components/cat`).
- MUST preservar `lang="pt-BR"` e a estrutura existente do layout.
</requirements>

## Subtasks

- [ ] 1.1 Deletar o diretório `src/components/cat/` por completo.
- [ ] 1.2 Deletar o asset `public/cat.glb`.
- [ ] 1.3 Criar `src/components/elis/index.tsx` com o overlay fixo vazio (`pointer-events: none`).
- [ ] 1.4 Atualizar `src/app/layout.tsx` para importar e montar `<Elis />` no lugar de `<Cat />`.
- [ ] 1.5 Rodar `lint`/`check:types`/`check:prettier` e confirmar zero referências remanescentes a `cat`.

## Implementation Details

A TechSpec ("System Architecture → Component Overview" e "Impact Analysis")
define `Elis` (`index.tsx`) como a entrada `'use client'` que renderiza o
container de overlay fixo e fará `dynamic`-import da cena com `ssr: false` numa
task posterior. Nesta task, o `index.tsx` deve existir apenas como casca: o
overlay fixo com `pointer-events: none`, sem `<Canvas>` ainda. Ver TechSpec
"Development Sequencing → Build Order" passo 1.

### Relevant Files

- `src/components/cat/index.tsx` — protótipo a remover (entry da gata atual).
- `src/components/cat/cat-scene.tsx` — protótipo a remover (Canvas/CatModel).
- `src/components/cat/use-cat-behavior.ts` — protótipo a remover (hook de comportamento).
- `public/cat.glb` — asset do protótipo a remover (~525 KB).
- `src/app/layout.tsx` — root layout; importa `Cat` na linha ~2 e monta `<Cat />` como último filho do `<body>`.
- `src/lib/css.ts` — `cn()` para compor classes Tailwind do container de overlay.

### Dependent Files

- `src/app/layout.tsx` — único ponto de import/mount; precisa apontar para `@/components/elis`.

### Related ADRs

- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — O protótipo é descartável; Elis nasce fresca do Blender.
- [ADR-005: Baked Animation Clips on a Draco-Compressed GLB](adrs/adr-005.md) — `cat.glb` é substituído por `elis.glb`.

## Deliverables

- Diretório `src/components/cat/` e `public/cat.glb` removidos.
- `src/components/elis/index.tsx` com overlay fixo vazio (`pointer-events: none`).
- `src/app/layout.tsx` montando `<Elis />`.
- Testes unitários com 80%+ de cobertura do que for testável **(REQUIRED)**.
- Teste de smoke de renderização do `<Elis />` vazio **(REQUIRED)**.

## Tests

- Unit tests:
  - [ ] `<Elis />` renderiza sem lançar e produz um container com `pointer-events: none`.
  - [ ] `<Elis />` não renderiza nenhum `<canvas>`/cena nesta fase (placeholder vazio).
- Integration tests:
  - [ ] Smoke: o root layout monta `<Elis />` como último filho do `<body>` sem erro de import.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- `lint`, `check:types` e `check:prettier` passam com zero referências a `@/components/cat`.
- `public/cat.glb` e `src/components/cat/` não existem mais no repositório.
