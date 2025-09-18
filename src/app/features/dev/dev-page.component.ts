import { Component } from '@angular/core';
import { EventFeedComponent } from './event-feed.component/event-feed.component';

@Component({
  selector: 'app-dev-page',
  standalone: true,
  imports: [EventFeedComponent],
  template: `
    <app-event-feed [scope]="{ domain: 'picking', subdomain: 'picktask', context: 'pickworkId_123', subcontext: 'attempt2' }"></app-event-feed>
  `
})
export class DevPageComponent {}