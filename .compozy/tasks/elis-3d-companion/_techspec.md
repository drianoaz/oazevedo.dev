# TechSpec: Elis — A Living 3D Cat Companion

## Executive Summary

Elis is a corner-overlay 3D cat rendered with React Three Fiber, mounted once in
the App Router root layout and loaded entirely under `dynamic({ ssr: false })`
so it never touches server-render or the critical reading path. Her behavior is
driven by a **mood/energy simulation kept in a plain external store** (no new
state dependency), ticked inside the R3F `useFrame` loop and exposed to React
only at the UI boundary via `useSyncExternalStore` (ADR-003). Animation uses
**baked GLB clips crossfaded by mood**, with procedural gaze layered on top,
delivered as a **Draco-compressed `elis.glb`** built low-poly in Blender from
`_referencias/` (ADR-005, ADR-006). Runtime cost is bounded by an **on-demand
render loop with device tiers, a DPR cap, and rest/visibility pausing**
(ADR-004). Validation combines **Vitest** for the pure simulation logic and
**Playwright** for the P0 reading guardrails (ADR-008).

The primary trade-off: we accept more hand-written orchestration (manual
tick/decay, an "active vs rest" signal, visibility/viewport wiring, a vendored
Draco decoder) and two new dev dependencies for testing in exchange for zero new
**runtime** dependencies, no per-frame React re-renders, and a render cost that
tracks actual motion rather than wall-clock time — the right call for a
reading-first site where scroll smoothness is a must-hold metric.

## System Architecture

### Component Overview

Everything new lives in **`src/components/elis/`**. The prototype
`src/components/cat/` and `public/cat.glb` are removed.

- **`Elis` (`index.tsx`)** — `'use client'` entry. Renders the fixed-position
  overlay container (`pointer-events: none`) and `dynamic`-imports the scene
  with `ssr: false`, wrapped in `<Suspense fallback={null}>`. Mounted in
  `layout.tsx` in place of `<Cat />`.
- **`ElisScene` (`elis-scene.tsx`)** — the R3F `<Canvas frameloop="demand">`
  with a transparent (alpha) background, flat lighting (`ambient` + one
  `directional`), no dynamic shadows (at most a fake/baked contact shadow), the
  model, the animation driver, and the per-frame `tick`. Owns `invalidate()`
  calls and the visibility/viewport observers. Anchors Elis to a bottom corner
  and occasionally relocates her to another bottom corner — never during quiet
  mode, never over the article body.
- **`elis-store.ts`** — the mood/energy store: state object + `tick(dt)` reducer
  (energy decay + interaction boost + seeded-RNG jitter) + imperative behavior
  API + `subscribe`/`getSnapshot` for `useSyncExternalStore`. Single source of
  truth for animation selection, the "active vs rest" render signal, and the UI.
  Holds the persisted `preference`.
- **`behaviors.ts`** — pure functions mapping `(state, inputs) → intent` (idle,
  sleep, glance, wander, seek-attention; play intents in Phase 3). No React, no
  Three references.
- **`elis-clips.ts`** — typed `ELIS_CLIPS` map (clip names) and the
  `current→target` transition table; the clip selector reads the store's intent.
- **`use-device-tier.ts`** — tier heuristic (width / coarse-pointer /
  `prefers-reduced-motion`).
- **`use-reading-activity.ts`** — quiet-mode detector (sustained scroll +
  article dwell), reusing `use-scroll-position` and the IntersectionObserver
  pattern from `use-anchor-observer`.
- **`use-pointer-target.ts`** — normalized cursor/touch target for procedural
  gaze.
- **`ElisControl` (`elis-control.tsx`)** — the discreet dismiss/silence control:
  a real focusable `<button>` with a pt-BR `aria-label` and `aria-pressed`,
  reading/writing the store via `useSyncExternalStore`.
- **Hit-area** — a small DOM element approximating Elis's silhouette (its on-
  screen position fed from the store) with `pointer-events: auto`, capturing
  click/tap for Phase-2 reactions; the rest of the overlay stays transparent to
  mouse/scroll.

**Data flow:** DOM inputs (pointer, scroll, click via hit-area, visibility) →
store/behaviors → per-frame `tick` in `useFrame` → clip selection (+ transition)
and procedural gaze → `invalidate()` while active. Reading-activity and device-
tier signals gate behavior intensity and feature availability. The store's
`preference` slice is persisted to `localStorage` and re-hydrated on mount.

## Implementation Design

### Core Interfaces

The store is the central contract every other piece depends on:

```typescript
export type Mood = 'playful' | 'curious' | 'sleepy' | 'bored';
export type Activity = 'active' | 'rest'; // drives ADR-004 loop pausing
export type Preference = 'visible' | 'silenced' | 'dismissed';

export interface ElisState {
  mood: Mood;
  energy: number; // 0..1, decays over time, raised by interaction
  activity: Activity; // 'rest' when sleeping / quiet / minimal
  quiet: boolean; // active-reading guardrail engaged
  tier: 0 | 1 | 2; // 0 = reduced/low (ambient-only), 1 = mobile, 2 = full
  preference: Preference;
}

export interface ElisStore {
  getSnapshot(): ElisState;
  subscribe(cb: () => void): () => void; // useSyncExternalStore (UI only)
  tick(dtMs: number, inputs: BehaviorInputs): void; // called in useFrame
  notify(event: ElisEvent): void; // click, scroll, pointer, visibility…
  setPreference(p: Preference): void; // persists to localStorage
}
```

The clip contract keeps Blender ↔ code in sync:

```typescript
export const ELIS_CLIPS = {
  idle: 'Idle',
  sleep: 'Sleep',
  stretch: 'Stretch',
  glance: 'Glance',
  walk: 'Walk',
  // Phase 2+: scratch, bellyUp, perk; Phase 3: fetch, pounce, chase
} as const;
export type ClipName = keyof typeof ELIS_CLIPS;
```

**Error handling conventions:** model/decoder load failures resolve to rendering
nothing (the overlay stays empty) — Elis is non-essential and must never throw
into the page. `localStorage` access is wrapped so private-mode / disabled
storage degrades to an in-memory preference for the session. The mood RNG is
**seedable** so dev/test runs are deterministic.

### Data Models

- **`ElisState`** — the runtime entity above; lives in memory, ticked per frame.
- **Persisted preference** — a single `localStorage` key `elis:preference` →
  `'visible' | 'silenced' | 'dismissed'`. This is the _only_ persisted data (PRD
  privacy constraint: no personal data).
- **`BehaviorInputs`** — `{ pointer: {x,y} | null, scrolling: boolean,
dwellMs: number, quiet: boolean, tier }` assembled each frame from the hooks.
  Quiet-mode thresholds live as tunable constants in `use-reading-activity.ts`:
  `SCROLL_ACTIVE_MS ≈ 6000`, `DWELL_MS ≈ 8000`, `QUIET_EXIT_MS ≈ 2000`.
- **`ElisEvent`** — discrete events: `{ type: 'click' | 'scroll' | 'pointermove'
| 'visibility' | 'pickup-toy', … }`.

No database, no API, no network entities. Assets: `public/elis.glb` (low-poly,
hand-painted, Draco) + a self-hosted `public/draco/` decoder.

### API Endpoints

Not applicable — Elis is entirely client-side with no backend surface. The only
persistence is `localStorage`.

## Integration Points

Not applicable — no external services. The only "integration" is the browser
platform: `localStorage`, `matchMedia('(prefers-reduced-motion)')`,
`visibilitychange`, IntersectionObserver, and pointer/touch events. The Draco
decoder is **self-hosted** in `public/draco/` (no third-party request, per the
PRD privacy constraint). All platform access is guarded for SSR (inside the
`ssr:false` client subtree / `useEffect`).

## Impact Analysis

| Component                           | Impact Type        | Description and Risk                                                                                           | Required Action                    |
| ----------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `src/components/cat/*`              | deprecated/removed | Disposable prototype replaced. Low risk (self-contained).                                                      | Delete directory                   |
| `public/cat.glb`                    | deprecated/removed | Replaced by `elis.glb`. Low risk.                                                                              | Delete asset                       |
| `src/app/layout.tsx`                | modified           | Swap `<Cat />` for `<Elis />`. Low risk, single line.                                                          | Update mount                       |
| `src/components/elis/*`             | new                | New feature subtree (3D + simulation). Medium risk.                                                            | Build per sequence                 |
| `public/elis.glb` + `public/draco/` | new                | Draco model + self-hosted decoder. Medium risk (export contract, byte budget).                                 | Produce in Blender, vendor decoder |
| `src/hooks/*`                       | unchanged (reused) | `use-scroll-position`, `use-anchor-observer` pattern reused, not modified.                                     | None                               |
| `package.json`                      | modified           | Add `vitest` + `@playwright/test` devDeps and scripts (`test`, `test:e2e`). No new **runtime** deps. Low risk. | Add devDeps/scripts                |
| `CLAUDE.md`                         | modified           | Update the "no test framework" note to reflect Vitest/Playwright. Low risk.                                    | Update docs                        |
| `e2e/`                              | new                | Playwright guardrail specs. Low–medium risk.                                                                   | Author guardrail specs             |

## Testing Approach

Per ADR-008, validation has two automated layers plus a manual performance
check. `lint` (max-warnings 0), `check:types`, and `check:prettier` remain the
baseline.

### Unit Tests (Vitest)

- **Scope:** the pure logic in `src/components/elis/` — store `tick`/decay/
  energy→mood thresholds, `behaviors.ts`, clip selection + transition table, and
  the quiet-mode detector.
- **Determinism:** seeded RNG and an injected/simulated clock.
- **Key scenarios:** energy decay → `sleepy` → `sleep` → `activity: 'rest'`;
  quiet mode forces minimal motion; `prefers-reduced-motion` forces tier 0
  (single static pose, loop stopped, no gaze, no clip changes); transition table
  routes conspicuous pose changes; preference round-trips through `localStorage`.

### Integration / E2E Tests (Playwright, `e2e/`)

- **Guardrails (P0):** sustained scroll through a `/blog/[slug]` post engages
  quiet mode; Elis never captures focus, never steals scroll, never overlaps the
  article body; dismiss/silence persists across reload **and** route navigation;
  `prefers-reduced-motion` renders her static.
- **Assertion style:** DOM/behavioral facts (focus target, scroll position,
  attributes, `localStorage`), not pixels or FPS, to avoid flakiness.

### Performance (manual, assisted)

The must-hold 3D scroll-smoothness budget is **not** automatable here. Verify via
the DevTools Performance panel (scroll FPS with Elis present vs removed) on
desktop and a real mid-range phone, backed by a reproducible checklist and the
dev-only debug overlay (mood/energy/tier/activity/quiet/fps). Confirm
`frameloop="demand"` parks the loop when Elis sleeps / tab hidden / overlay
off-viewport, and that the DPR cap is applied.

## Development Sequencing

### Build Order

1. **Remove prototype & wire mount** — delete `src/components/cat/*` and
   `public/cat.glb`; add an empty `src/components/elis/index.tsx` and swap the
   mount in `layout.tsx`. No dependencies.
2. **`elis-store.ts` + `behaviors.ts` (+ Vitest)** — mood/energy state, `tick`
   (decay + boost + seeded jitter), events, `useSyncExternalStore` plumbing
   (ADR-003); unit-test the logic as it is written (ADR-008). Depends on step 1.
3. **Device tier + reading-activity + pointer hooks** — `use-device-tier.ts`,
   `use-reading-activity.ts` (quiet-mode constants), `use-pointer-target.ts`.
   Depends on step 2 (feed inputs into the store).
4. **Draco asset pipeline + `ElisScene`** — build `elis.glb` per ADR-006
   (low-poly box-model, hand-painted, named bones incl. head/neck) with the
   Phase-1 clip catalog + transition clips per ADR-007; vendor `public/draco/`;
   configure `useGLTF`/`DracoLoader`; render the Canvas (transparent, flat light,
   no dynamic shadows) with `frameloop="demand"`, clip crossfade via the
   transition table, and procedural gaze (ADR-005). Depends on steps 2–3.
5. **On-demand loop orchestration** — `invalidate()` while active; pause on rest
   / `visibilitychange` / off-viewport; DPR cap; tier-driven quality; occasional
   corner relocation outside quiet mode (ADR-004). Depends on step 4.
6. **`ElisControl` + persistence + a11y** — dismiss/silence `<button>` (pt-BR
   `aria-label`, `aria-pressed`), `localStorage` hydrate/persist, Canvas
   `aria-hidden`/out of tab order, `prefers-reduced-motion` → tier 0. Depends on
   steps 2 & 5. **← Phase 1 (MVP) ships here; author Playwright guardrail specs.**
7. **Phase 2 — direct interaction** — DOM hit-area click/tap reactions (scratch,
   belly-up) and scroll-aware perk, subordinate to quiet mode; add Phase-2
   clips. Available on tiers 1 and 2. Depends on steps 5–6.
8. **Phase 3 — play mode (toy-den)** — den in a corner, fetch-toy ritual invited
   **only after an engagement signal** (click / very active cursor), play with
   the first toy then the rest in order **ball → feather wand → laser dot**, with
   chase/pounce and full touch-drag (ADR-002). Available on tiers 1 and 2.
   Depends on step 7.

### Technical Dependencies

- **Blender deliverable (ADR-006/007):** Elis modeled low-poly via box-modeling,
  hand-painted (calico / green eyes / striped tail), hand-built armature with
  named bones (incl. a head/neck gaze chain), exporting the Phase-1 clip catalog
  (`idle`, `sleep`, `stretch`, `glance`, `walk`) **with transition clips** for
  conspicuous pose changes. The bone-name and clip-name lists are the contract
  with the runtime. Blocks steps 4+.
- **Self-hosted Draco decoder** vendored in `public/draco/` (blocks step 4).
- No infrastructure or external-service dependencies.

## Monitoring and Observability

No backend, so no server telemetry. Operational visibility is limited to:

- A **dev-only debug overlay** (mood / energy / tier / activity / quiet / fps)
  gated behind a flag, never shipped to production.
- The must-hold guardrail is verified by manual profiling (Performance panel:
  scroll FPS with/without Elis), not runtime metrics.
- Per PRD: only lightweight, privacy-respecting signals — and none are required
  for MVP. No analytics added in this scope.

## Technical Considerations

### Key Decisions

- **Decision:** External store ticked in `useFrame`, React only via
  `useSyncExternalStore`. **Rationale:** avoid per-frame re-renders on a
  reading-first site. **Trade-off:** manual tick bookkeeping. **Rejected:**
  zustand (new dep), Context+useReducer (jank). → ADR-003.
- **Decision:** On-demand loop + tiers + DPR cap + rest pausing. **Rationale:**
  render cost tracks motion; Elis is idle most of the time. **Trade-off:** more
  orchestration code. **Rejected:** always-on loop, single conservative profile.
  → ADR-004. Tier 0 (weak/reduced-motion) is ambient-only and static; tiers 1
  (capable mobile) and 2 (desktop) get the full experience, including touch-drag
  play.
- **Decision:** Baked clips + procedural gaze, Draco GLB, low-poly box-model.
  **Rationale:** art-directed charm at predictable cost; smaller download off the
  critical path. **Trade-off:** clip/bone-name contract + vendored decoder.
  **Rejected:** fully procedural, uncompressed GLB, meshopt, sculpt pipeline,
  generic base mesh. → ADR-005, ADR-006, ADR-007.
- **Decision:** Vitest for simulation logic, Playwright for guardrails; perf
  stays manual. **Rationale:** automate the highest-risk logic and the must-hold
  reading promises. **Trade-off:** two dev deps; perf not fully automated.
  **Rejected:** framework-free, Vitest-only, Lighthouse-as-primary. → ADR-008.
- **Decision:** DOM hit-area (silhouette-approximate) for clicks; overlay stays
  `pointer-events: none`. **Rationale:** never intercept page click/scroll.
- **Decision:** Three-state control (`visible`/`silenced`/`dismissed`), default
  `visible`; `silenced` = static-but-present, `dismissed` = gone with a discreet
  return button. **A11y:** Canvas decorative/`aria-hidden`; control is a
  focusable, labeled button.

### Known Risks

- **Distraction from reading (high impact)** — mitigated by always-on guardrails
  (quiet mode at ~6s scroll / ~8s dwell, reduced-motion → static tier 0,
  dismissible) and peripheral corner placement that never overlaps the article;
  corner relocation never fires during quiet mode.
- **Scope creep on the simulation (medium)** — mitigated by strict phasing;
  Phase 1 (steps 1–6) ships valuable on its own.
- **Likeness / uncanniness (medium)** — mitigated by the low-poly chibi +
  hand-painted pipeline (ADR-006), iterating against `_referencias/` with owner
  sign-off; **prototype `idle` + `sleep` early** to validate the read.
- **Clip-name / gaze-bone drift (low)** — mitigated by the typed `ELIS_CLIPS`
  map and an up-front bone-naming convention.
- **Battery on weak mobile (medium)** — mitigated by tier 0 ambient-only
  degradation, DPR cap, and rest pausing (not by disabling play, which stays on
  for capable mobile).
- **E2E flakiness around 3D/timing (low)** — mitigated by asserting DOM/
  behavioral facts, not pixels or FPS (ADR-008).

## Architecture Decision Records

- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Emergent
  mood/energy simulation over a scripted character or opt-in widget, bounded by
  reading guardrails.
- [ADR-002: Play Mode as a Toy-Den Metaphor](adrs/adr-002.md) — Elis fetches toys
  from her own den; engaging is the visitor's choice.
- [ADR-003: Mood/Energy State in an External Store Driven by the Render Loop](adrs/adr-003.md)
  — Plain external store ticked in `useFrame`, React via `useSyncExternalStore`
  only at the UI boundary; no new dependency.
- [ADR-004: On-Demand Render Loop with Device Tiers and Rest Pausing](adrs/adr-004.md)
  — `frameloop="demand"`, DPR cap, device tiers, and pausing on
  rest/hidden/off-viewport to bound runtime cost.
- [ADR-005: Baked Animation Clips on a Draco-Compressed GLB with Procedural Gaze](adrs/adr-005.md)
  — Baked clips crossfaded by mood, procedural gaze, delivered as a
  Draco-compressed `elis.glb`.
- [ADR-006: Elis Model Construction — Low-Poly Box-Model with a Hand-Built Armature](adrs/adr-006.md)
  — Box-model chibi low-poly, hand-painted, manual rig with named bones built
  from `_referencias/`.
- [ADR-007: Animation Design — Phased, Mood-Mapped Clip Catalog with Transitions](adrs/adr-007.md)
  — Phased per-mood catalog with dedicated transition clips; store-driven
  selection, procedural gaze on top.
- [ADR-008: Validation Strategy — Vitest for Simulation Logic, Playwright for Guardrails](adrs/adr-008.md)
  — Vitest for the pure logic (seeded RNG + simulated time), Playwright for the
  P0 guardrails; 3D scroll perf stays a manual assisted check.
