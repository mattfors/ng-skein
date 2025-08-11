import { SkeinReducer } from './skein-reducer.model';
import { SkeinEvent } from './skein-event.model';

export class SkeinFunctionReducer<TState> implements SkeinReducer<TState> {
  propertyName: keyof TState;
  operation: (currentValue: any, event: SkeinEvent) => any;

  constructor(
    propertyName: keyof TState,
    operation: (currentValue: any, event: SkeinEvent) => any
  ) {
    this.propertyName = propertyName;
    this.operation = operation;
  }

  // The reduce method applies the operation to the specified state property
  reduce(state: TState, event: SkeinEvent): TState {
    // Apply the operation to the property specified
    return {
      ...state,
      [this.propertyName]: this.operation(state[this.propertyName], event), // Modify state based on event
    };
  }

  // Optionally define the initial state for the property
  // @ts-ignore
  initialState: TState = { [this.propertyName]: 0 } as TState; // Default initial state
}
