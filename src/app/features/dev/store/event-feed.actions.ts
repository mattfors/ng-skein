import { createAction, props } from '@ngrx/store';
import { SkeinEvent } from '../../../core/model/skein-event.model';
import { EventScope } from '../../../core/model/event-scope.model';

export const loadEvents = createAction(
  '[Event Feed] Load Events',
  props<{ scope: EventScope }>()
);

export const loadEventsSuccess = createAction(
  '[Event Feed] Load Events Success',
  props<{ events: SkeinEvent[] }>()
);

export const loadEventsFailure = createAction(
  '[Event Feed] Load Events Failure',
  props<{ error: any }>()
);

export const addEvent = createAction(
  '[Event Feed] Add Event',
  props<{ scope: EventScope; eventType: string; payload?: any; options?: any }>()
);

export const addEventSuccess = createAction(
  '[Event Feed] Add Event Success',
  props<{ event: SkeinEvent }>()
);

export const addEventFailure = createAction(
  '[Event Feed] Add Event Failure',
  props<{ error: any }>()
);

export const eventReceived = createAction(
  '[Event Feed] Event Received',
  props<{ event: SkeinEvent }>()
);

export const setScope = createAction(
  '[Event Feed] Set Scope',
  props<{ scope: EventScope }>()
);