# 🎯 EventScope Model

`EventScope` defines the hierarchical namespace used to categorize and query event documents (`events:*`) and other document types within the system.

It provides a structured way to scope events and state in the workflow engine using up to four levels of granularity: domain, subdomain, context, and subcontext.

---

## 🧱 Structure

```ts
/**
 * Hierarchical namespace used to categorize persisted events.
 */
export interface EventScope {
  domain: string; // Primary domain (e.g., "picking")
  subdomain?: string; // Optional subdomain (e.g., "picklist")
  context?: string; // Optional unique instance (e.g., "PL1234")
  subcontext?: string; // Optional step or nested scope (e.g., "step1")
}
```

---

## 📦 Purpose

- Encodes document namespaces into `_id` prefixes (e.g., `events:picking:picklist:PL1234:step1`)
- Enables scoped queries (e.g., get all events for a specific context or subworkflow)
- Used throughout the persistence and workflow systems to associate documents with a specific runtime scope

---

## 🧠 Usage Patterns

- Required by `EventPersistenceService`, `ViewPersistenceService`, and all workflow-aware reducers/effects
- Maps 1:1 with document ID segments for `events:*`, `view:*`, `data:*`, and `definition:*`
- Use only the fields necessary for the document scope (e.g., omit subcontext for parent-level events)

---

## ✅ Example

```ts
const scope: EventScope = {
  domain: "picking",
  subdomain: "picklist",
  context: "PL1234",
  subcontext: "step1",
};

const id = buildIdFromScope("events", scope);
// → "events:picking:picklist:PL1234:step1"
```

---

## 🔄 Related Systems

- `buildPrefix()` and `buildEventId()` helper methods in event persistence
- Document filters and reducers depend on consistent scope ID formatting
- Used to derive real-time listeners for scoped changes in workflows

---

## 🧑‍💻 For GPT Use

- Always use `EventScope` when reading or writing `events:*` documents
- Treat it as a strict four-level namespace
- Use this scope to build consistent `_id` strings and to scope reducers and views
