import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { EventFeedComponent } from './event-feed.component';
import { EventPersistenceService } from '../../../core/persistence/event-persistence.service';
import { of } from 'rxjs';
import * as EventFeedActions from '../store/event-feed.actions';
import { initialEventFeedState } from '../store/event-feed.state';

describe('EventFeedComponent - NgRx Integration', () => {
  let component: EventFeedComponent;
  let fixture: any;
  let store: MockStore;
  let mockEventPersistenceService: jasmine.SpyObj<EventPersistenceService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EventPersistenceService', ['getAll', 'watch']);

    await TestBed.configureTestingModule({
      imports: [EventFeedComponent],
      providers: [
        provideMockStore({ initialState: { eventFeed: initialEventFeedState } }),
        { provide: EventPersistenceService, useValue: spy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockEventPersistenceService = TestBed.inject(EventPersistenceService) as jasmine.SpyObj<EventPersistenceService>;
    mockEventPersistenceService.getAll.and.returnValue(of([]));
    mockEventPersistenceService.watch.and.returnValue(of({}));
    
    fixture = TestBed.createComponent(EventFeedComponent);
    component = fixture.componentInstance;
    component.scope = { domain: 'test', subdomain: 'test', context: 'test', subcontext: 'test' };
  });

  it('should create and dispatch NgRx actions on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    
    component.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      EventFeedActions.setScope({ scope: component.scope })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      EventFeedActions.loadEvents({ scope: component.scope })
    );
  });

  it('should dispatch addEvent action when addDemo is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    
    component.addDemo();
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Event Feed] Add Event',
        scope: component.scope,
        eventType: 'DEMO_PING',
        options: { source: 'ui' }
      })
    );
  });
});