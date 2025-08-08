import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventFeedComponent } from './features/dev/event-feed.component/event-feed.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventFeedComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-skein');
}
