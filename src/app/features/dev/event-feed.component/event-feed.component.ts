import { Component, Input, OnInit } from '@angular/core';
import { EventScope } from '../../../core/model/event-scope.model';
import { SkeinEvent } from '../../../core/model/skein-event.model';
import { Observable, scan } from 'rxjs';
import { EventPersistenceService } from '../../../core/persistence/event-persistence.service';
import { EventDispatchService } from '../../../core/events/event-dispatch.service';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { ReducerService } from '../../../core/reducers/reducer.service';
import { SkeinFnReducer } from '../../../core/reducers/skein-fn-reducer.model';
import { ElapsedTimeReducer } from '../../../core/reducers/elapsed-time.reducer';

@Component({
  selector: 'app-event-feed',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    JsonPipe
  ],
  templateUrl: './event-feed.component.html',
  styleUrl: './event-feed.component.scss'
})
export class EventFeedComponent implements OnInit {
  @Input({ required: true }) scope!: EventScope;

  // Running list built from history + live stream
  events$!: Observable<SkeinEvent[]>;
  state$: Observable<any>;

  constructor(
    private events: EventPersistenceService,
    private dispatch: EventDispatchService,
    private reducerService: ReducerService
  ) {
    this.state$ = this.reducerService.state$;
  }

  ngOnInit(): void {
    this.events$ = this.events.watch<SkeinEvent>(this.scope).pipe(
      scan((acc, e) => [...acc, e], [] as SkeinEvent[])
    );

    const pingCounterReducer = new SkeinFnReducer<{ pingCount: number }>(
      'pingCount',  // Property to modify
      (currentValue = 0, event) => currentValue + 1  // Add operation
    );

    const elapsedTimeReducer = new ElapsedTimeReducer<{ at: string; pingTime: { min: Date; max: Date; elapsedTime: number } }>(
      'at',  // The field in the event payload that contains the date (e.g., 'at', 'timestamp')
      'pingTime'  // The property in the state to store the elapsed time
    );


    this.reducerService.registerReducer('DEMO_PING', pingCounterReducer,  this.scope);
    this.reducerService.registerReducer('DEMO_PING', elapsedTimeReducer,  this.scope);


  }

  addDemo(): void {
    this.dispatch.dispatch(
      this.scope,
      'DEMO_PING',
      { at: new Date().toISOString() },
      { source: 'ui' }
    ).subscribe();
  }
}
