# 📨 DocEnvelope<T> Model

This model wraps arbitrary data (`T`) for storage in PouchDB. It standardizes document structure for all persisted objects in the system, ensuring they include the necessary `_id` and optional `_rev` fields for Couch-style replication and conflict resolution.

---

## 📦 Purpose

`DocEnvelope<T>` is a generic container used to store typed data in PouchDB. It adds revision control metadata required by the database, while keeping the wrapped domain object isolated inside the `data` field.

This makes the envelope:

- Compatible with PouchDB and CouchDB’s replication model
- Easily versioned (`_rev`)
- Type-safe and model-agnostic (`T`)

---

## 🧱 Structure

```ts
export interface DocEnvelope<T = any> {
  _id: string;       // Required: Unique key, often namespaced
  _rev?: string;     // Optional: Used for update/merge by PouchDB
  data: T;           // Payload: Any domain object
}
```

---

## 🧠 Usage Patterns

- Use this to **wrap any document** stored or retrieved via `PersistenceService`
- The `data` field contains the actual payload — `Picklist`, `WorkflowDefinition`, etc.
- The `_id` follows the system's structured namespace convention (e.g., `view:picking:stepper`)
- The `_rev` is required when updating existing docs via PouchDB, but optional on insert

---

## ✅ Example

```ts
const envelope: DocEnvelope<Picklist> = {
  _id: 'data:picking:picklist:PL1234',
  _rev: '1-abcdef',
  data: {
    id: 'PL1234',
    items: [...]
  }
};
```

---

## 🔄 Related Systems

- Used across `PersistenceService` and its domain-specific wrappers
- Stored documents should be filtered using `_id` prefix patterns
- Compatible with live change tracking in `pouchdb.changes()`

---

## 🧑‍💻 For GPT Use

- Always wrap saved domain models in `DocEnvelope<T>`
- Do not store raw `T` objects directly in PouchDB
- For new documents, omit `_rev`
- When updating, ensure `_rev` is preserved to avoid conflicts
