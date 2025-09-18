import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { EventScope } from '../../../core/model/event-scope.model';
import { SkeinEvent } from '../../../core/model/skein-event.model';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { Store } from '@ngrx/store';
import * as EventFeedActions from '../store/event-feed.actions';
import * as EventFeedSelectors from '../store/event-feed.selectors';

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
export class EventFeedComponent implements OnInit, OnDestroy {
  @Input({ required: true }) scope!: EventScope;

  // Observable streams from NgRx store
  events$!: Observable<SkeinEvent[]>;
  state$!: Observable<any>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  private store = inject(Store);

  ngOnInit(): void {
    // Set up observables from NgRx store
    this.events$ = this.store.select(EventFeedSelectors.selectEvents);
    this.state$ = this.store.select(EventFeedSelectors.selectState);
    this.loading$ = this.store.select(EventFeedSelectors.selectLoading);
    this.error$ = this.store.select(EventFeedSelectors.selectError);

    // Dispatch actions to set scope and start watching events
    this.store.dispatch(EventFeedActions.setScope({ scope: this.scope }));
    this.store.dispatch(EventFeedActions.loadEvents({ scope: this.scope }));
  }

  ngOnDestroy(): void {
    // NgRx effects handle cleanup automatically
  }

  addDemo(): void {
    this.store.dispatch(EventFeedActions.addEvent({
      scope: this.scope,
      eventType: 'DEMO_PING',
      payload: { at: new Date().toISOString() },
      options: { source: 'ui' }
    }));
  }
}
