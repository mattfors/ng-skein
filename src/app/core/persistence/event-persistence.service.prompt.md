# event-persistence.service.ts

## Purpose

This service handles all event storage operations in the Skein event stream system.
  It wraps the generic `PersistenceService` and provides structured event storage
based on a namespaced `EventScope`.

## Responsibilities

- Generate unique event `_id`s using a scoped namespace + UUID
- Store events in the `events:` namespace in PouchDB
- Retrieve all events matching a given scope as plain `T[]` values
- Abstract PouchDB internals using the `DocEnvelope<T>` format

## Key Concepts

- Events are stored as documents with `_id` based on the following structure:
  ```
  events:{domain}:{subdomain}:{context}:{subcontext}:{uuid}
  ```

  - Scoping is provided by `EventScope`:
```ts
  export interface EventScope {
    domain: string;
    subdomain?: string;
    context?: string;
    subcontext?: string;
  }
  ```

- Events are stored in this wrapper format:
  ```ts
  export interface DocEnvelope<T> {
    _id: string;
    _rev?: string;
    data: T;
  }
  ```

## API

  ```ts
add<T>(scope: EventScope, data: T): Observable<PouchDB.Core.Response>
```
Creates a new event document with a generated `_id` based on the scope and a UUID.

---

  ```ts
getAll<T>(scope: EventScope): Observable<T[]>
```
Returns all event data values matching the given scope, using a `startkey`/`endkey` range query.

## Notes

- This service is intended for append-only usage — new events are added, not updated or deleted.
- Downstream reducers, effects, or views are expected to watch for new events and update state accordingly.
- All interactions with PouchDB happen through the `PersistenceService`.

## Dependencies

- `uuid` for generating unique event IDs
- `rxjs` for reactive handling
- `pouchdb-browser` for local-first event storage
