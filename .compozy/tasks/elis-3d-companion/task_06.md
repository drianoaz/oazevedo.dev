---
status: pending
title: 'Asset Blender (MCP): `elis.glb` (Draco) + decoder self-hosted'
type: infra
complexity: critical
dependencies:
  - task_04
---

# Task 06: Asset Blender (MCP): `elis.glb` (Draco) + decoder self-hosted

## Overview

Produz o modelo 3D da Elis fresco no Blender — assistido pelas ferramentas MCP
`mcp__blender__*` — a partir das referências em `_referencias/`: um gato chibi
low-poly box-modeled, hand-painted (pelagem calico, olhos verdes, cauda
listrada), com armature de bones nomeados (incl. cadeia head/neck para o gaze) e
o catálogo de clips da Fase-1 + clips de transição. Exporta comprimido em Draco
para `public/elis.glb` e vendoriza o decoder em `public/draco/`. É a entrega de
arte que destrava a cena (task 07).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST modelar Elis low-poly via box-modeling/extrusão em estilo chibi, guiada pelas fotos (proporções/marcações) e desenhos (estilo) em `_referencias/` (ADR-006).
- MUST hand-painting da pelagem calico, olhos verdes e cauda listrada, reconhecível como a gata real.
- MUST construir armature manual com **bones nomeados**, incluindo a cadeia head/neck que o gaze procedural vai dirigir; os nomes dos bones são contrato com o runtime.
- MUST autorar os clips da Fase-1 com nomes que casam exatamente com `ELIS_CLIPS` (task 04): `idle`, `sleep`, `stretch`, `glance`, `walk`, **mais os clips de transição** da tabela `current→target`.
- MUST exportar como `public/elis.glb` comprimido em **Draco**, dentro do orçamento de bytes (alvo: significativamente menor que os ~525 KB do protótipo).
- MUST vendorizar o decoder Draco em `public/draco/` (self-hosted, sem request a terceiros — restrição de privacidade do PRD).
- MUST iterar contra as referências e obter sign-off do dono sobre a semelhança/charm antes de considerar final; prototipar `idle` + `sleep` cedo para validar o "read".
- SHOULD usar as ferramentas `mcp__blender__*` (execução de Python no Blender; geração via texto/imagem das referências) para produzir/iterar o modelo.
</requirements>

## Subtasks

- [ ] 6.1 Carregar as referências de `_referencias/` (fotos + desenhos) e estabelecer proporções/marcações alvo.
- [ ] 6.2 Box-modeling do corpo chibi low-poly e hand-painting (calico/olhos verdes/cauda listrada).
- [ ] 6.3 Construir a armature com bones nomeados (incl. cadeia head/neck para gaze).
- [ ] 6.4 Autorar os clips da Fase-1 (`idle`, `sleep`, `stretch`, `glance`, `walk`) + clips de transição da tabela da task 04.
- [ ] 6.5 Exportar `public/elis.glb` com compressão Draco dentro do orçamento de bytes.
- [ ] 6.6 Vendorizar o decoder Draco em `public/draco/`.
- [ ] 6.7 Escrever o teste de contrato do GLB (clips + bones esperados presentes) e validar semelhança com o dono (`idle`+`sleep` cedo).

## Implementation Details

Ver TechSpec "Technical Dependencies" (deliverable Blender: box-modeling,
hand-paint, armature com bones nomeados, catálogo Fase-1 + transições, Draco
self-hosted) e ADR-006/ADR-007. O contrato de nomes (clips e bones) vem da task
04 (`ELIS_CLIPS` + tabela de transição) — qualquer divergência quebra o runtime.
Usar `mcp__blender__execute_blender_code` para o pipeline e
`mcp__blender__generate_*` a partir das imagens de `_referencias/` quando útil; o
viewport screenshot ajuda a iterar a semelhança. NÃO prescrever topologia exata
aqui — seguir ADR-006.

### Relevant Files

- `_referencias/fotos/` — 4 fotos da gata real (proporções e marcações).
- `_referencias/desenhos/` — 4 desenhos (estilo/charm chibi alvo).
- `_referencias/referencias principais/` — referência principal adicional.
- `src/components/elis/elis-clips.ts` (task 04) — contrato de nomes de clips e tabela de transição.
- `public/cat.glb` — removido na task 01; referência de orçamento de bytes (~525 KB) a superar para baixo.

### Dependent Files

- `public/elis.glb` (novo) — consumido por `useGLTF` na task 07.
- `public/draco/` (novo) — decoder self-hosted configurado no `DracoLoader` (task 07).
- `src/components/elis/elis-scene.tsx` (task 07) — carrega o asset e dirige os bones nomeados.

### Related ADRs

- [ADR-006: Elis Model Construction — Low-Poly Box-Model with a Hand-Built Armature](adrs/adr-006.md) — Pipeline de construção/rig a partir das referências.
- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md) — Catálogo Fase-1 + clips de transição a exportar.
- [ADR-005: Baked Animation Clips on a Draco-Compressed GLB with Procedural Gaze](adrs/adr-005.md) — Entrega como GLB Draco; gaze fica procedural no runtime.

## Deliverables

- `public/elis.glb` (low-poly, hand-painted, Draco) com clips Fase-1 + transições.
- `public/draco/` com o decoder self-hosted.
- Documentação curta do contrato de bones/clips exportado (no corpo da task ou README do asset).
- Teste de contrato do GLB validando clips + bones esperados **(REQUIRED)**.
- Validação de orçamento de bytes do `.glb` **(REQUIRED)**.

## Tests

- Unit tests (Vitest, carregando o GLB via loader/parse):
  - [ ] `elis.glb` contém exatamente os clips de `ELIS_CLIPS` (Fase-1) + os clips de transição esperados; nenhum clip faltando ou com nome divergente.
  - [ ] A armature expõe os bones nomeados da cadeia head/neck que o gaze procedural espera.
  - [ ] O tamanho do `public/elis.glb` está dentro do orçamento de bytes definido (assert de byte budget).
- Integration tests:
  - [ ] O par `elis.glb` + `public/draco/` decodifica com sucesso (parse Draco não lança).
- Test coverage target: >=80% (do utilitário de validação de contrato)
- All tests must pass

## Success Criteria

- All tests passing
- `elis.glb` carrega e decodifica com o decoder self-hosted, dentro do orçamento de bytes.
- Nomes de clips e bones casam 1:1 com o contrato da task 04.
- Sign-off do dono sobre semelhança/charm (calico, olhos verdes, cauda listrada) registrado.
- Nenhum request a terceiros para o decoder (self-hosted em `public/draco/`).
