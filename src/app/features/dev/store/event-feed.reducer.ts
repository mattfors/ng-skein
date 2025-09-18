import { createReducer, on } from '@ngrx/store';
import { EventFeedState, initialEventFeedState } from './event-feed.state';
import * as EventFeedActions from './event-feed.actions';

export const eventFeedReducer = createReducer(
  initialEventFeedState,
  
  on(EventFeedActions.setScope, (state, { scope }) => ({
    ...state,
    scope
  })),
  
  on(EventFeedActions.loadEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EventFeedActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    loading: false,
    error: null
  })),
  
  on(EventFeedActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(EventFeedActions.addEvent, (state) => ({
    ...state,
    loading: true
  })),
  
  on(EventFeedActions.addEventSuccess, (state, { event }) => ({
    ...state,
    events: [...state.events, event],
    loading: false,
    error: null,
    // Apply custom reducer logic for DEMO_PING events
    ...(event.type === 'DEMO_PING' ? {
      pingCount: state.pingCount + 1,
      pingTime: calculateElapsedTime(state.pingTime, event)
    } : {})
  })),
  
  on(EventFeedActions.addEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(EventFeedActions.eventReceived, (state, { event }) => ({
    ...state,
    events: [...state.events, event],
    // Apply custom reducer logic for DEMO_PING events
    ...(event.type === 'DEMO_PING' ? {
      pingCount: state.pingCount + 1,
      pingTime: calculateElapsedTime(state.pingTime, event)
    } : {})
  }))
);

// Helper function to calculate elapsed time (replicating ElapsedTimeReducer logic)
function calculateElapsedTime(currentPingTime: EventFeedState['pingTime'], event: any) {
  if (event.payload?.at) {
    const eventDate = new Date(event.payload.at);
    
    if (!currentPingTime.min || eventDate < currentPingTime.min) {
      const newMin = eventDate;
      const newMax = currentPingTime.max || eventDate;
      return {
        min: newMin,
        max: newMax,
        elapsedTime: newMax.getTime() - newMin.getTime()
      };
    }
    
    if (!currentPingTime.max || eventDate > currentPingTime.max) {
      const newMax = eventDate;
      const newMin = currentPingTime.min;
      return {
        min: newMin,
        max: newMax,
        elapsedTime: newMax.getTime() - newMin.getTime()
      };
    }
  }
  
  return currentPingTime;
}