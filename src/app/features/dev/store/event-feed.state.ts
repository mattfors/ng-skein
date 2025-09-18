import { SkeinEvent } from '../../../core/model/skein-event.model';
import { EventScope } from '../../../core/model/event-scope.model';

export interface EventFeedState {
  events: SkeinEvent[];
  loading: boolean;
  error: any;
  scope: EventScope | null;
  // Custom state for reducers (ping count, elapsed time, etc.)
  pingCount: number;
  pingTime: {
    min: Date | null;
    max: Date | null;
    elapsedTime: number;
  };
}

export const initialEventFeedState: EventFeedState = {
  events: [],
  loading: false,
  error: null,
  scope: null,
  pingCount: 0,
  pingTime: {
    min: null,
    max: null,
    elapsedTime: 0
  }
};