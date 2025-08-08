# Contributing (RxJS-Only Async)

## Rule
All asynchronous code **must** use **RxJS Observables**.  
Do **not** use raw Promises or `async/await` in application code.

- If a library returns a Promise, **wrap it at the boundary** with `from()` or `defer()`.
- Compose with operators (`map`, `switchMap`, `mergeMap`, `catchError`, etc.).
- Avoid nested `subscribe`; prefer composition and return Observables.

## Allowed Exception
Low-level persistence adapters may call Promise APIs **only to wrap them immediately**:

```ts
// ✅ boundary wrapping
import { from, defer } from 'rxjs';
get$ = (id: string) => from(this.db.get(id));            // idempotent reads
put$ = (doc: Doc) => defer(() => this.db.put(doc));      // side-effecting writes
```

## Anti-patterns (do not commit)
```ts
// ❌ Promise chains
this.db.get(id).then(x => ...);

// ❌ async/await
const out = await this.db.put(doc);

// ❌ New Promise
return new Promise((resolve) => ...);
```

## Linting
The repo enforces this rule via ESLint. Run:
```bash
npm run lint
```
Fix violations by converting Promises to Observables with `from()`/`defer()`.

## PR Checklist (RxJS)
- [ ] No `async`, `await`, `.then`, `new Promise`.
- [ ] Promise-returning APIs wrapped once at the boundary.
- [ ] Streams are composed with RxJS operators.

