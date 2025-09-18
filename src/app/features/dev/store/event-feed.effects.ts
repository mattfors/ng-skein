import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap } from 'rxjs/operators';
import { EventPersistenceService } from '../../../core/persistence/event-persistence.service';
import { EventDispatchService } from '../../../core/events/event-dispatch.service';
import * as EventFeedActions from './event-feed.actions';
import { SkeinEvent } from '../../../core/model/skein-event.model';

@Injectable()
export class EventFeedEffects {

  private actions$ = inject(Actions);
  private eventPersistenceService = inject(EventPersistenceService);
  private eventDispatchService = inject(EventDispatchService);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventFeedActions.loadEvents),
      exhaustMap(action =>
        this.eventPersistenceService.getAll<SkeinEvent>(action.scope).pipe(
          map(events => EventFeedActions.loadEventsSuccess({ events })),
          catchError(error => of(EventFeedActions.loadEventsFailure({ error })))
        )
      )
    )
  );

  addEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventFeedActions.addEvent),
      exhaustMap(action =>
        this.eventDispatchService.dispatch(
          action.scope,
          action.eventType,
          action.payload,
          action.options || {}
        ).pipe(
          map(() => {
            // Create the event object that was added
            const event: SkeinEvent = {
              type: action.eventType,
              payload: action.payload,
              meta: {
                ts: Date.now(),
                source: action.options?.source || 'ui',
                correlationId: this.eventDispatchService.startCorrelation(),
                actorId: action.options?.actorId,
                causationId: action.options?.causationId
              }
            };
            return EventFeedActions.addEventSuccess({ event });
          }),
          catchError(error => of(EventFeedActions.addEventFailure({ error })))
        )
      )
    )
  );

  watchEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventFeedActions.setScope),
      switchMap(action =>
        this.eventPersistenceService.watch<SkeinEvent>(action.scope).pipe(
          map(event => EventFeedActions.eventReceived({ event })),
          catchError(error => {
            console.error('Error watching events:', error);
            return of();
          })
        )
      )
    )
  );
}