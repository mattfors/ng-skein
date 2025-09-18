import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { eventFeedReducer } from './features/dev/store/event-feed.reducer';
import { EventFeedEffects } from './features/dev/store/event-feed.effects';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      eventFeed: eventFeedReducer
    }),
    provideEffects([EventFeedEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
