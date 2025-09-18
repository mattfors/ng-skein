import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventFeedState } from './event-feed.state';

export const selectEventFeedState = createFeatureSelector<EventFeedState>('eventFeed');

export const selectEvents = createSelector(
  selectEventFeedState,
  (state) => state.events
);

export const selectLoading = createSelector(
  selectEventFeedState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectEventFeedState,
  (state) => state.error
);

export const selectScope = createSelector(
  selectEventFeedState,
  (state) => state.scope
);

export const selectPingCount = createSelector(
  selectEventFeedState,
  (state) => state.pingCount
);

export const selectPingTime = createSelector(
  selectEventFeedState,
  (state) => state.pingTime
);

export const selectState = createSelector(
  selectEventFeedState,
  (state) => ({
    pingCount: state.pingCount,
    pingTime: state.pingTime
  })
);