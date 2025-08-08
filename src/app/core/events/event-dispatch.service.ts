import { Injectable } from '@angular/core';
import { EventMeta } from '../model/event-meta.model';
import { DispatchOptions } from '../model/event-dispatch-options.mode';
import { SkeinEvent } from '../model/skein-event.model';
import { Observable } from 'rxjs';
import { EventScope } from '../model/event-scope.model';
import { EventPersistenceService } from '../persistence/event-persistence.service';

@Injectable({
  providedIn: 'root'
})
export class EventDispatchService {
  constructor(private events: EventPersistenceService) {}

  /**
   * Dispatch by pieces: type + payload + options.
   */
  dispatch<TType extends string, TPayload = unknown>(
    scope: EventScope,
    type: TType,
    payload?: TPayload,
    opts: DispatchOptions = {}
  ): Observable<PouchDB.Core.Response> {
    const meta = this.buildMeta(undefined, opts);
    const event: SkeinEvent<TType, TPayload> = { type, payload, meta };
    return this.events.add(scope, event);
  }

  /**
   * Dispatch a prebuilt event and merge defaults into meta if needed.
   */
  dispatchEvent<TType extends string, TPayload = unknown>(
    scope: EventScope,
    event: SkeinEvent<TType, TPayload>,
    opts: DispatchOptions = {}
  ): Observable<PouchDB.Core.Response> {
    const meta = this.buildMeta(event.meta, opts);
    const merged: SkeinEvent<TType, TPayload> = { ...event, meta };
    return this.events.add(scope, merged);
  }

  /** Generate a new correlation id for a session or thread of related events. */
  startCorrelation(): string {
    // Use crypto.randomUUID when available
    const rnd = (globalThis.crypto?.randomUUID?.() as string | undefined);
    return rnd ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // -------- internals --------

  private buildMeta(existing: EventMeta | undefined, opts: DispatchOptions): EventMeta {
    // Prefer explicit, then inherit from cause, then from existing, then new
    const inheritedCorr =
      opts.cause?.correlationId ?? existing?.correlationId;

    return {
      ts: opts.ts ?? existing?.ts ?? Date.now(),
      actorId: opts.actorId ?? existing?.actorId,
      source: opts.source ?? existing?.source ?? 'ui',
      correlationId: opts.correlationId ?? inheritedCorr ?? this.startCorrelation(),
      causationId: opts.cause?.id ?? existing?.causationId
    };
  }
}
