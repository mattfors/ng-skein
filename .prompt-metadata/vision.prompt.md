# 🌱 Vision: Why ng-skein Exists

> A system design rationale for devs, AI agents, and decision‑makers. This explains **why** we use event‑driven workflows, JSON‑configurable definitions, and local‑first state — beyond mechanics.

---

## 🎯 The Problem With Bespoke Angular Apps

- Visual frameworks (e.g., Angular Material) feel structured but still allow **too much freedom**.
- Business logic **bleeds into components**, especially “shared” ones.
- Workflows are **imperatively re‑implemented** across routes/services/templates.
- There’s **no single, introspectable source of truth** for how the process works.
- You can’t reliably generate **plain‑text docs, test harnesses, or audits** from the code.

**Deeper failure:** In most orgs, **nobody can explain how a process works** (or should work) without reading code.  
Developers become **translators/interpreters** whenever the business asks, “What happens at this step and why?”

**Result:** brittle UIs, inconsistent behavior, hidden logic, parallel truths, and constant drift between “what we do” and “what we say we do.”

---

## ✅ Vision: Workflow JSON Is the Business Contract

We treat `workflow.definition.json` as the **contract** between the business and the app. It is:

- **Human‑readable**
- **AI‑writable**
- **Auditable**
- **Renderable**

From one definition we can:
- Render a UI (stepper/table/etc.)
- Produce a plain‑English description
- Validate state transitions
- Version, diff, and review like code

This creates shared understanding for product, ops, dev, QA, and compliance.

---

## 🧾 Why Declarative Workflows Are Self‑Documenting

Defining processes in a structured workflow file makes it the **single source of truth** — not just for UI, but for the *business process itself*.

From this source we can generate:

- **Regulatory docs:** steps, roles, validations, auditability, version history
- **Onboarding guides:** natural‑language walkthroughs, contextual help
- **QA/Audit views:** execution history, step durations, skipped/accelerated steps
- **AI/GPT interactions:** “Explain step 3,” “Simulate a run,” “Propose an optimization”

### Bidirectional Design
Because definitions are **declarative, human‑readable, machine‑parseable, AI‑compatible**, we can move **from docs → executable UI** and **from UI → docs**.

---

## 🧩 Vocabulary & Composition Model

To avoid ambiguity, we name the layers explicitly:

- **Workflow** — a business process definition (top‑level)
- **Step Sequence** *(a “sub‑workflow”)* — an ordered group of steps
- **Step** — a visible unit in the UI; **not atomic** (it may require many interactions)
- **Atom** — the **atomic human interaction** (e.g., scan once, press a specific button, capture one photo)

> Events are emitted **per Atom**. Steps group Atoms. Step Sequences group Steps. Workflows group Sequences.

- Steps may be **conditionally shown/hidden** (no branching control‑flow; linear but conditional).
- **Validation** rules live in the workflow definition (e.g., `equals`, `contains`, etc.).

> Codex note: generate UIs/logic around **Steps** (containers) and **Atoms** (emit events).

---

## 🏗 Domain‑Agnostic Core (Plugins & Config)

ng‑skein’s core is **domain‑agnostic**. Terms like “pick,” “order,” “receipt,” or device names live in **plugins/config**, not the base app.  
The base app ships with **demonstration flows** and **adapter shims** that simulate a backend — both to **learn** and to **test** (Storybook/Showcase style).

---

## 📡 Why Local‑First Matters

We operate in **industrial & commercial settings** with unreliable connectivity:

- Dead Wi‑Fi zones, fringe signal, shared devices, signal‑blocking infrastructure.

So:
- **Client‑side state is authoritative** during execution.
- Users must **complete processes offline**.
- UIs render from **local JSON**; events are **captured immediately** and sync later.

This is why we use **local persistence**, **append‑only events**, and **declarative UIs** that respond to local state.

---

## 🚏 Non‑Blocking Requests via Event Queues

Server requests are modeled as **events**, too. That means network work can be **queued, retried, and paused** in the background:

- User actions (Atoms) **never block** on HTTP.
- If connectivity drops, requests are **paused**; when it returns, they **re‑run**.
- The user progresses to the **next item of work** while the queue handles retries and backoff.
- Failures emit events (e.g., `request.failed`) that observers can monitor, aggregate, or surface gently.

**Outcome:** throughput continues; users aren’t turned into human retry buttons.

---

## 📣 Event Streams in Practice (Decoupling, Enrichment, Observability)

Imperative components swell with UI + validation + telemetry + analytics + audits. Event architecture flips it:

- **Producers stay dumb:** components emit **domain events** (per Atom).
- **Consumers are pluggable:** effects/listeners add behavior without touching UI.
- **Behavior is discoverable:** streams expose what happened and why.
- **Enrichment is cheap:** create derived events instead of patching components.
- **Audits are native:** the append‑only log is the record.

### Example: Wi‑Fi telemetry at “location.scan”
1) UI emits:
```json
{ "type": "location.scan", "payload": { "locationId": "A-12", "deviceId": "Zebra-7" } }
```
2) A listener enriches:
```ts
on('location.scan', async e => {
  const wifi = await readWifiMetrics(); // ssid, rssi, downlink, effectiveType
  emit({ type: 'telemetry.wifi', correlatesWith: e.id, payload: { locationId: e.payload.locationId, ...wifi } });
});
```
3) Other listeners build heatmaps, warn for offline risk, attach telemetry — **no UI change required**.

### Example: Anomaly detection via data signatures
Two Steps in series: **scan item** → **scan container**.  
If a **product barcode** appears in the **container scan** Step, flag a **quality.alert** immediately — a signature that often correlates with overfills.  
Listeners do this without mutating Step logic.

---

## 🧠 Core Philosophy: Users as Deterministic State Machines

Users perform **Atoms**; each Atom emits an **event**:
- Events are **timestamped**, **append‑only**, and **drive state** through reduction.
- The system is **replayable**: reconstruct what happened, when, and why.
- No in‑place mutation; state is always derived from the event sequence.
- Simulation is trivial: emit the same events as a user.

---

## 🗣 Interfaces Are Just Execution Channels

Once Atoms → events and Workflows → JSON, the UI is just a renderer.  
The same workflow can run via:
- Angular stepper
- Voice
- SMS/chat
- Text‑only terminals
- Automated test agents / AI

The **view model** (definition + events) is the layer; “UI” is a **skin**.

---

## 🔐 Roles

- **Workflow‑level** access is gated by user roles (e.g., you either can run the workflow, or you cannot).
- **Individual Steps/Atoms** are **not role‑gated** in the base philosophy.

---

## 📚 Naming, Testing, Versioning (policy level)

- **Event naming**: concise, human‑readable, domain‑agnostic (documented separately).  
  > Codex: name events as “what happened,” not “what code did.”

- **Testing**: each workflow gets a **simulated event sequence** that validates happy paths, edge cases, anomaly monitors, and background request handling.

- **Versioning**: workflows are **modifiable on the fly** (JSON/TOML/drag‑drop/chat).  
  For stable replay/audit, tie each execution to a specific **workflow definition version** (mechanics in the technical doc).

---

## 🚫 What We Avoid

- Hardcoded button behavior tied to services  
- Domain‑specific logic in shared components  
- “Add a route and write bespoke code” patterns  
- APIs as the sole truth

---

## 🧪 What This Enables

- Self‑documenting UIs
- Time‑travel debugging & replay
- Safe AI extensibility
- Instant compliance exports
- Per‑user workflow customization
- Zero‑code form generation
- Demo/showcase that doubles as test harness
- Non‑blocking, auto‑retry background requests

---

## ✅ Summary

ng‑skein isn’t a component library or just state management. It’s a **process substrate** where:

- Processes are **defined** (declarative, JSON‑driven, modular),
- **Executed** (event‑sourced, replayable, state‑machine‑driven),
- **Visualized** (multiple UI/UX channels),
- **Documented/Audited** (single source of truth),
- **Edited live** (by humans or AI, with versioned replays),
- **Kept flowing** even when the network isn’t (non‑blocking queues).

This replaces brittle bespoke apps with a system where compliance is a feature and AI can safely collaborate.
