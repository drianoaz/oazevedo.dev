# PRD: Elis — A Living 3D Cat Companion for oazevedo.dev

## Overview

oazevedo.dev is a reading-first personal blog. This feature introduces **Elis**,
a 3D model of the owner's real cat, as a signature, living presence on the site.
Elis is not a static decoration: she has a small inner life (mood and energy)
that drives semi-autonomous behavior, reacts to the visitor's cursor or touch,
responds when clicked, notices page scrolling, and — when invited — plays with
toys she fetches from her own little den.

- **What problem it solves**: A personal blog competes for attention and memory.
  Elis gives oazevedo.dev a one-of-a-kind, affectionate identity and a moment of
  delight that visitors remember and talk about.
- **Who it is for**: Visitors of oazevedo.dev — primarily developers and curious
  readers — and the owner, who wants a distinctive signature for his site.
- **Why it is valuable**: It turns a generic blog into a memorable place with
  personality, while doubling as a tasteful demonstration of front-end and 3D
  interaction craft.

Elis is explicitly a **secondary delight**. The primary product remains the
written content. Every behavior is bounded by hard guardrails so reading is
never disrupted.

## Goals

- Deliver a believable "living pet" presence that feels alive rather than
  scripted, while never interfering with reading.
- Make Elis instantly endearing and recognizably the owner's real cat (calico
  coat, green eyes, striped tail) rendered in a cute, chibi-like style.
- Give visitors full control: Elis is on by default but can be dismissed or
  silenced, with the preference remembered across visits.
- Offer optional, character-driven play (toys fetched from a den) that the
  visitor chooses to engage with.
- Work across desktop (cursor) and mobile/tablet (touch), with graceful
  degradation on weak devices.
- Respect accessibility and performance as first-class requirements.

Target milestone: a phased rollout (see Phased Rollout Plan), with Phase 1
(ambient life) shippable independently.

## User Stories

**Primary persona — The Reader (developer / curious visitor)**

- As a reader, I want Elis to stay out of my way while I read, so that the
  content always comes first.
- As a reader, I want to glance over and see Elis doing something charming
  (napping, watching my cursor, stretching), so that the site feels alive.
- As a reader, I want to dismiss or silence Elis with one obvious action, so
  that I'm always in control.
- As a returning reader, I want my choice to keep/dismiss Elis remembered, so
  that I don't have to repeat it.

**Secondary persona — The Player (visitor in the mood to interact)**

- As a player, I want to click Elis and get a cute reaction (a scratch, rolling
  belly-up), so that interacting feels rewarding.
- As a player, I want Elis to react when I move my cursor or scroll, so that she
  feels responsive to me.
- As a player, I want to play with a toy that Elis brings from her den (a ball,
  a feather wand, a laser dot), so that I can engage on my own terms.
- As a player on my phone, I want to drag a toy with my finger and watch Elis
  chase it, so that the experience works on touch.

**Tertiary persona — The Owner**

- As the owner, I want Elis to look like my real cat in an adorable style, so
  that she is personal and authentic.
- As the owner, I want Elis to showcase craft without looking like she hurts the
  site's quality (speed, accessibility), so that she reflects well on me.

## Core Features

Grouped by priority. Functional behavior only; implementation lives in the
TechSpec.

### P0 — Living presence (ambient life)

- Elis occupies a fixed corner area of the viewport and persists across page
  navigation.
- She has an internal mood/energy state (e.g., playful, curious, sleepy, bored)
  that evolves over time and drives **semi-autonomous behavior**: idling,
  napping on her own schedule, stretching, looking around, occasionally
  wandering along the viewport edge, and now and then seeking attention.
- She tracks and reacts to the visitor's cursor position (turning her head /
  glancing) and, when idle long enough, settles down or sleeps.

### P0 — Reading guardrails (always-on)

- Elis never captures focus, never steals scroll, and never overlaps primary
  reading content in a way that obstructs it.
- **Active-reading quiet mode**: when the visitor is actively reading
  (sustained scrolling through an article, or engaged with content), Elis
  automatically reduces to minimal, calm motion.
- **Reduced motion**: when the visitor's system requests reduced motion, Elis
  defaults to a still or minimal state.
- **Dismiss / silence**: a discreet, always-available control hides or quiets
  Elis; the preference is remembered across visits.

### P1 — Direct interaction

- Clicking/tapping Elis triggers an affectionate reaction (e.g., scratching,
  rolling belly-up).
- Scrolling the page is noticed by Elis (e.g., she perks up or tries to follow),
  consistent with quiet mode when the visitor is clearly reading.

### P1 — Play mode (toy-den metaphor)

- Elis has a small **den** in a viewport corner.
- She can fetch a **toy** from the den and leave it available in a "play corner"
  for the visitor.
- The visitor **chooses** to engage by picking up / moving the toy; nothing
  auto-starts play.
- Toy roster (phased): **ball**, **feather wand**, **laser dot**. Each toy has
  its own play behaviors — chasing, pouncing with both paws, wiggling before
  darting off, etc.

### P2 — Mobile/touch adaptation

- On touch devices Elis is present and adapted: she follows the touch/drag point
  instead of a mouse, and toys are dragged with a finger.
- Behavior and visuals degrade gracefully to protect battery and performance on
  weaker GPUs.

### Feature interactions

- The mood/energy state is the hub: cursor/touch movement, clicks, scrolling,
  and toy engagement all feed into it and shape reactions, rather than firing
  isolated, disconnected clips.
- Reading guardrails always take precedence over playful behavior.

## User Experience

**Key personas & goals**: Readers want undisturbed content with ambient charm;
Players want responsive, optional fun; the Owner wants authenticity and craft.

**Primary flow — passive reader**

1. Visitor lands on any page; Elis is present and quietly alive in a corner.
2. Visitor reads; Elis stays calm and never blocks content. During sustained
   reading she settles into minimal motion.
3. Visitor occasionally glances over and is rewarded with a charming micro-moment
   (a stretch, a glance, a nap).

**Primary flow — playful visitor**

1. Visitor notices Elis reacting to their cursor/touch.
2. Visitor clicks Elis → she reacts affectionately.
3. Visitor notices Elis's den and a toy she brought out; visitor picks up / moves
   the toy and Elis plays (chase, pounce, wiggle).
4. Visitor stops; Elis returns to ambient life.

**Control flow**

1. At any time the visitor uses the discreet control to hide or silence Elis.
2. The choice persists on the next visit.

**Discoverability & onboarding**

- No blocking intro or modal. Discovery is organic: Elis's liveliness invites
  attention; play is hinted gently and occasionally (never nagging), and is
  always dismissible.

**Accessibility**

- Honors `prefers-reduced-motion`.
- Never traps focus or interferes with keyboard navigation of the page.
- The dismiss/silence control is reachable and operable; Elis's presence must
  not degrade screen-reader use of the content.

## High-Level Technical Constraints

- **Reuse existing foundation**: the site already includes a 3D rendering stack
  (React 19, Next.js App Router, and the installed Three.js / React Three Fiber /
  drei libraries) and a global overlay mount point in the root layout.
- **Disposable prototype**: an earlier cat prototype (`src/components/cat/*` and
  `public/cat.glb`) is to be ignored and may be removed; the model is produced
  fresh in Blender from the references in `_referencias/`.
- **Performance from the visitor's perspective**: Elis must not noticeably slow
  page load or scrolling; she must stay within a strict runtime budget and not
  cause jank, with graceful degradation on weak/mobile devices.
- **Privacy**: only a local preference (keep/dismiss/silence) is stored; no
  personal data is collected.
- No implementation specifics (engine internals, file formats, architecture) are
  prescribed here — see the TechSpec.

## Non-Goals (Out of Scope)

- No full game, scoring, achievements, or multiplayer.
- No autonomous movement across or over the article text body (Elis stays in
  peripheral areas).
- No audio/sound effects in the initial scope.
- No user customization of Elis (skins, names, accessories) initially.
- No analytics-heavy instrumentation beyond lightweight, privacy-respecting
  signals (if any).
- No shipping all three toys at once if phasing dictates otherwise.
- No reliance on the existing prototype's behavior or assets.

## Phased Rollout Plan

### MVP (Phase 1) — Ambient living presence + guardrails

- Fresh Elis 3D model and core idle/mood behavior (P0 living presence).
- All reading guardrails (P0): active-reading quiet mode, reduced-motion, and a
  dismiss/silence control with remembered preference.
- Cursor/touch awareness (head glance) on desktop and mobile, basic.
- **Success criteria to proceed**: Elis renders smoothly within the performance
  budget on desktop and mid-range mobile; guardrails verifiably prevent reading
  disruption; the owner is happy with the likeness and charm.

### Phase 2 — Direct interaction

- Click/tap reactions (scratch, belly-up) and scroll-aware reactions (P1),
  always subordinate to quiet mode.
- **Success criteria to proceed**: interactions feel responsive and delightful
  without increasing distraction or harming performance.

### Phase 3 — Play mode (toys) + full living simulation

- Den + toy-fetching ritual and the first toy (e.g., ball); then add feather
  wand and laser dot.
- Richer emergent behaviors (wandering, attention-seeking) and full mobile
  touch-drag play.
- **Long-term success criteria**: visitors discover and enjoy play organically;
  Elis remains within budget and never disrupts reading; the feature becomes a
  recognizable signature of the blog.

## Success Metrics

Given Elis is a secondary delight, success is mostly qualitative plus light
guardrail metrics:

- **Reading is unharmed** (must-hold): no measurable regression in page load or
  scroll smoothness attributable to Elis; reading quiet mode demonstrably
  engages during active reading.
- **Accessibility honored**: reduced-motion and dismiss preferences work 100% of
  the time and persist.
- **Delight signals**: positive qualitative feedback (comments, social shares,
  word-of-mouth) mentioning Elis; the owner's own satisfaction with likeness and
  feel.
- **Control adoption stays low-friction**: visitors who dismiss can do so easily;
  dismissal is the exception, not the norm.
- **Performance budget held**: Elis stays within the agreed runtime/render budget
  on target devices.

## Risks and Mitigations

- **Distraction from reading** — the core risk for a reading-first site.
  _Mitigation_: always-on guardrails (quiet mode, reduced-motion, dismissible),
  peripheral placement, and play that is opt-in.
- **Over-ambition / scope creep** — the living-pet simulation is the most
  ambitious option. _Mitigation_: strict phasing; Phase 1 ships valuable on its
  own; toys are added incrementally.
- **Charm/likeness misses** — Elis might not feel like the real cat or might feel
  uncanny. _Mitigation_: iterate on the model against the photo and drawing
  references with owner sign-off before broad rollout.
- **Discoverability vs. intrusion for play** — hints could become nagging.
  _Mitigation_: subtle, occasional, dismissible invitations only.
- **Device/battery cost on mobile** — rich 3D can drain weak devices.
  _Mitigation_: graceful degradation and a conservative mobile experience.

## Architecture Decision Records

- [ADR-001: Elis as a Living Pet Simulation](adrs/adr-001.md) — Choose an
  emergent mood/energy-driven simulation over a scripted reactive character or an
  opt-in play widget, bounded by reading guardrails.
- [ADR-002: Play Mode as a Toy-Den Metaphor](adrs/adr-002.md) — Replace the raw
  "laser button" with Elis fetching toys (ball, feather wand, laser dot) from her
  own den; engaging is the visitor's choice.

## Open Questions

- **Quiet-mode trigger definition**: what exactly counts as "active reading"
  (e.g., sustained scroll within an article vs. idle dwell)? To be refined with
  the owner during design.
- **Play discoverability cadence**: how often and how subtly should Elis hint at
  play before it feels nagging?
- **Mobile depth**: how much of the full play experience is worth bringing to
  touch vs. keeping ambient-only on the weakest devices?
- **Toy order**: which toy ships first in Phase 3 (ball assumed) and final roster
  priority.
- **Placement rules per page type**: any pages (e.g., long-form articles) where
  Elis should start more subdued by default?
