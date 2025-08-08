import { Component, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventFeedComponent } from './features/dev/event-feed.component/event-feed.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventFeedComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Application title displayed in the header */
  protected readonly title: Signal<string> = signal('ng-skein');
}
