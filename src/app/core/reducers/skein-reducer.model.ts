import { SkeinEvent } from '../model/skein-event.model';

export interface SkeinReducer<TState> {

  // The function that takes current state and event, and returns new state
  reduce: (state: TState, event: SkeinEvent) => TState;

  // Optional: A method to initialize the state if needed (in case you have default values)
  initialState?: TState;
}
