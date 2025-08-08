import { Component, Input, OnInit } from '@angular/core';
import { EventScope } from '../../../core/model/event-scope.model';
import { SkeinEvent } from '../../../core/model/skein-event.model';
import { Observable, scan } from 'rxjs';
import { EventPersistenceService } from '../../../core/persistence/event-persistence.service';
import { EventDispatchService } from '../../../core/events/event-dispatch.service';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-event-feed',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf
  ],
  templateUrl: './event-feed.component.html',
  styleUrl: './event-feed.component.scss'
})
export class EventFeedComponent implements OnInit {
  @Input({ required: true }) scope!: EventScope;

  // Running list built from history + live stream
  events$!: Observable<SkeinEvent[]>;

  constructor(
    private events: EventPersistenceService,
    private dispatch: EventDispatchService
  ) {}

  ngOnInit(): void {
    this.events$ = this.events.watch<SkeinEvent>(this.scope).pipe(
      scan((acc, e) => [...acc, e], [] as SkeinEvent[])
    );
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
