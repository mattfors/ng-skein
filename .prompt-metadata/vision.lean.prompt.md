
# ng-skein Vision (Lean Codex Version)

## Purpose
ng-skein is an event-driven, JSON-configurable, local-first workflow engine for industrial & commercial processes. 
It replaces ad-hoc Angular business logic with a single, introspectable source of truth.

## Problem
- Bespoke Angular apps couple UI & business logic → fragile, inconsistent, opaque.
- Business process knowledge exists only in code; devs become translators.
- Parallel truths: code vs compliance docs → drift & distrust.
- Blocking network requests halt users in poor-connectivity environments.

## Core Principles
1. **Workflow JSON as Contract**
   - Workflow → Step Sequence → Step → Atom (atomic human interaction).
   - JSON is human-readable, AI-editable, renderable, auditable.
   - Drives UI, docs, validation, simulation.
2. **Event-Sourced State**
   - Append-only, timestamped domain events.
   - Producers are dumb (emit events only); consumers are pluggable.
   - Replayable state for debugging, QA, training.
3. **Local-First**
   - PouchDB stores definitions, data, and events locally.
   - Operates offline; syncs when network returns.
   - Non-blocking background request queue driven by events.
4. **Pluggable Domain Logic**
   - Core is domain-agnostic; “pick/pack/scan” live in plugins/config.
   - Validations embedded in workflow JSON (equals, contains, etc.).
5. **Audit & Compliance Built-In**
   - Instant plain-text process export (ISO/FDA/etc.).
   - Step/atom execution history & anomaly detection.
   - Detect process-signature deviations in real time.
6. **UI as Execution Channel**
   - Angular Material, voice, SMS, CLI, legacy terminals all supported.
   - Same workflow & events, different renderers.

## Example Event Flow
1. UI emits `location.scan`.
2. Listener enriches with Wi-Fi metrics → emits `telemetry.wifi`.
3. Other listeners build heatmaps, warn users, attach to QA.

## Benefits
- Single source of truth for code, docs, and audits.
- Rapid AI-assisted modification of workflows.
- Zero-code UI updates from JSON.
- Non-invasive feature extension via listeners.
