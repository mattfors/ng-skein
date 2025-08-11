import { SkeinEvent } from './skein-event.model';


/**
 * An Effect listens for events and performs side effects (like logging or telemetry),
 * but does not modify the state.
 */
export interface SkeinEffect {
  eventType: string;  // Event type this effect listens for
  execute(event: SkeinEvent): void;  // The effect function that performs the side effect
}
