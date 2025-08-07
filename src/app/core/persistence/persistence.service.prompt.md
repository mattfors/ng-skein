# persistence.service.ts

## Purpose

This service wraps a local-first PouchDB instance to provide generic, model-agnostic
persistence operations in a reactive (RxJS-based) style.

## Responsibilities

- Store and retrieve documents by ID
- Remove documents with revision support
- Stream all documents in a namespace or prefix
- Subscribe to live change feeds from the database
- Abstract `_id`/`_rev` handling via a generic `DocEnvelope<T>` interface

## Key Concepts

- All documents are wrapped in a `DocEnvelope<T>`:
  ```ts
  export interface DocEnvelope<T> {
    _id: string;
    _rev?: string;
    data: T;
  }
  ```

- PouchDB is configured as a singleton database called `"skein"` and is never exposed
  outside this service.

## API

```ts
put<T>(doc: DocEnvelope<T>): Observable<PouchDB.Core.Response>
```
Writes a document with a known `_id`. Handles both new and updated documents.

---

```ts
get<T>(id: string): Observable<DocEnvelope<T>>
```
Retrieves a document by `_id`.

---

```ts
remove<T>(doc: DocEnvelope<T>): Observable<PouchDB.Core.Response>
```
Removes a document using its `_rev`. Throws an error if `_rev` is missing.

---

```ts
allDocs<T>(opts: PouchDB.Core.AllDocsOptions = {}): Observable<PouchDB.Core.AllDocsResponse<DocEnvelope<T>>>
```
Streams documents within a given prefix or range. Always sets `include_docs: true` internally.

---

```ts
changes(): Observable<PouchDB.Core.ChangesResponseChange<DocEnvelope<any>>>
```
Listens to live change events from the database and emits full documents.

## Notes

- All methods return cold RxJS observables and are designed to be composed in higher-level services.
- This service forms the foundation for domain-specific persi
