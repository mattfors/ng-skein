import { Component, Input, OnInit } from '@angular/core';
import { EventScope } from '../../../core/model/event-scope.model';
import { SkeinEvent } from '../../../core/model/skein-event.model';
import { Observable, scan } from 'rxjs';
import { EventPersistenceService } from '../../../core/persistence/event-persistence.service';
import { EventDispatchService } from '../../../core/events/event-dispatch.service';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { ReducerService } from '../../../core/reducers/reducer.service';
import { SkeinFunctionReducer } from '../../../core/model/skein-fn-reducer.model';

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

    const pingCounterReducer = new SkeinFunctionReducer<{ pingCount: number }>(
      'pingCount',  // Property to modify
      (currentValue = 0, event) => currentValue + 1  // Add operation
    );

    this.reducerService.registerReducer('DEMO_PING', pingCounterReducer,  this.scope);


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
