import { SkeinEvent } from '../model/skein-event.model';
import { SkeinReducer } from './skein-reducer.model';  // Event model

export class ElapsedTimeReducer<TState> implements SkeinReducer<TState> {
  constructor(
    public dateField: string,  // The field in the event payload that contains the date
    public timeProperty: keyof TState   // The property in the state to store min, max, and elapsed time
  ) {
    this.initialState = this.initializeState();
  }

  // Initialize state safely with the timeProperty (min, max, and elapsedTime)
  private initializeState(): TState {
    return {
      [this.timeProperty]: {
        min: new Date(0),  // Very old date (epoch start)
        max: new Date(0),  // Very old date (epoch start)
        elapsedTime: 0,  // Default elapsed time
      },
    } as TState;
  }

  // The reduce method will compare the event's date (from the dynamic dateField) and update min, max, and elapsed time
  reduce(state: TState, event: SkeinEvent): TState {
    const eventDateValue = event.payload?.[this.dateField];

    // Ensure eventDateValue is a valid value before using it in Date
    const eventTime = this.isValidDate(eventDateValue)
      ? new Date(eventDateValue as string | number | Date)
      : new Date(Date.now()); // Fallback to current date if not valid

    // Initialize state if it's the first event
    if (!state[this.timeProperty]) {
      return {
        ...state,
        [this.timeProperty]: {
          min: eventTime,
          max: eventTime,
          elapsedTime: 0,  // Initial elapsed time is 0
        },
      };
    }

    const currentMin = (state[this.timeProperty] as any).min;
    const currentMax = (state[this.timeProperty] as any).max;

    // Update min and max time if necessary
    const updatedMin = eventTime < currentMin ? eventTime : currentMin;
    const updatedMax = eventTime > currentMax ? eventTime : currentMax;

    // Calculate elapsed time between min and max
    const elapsedTime = updatedMax.getTime() - updatedMin.getTime();  // In milliseconds

    return {
      ...state,
      [this.timeProperty]: {
        min: updatedMin,
        max: updatedMax,
        elapsedTime: elapsedTime,  // Store elapsed time in the state
      },
    };
  }

  // Type guard to check if the value is a valid date (string, number, or Date)
  private isValidDate(value: any): boolean {
    return value instanceof Date || !isNaN(Date.parse(value));
  }

  // Default initial state for time (min, max, and elapsedTime)
  initialState: TState;
}
