import { Injectable } from '@angular/core';
import { EventScope } from '../model/event-scope.model';
import { PersistenceService } from './persistence.service';
import { v4 as uuidv4 } from 'uuid';
import { DocEnvelope } from '../model/doc-envelope.model';
import { Observable, filter, from, map, mergeMap, concat } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventPersistenceService {
  private readonly prefix = 'events';

  constructor(private persistence: PersistenceService) {}

  /** Builds the PouchDB _id prefix from the event scope */
  private buildPrefix(scope: EventScope): string {
    const { domain, subdomain, context, subcontext } = scope;
    return [
      this.prefix,
      domain,
      subdomain ?? '_',
      context ?? '_',
      subcontext ?? '_',
    ].join(':');
  }

  /** Builds a full _id with UUID for a new event */
  private buildId(scope: EventScope): string {
    return `${this.buildPrefix(scope)}:${uuidv4()}`;
  }

  /** Add a new event document under the given scope */
  add<T>(scope: EventScope, data: T): Observable<PouchDB.Core.Response> {
    const doc: DocEnvelope<T> = {
      _id: this.buildId(scope),
      data,
    };
    return this.persistence.put(doc);
  }

  /** Get all event documents matching the given scope prefix */
  getAll<T>(scope: EventScope): Observable<T[]> {
    const prefix = this.buildPrefix(scope);

    return this.persistence
      .allDocs<DocEnvelope<T>>({
        startkey: prefix,
        endkey: prefix + '\ufff0',
      } as PouchDB.Core.AllDocsOptions)
      .pipe(
        map(result =>
          result.rows
            .filter(row => !!row.doc?.data)
            .map(row => row.doc!.data as T)
        )
      );
  }

  /** Stream events for a scope: emits history first, then live */
  watch<T>(scope: EventScope): Observable<T> {
    const prefix = this.buildPrefix(scope);
    const live$ = this.persistence.changes<DocEnvelope<T>>().pipe(
      filter(c => c.id?.startsWith(prefix + ':')),
      filter(c => !!c.doc?.data),
      map(c => (c.doc as DocEnvelope<T>).data as T)
    );
    return live$;
  }

  /** Optional: live global feed with ids for effects/causation */
  watchAll<T>(): Observable<{ id: string; data: T }> {
    const p = this.prefix + ':';
    return this.persistence.changes<DocEnvelope<T>>().pipe(
      filter(c => c.id?.startsWith(p)),
      filter(c => !!c.doc?.data),
      map(c => ({ id: c.id, data: (c.doc as DocEnvelope<T>).data as T }))
    );
  }

  /**
   * Watch events for a specific scope.
   * Streams the historical events first, followed by live updates.
   */
  watchByScope<T>(scope: EventScope): Observable<T> {
    const prefix = this.buildPrefix(scope);

    // Live event listener for changes under this specific scope
    const live$ = this.persistence.changes<DocEnvelope<T>>().pipe(
      filter((change) => change.id?.startsWith(prefix + ':')), // Filters by the scope prefix
      filter((change) => !!change.doc?.data),
      map((change) => (change.doc as DocEnvelope<T>).data as T)  // Return event data
    );

    // Return the observable that emits changes from the event stream for this scope
    return live$;
  }
}
