# 📦 ng-skein Project Overview

> System-wide design prompt for AI tools and developers. This file provides context for code generation, introspection, and architectural decisions in a prompt-driven, event-sourced Angular application.

---

## 🧠 Project Summary: **ng-skein**

### Overview

`ng-skein` is a modular, local-first, event-driven workflow platform designed using Angular and PouchDB. It models reactive state and view composition entirely from **append-only event streams**, resembling systems like **Kafka** but scoped to a frontend domain.

It supports dynamic workflows rendered from JSON definitions and is designed to be AI-extensible and developer-friendly via `.prompt.md` metadata files.

The name "skein" reflects the image of interwoven threads — data, events, and UI are stitched together in a reactive architecture.

---

## 🌐 Architecture Highlights

### 🧾 Document Types (Namespaced by `_id`)

All data in PouchDB is stored with structured, prefix-based IDs:

| Type         | Example `_id`                            | Purpose                                |
| ------------ |------------------------------------------| -------------------------------------- |
| `events`     | `events:picking:picklist:work1234:step1` | Immutable, timestamped workflow events |
| `data`       | `data:picking:picklist`                  | Server-synced models like picklists    |
| `definition` | `definition:picking:0`                   | Static workflow JSON definitions       |
| `view`       | `view:picking:0`                         | Reduced, cacheable views for rendering |

---

### 🧱 Namespace Model

```ts
interface Namespace {
  type: 'events' | 'data' | 'definition' | 'view';
  domain: string;
  subdomain?: string;
  context?: string;
  subcontext?: string;
}
```

This namespace structure is translated into `_id`s and used for filtering document queries.

---

### ⚙️ Reactive Layers

Three major types of **watchers** listen to changes in event streams:

1. **Effects** – Watch for specific new events and cause side effects (e.g., init workflow)
2. **Reducers** – Reduce all events in a namespace to a derived state object (e.g., workflow state)
3. **Data Sinks** – Persist reduced views to `view:*` docs for caching and rendering

---

### 🧩 Workflow Composition

Workflows are defined declaratively via JSON:

```ts
{
  id: 'picking',
  label: 'Picking',
  type: 'workflow',
  children: [
    {
      id: 'list-work',
      type: 'workflow',
      subtype: 'table'
    },
    {
      id: 'perform-work',
      type: 'workflow',
      subtype: 'stepper',
      children: [
        { id: 'scan-bin', subtype: 'step' },
        { id: 'scan-carton', subtype: 'step' }
      ]
    }
  ]
}
```

---

### 🛠 Persistence Layer

All PouchDB interactions are abstracted behind a `PersistenceService`, with specialized services like:

- `EventPersistenceService` – adds/reads event documents based on scope
- `ViewPersistenceService` – reads/writes reduced state
- `WorkflowDefinitionService` – loads JSON workflows

---

### ⚡ Real-Time Editing

Workflow definition documents include `_rev` and are fully hot-editable. You can:

- Update JSON in `/admin/view:workflow`
- See real-time changes reflected in other tabs or devices
- Use versioning (via `_rev`) to support undo, beta testing, or blue/green deployment

---

## 🚧 What’s Already Done

- Event + View `PersistenceService` using RxJS + PouchDB
- Document naming conventions and scope modeling
- `.prompt.md` metadata system for introspection
- Namespace system that maps to `_id`s
- Workflow definition schema with `stepper`, `table`, etc.
- Basic ASCII logo and branding decisions (`ng-skein`)
- Designed multilevel caching with live document watchers

---

## ✅ Next Steps

### 🔨 Technical

1. **Build Reducer Infrastructure**

  - Create a reducer service that subscribes to `EventPersistenceService.getAll()` and emits reduced state
  - Store output into `view:*` docs via `ViewPersistenceService`

2. **Create Workflow Composer**

  - Transform workflow definitions + current state into a view model
  - Enable dynamic component rendering

3. **Implement Effect Watchers**

  - Add reactive listeners for `init`, `navigate`, and other trigger events

4. **Add Navigation State**

  - Track current workflow, step index, and context ID via event stream
  - Persist to view state for restoration

5. **Admin UI**

  - Build `/admin/view:*` editors with live JSON editing
  - Support `_rev` versioning and rollback

6. **Scaffold More Services**

  - `WorkflowDefinitionService`
  - `WorkflowRuntimeService`
  - `WorkflowNavService`

---

## 🧑‍💻 For GPT Use

> This is a **prompt-driven, event-sourced Angular application**. All state is derived from `events:*` documents. Do not mutate state directly — always create new event documents. View rendering and workflow state are derived via reducers and live document caches.
