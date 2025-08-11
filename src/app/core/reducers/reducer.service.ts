import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SkeinReducer } from '../model/skein-reducer.model';
import { EventPersistenceService } from '../persistence/event-persistence.service';
import { EventScope } from '../model/event-scope.model';
import { SkeinEvent } from '../model/skein-event.model';

@Injectable({
  providedIn: 'root',
})
export class ReducerService {
  private stateSubject = new BehaviorSubject<any>({});  // Observable for the state
  private reducers = new Map<string, { scope: EventScope; reducer: SkeinReducer<any> }[]>();  // Store reducers by event type and scope
  public state$ = this.stateSubject.asObservable();  // Public state observable

  constructor(private eventPersistence: EventPersistenceService) {}

  /**
   * Register a new reducer for a specific event type and scope
   */
  registerReducer<TState>(eventType: string, reducer: SkeinReducer<TState>, scope: EventScope) {
    if (!this.reducers.has(eventType)) {
      this.reducers.set(eventType, []);
    }
    this.reducers.get(eventType)!.push({ scope, reducer });  // Register the reducer for this event type and scope
    this.listenToScope(scope, eventType);  // Start listening for events on this scope
  }

  /**
   * Listen to events for a specific scope and apply relevant reducers
   */
  private listenToScope(scope: EventScope, eventType: string) {
    // Use the new watchByScope method to listen for events from EventPersistenceService
    this.eventPersistence.watchByScope<SkeinEvent>(scope).subscribe((event) => {
      // Apply the relevant reducers
      const currentState = this.stateSubject.value;
      const relevantReducers = this.reducers.get(eventType) || [];
      let newState = { ...currentState };

      relevantReducers.forEach((entry) => {
        newState = entry.reducer.reduce(newState, event);  // Apply the reducer to modify the state
      });

      // Emit the updated state
      this.stateSubject.next(newState);
    });
  }
}
