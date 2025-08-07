import { TestBed } from '@angular/core/testing';

import { EventPersistenceService } from './event-persistence.service';

describe('EventPersistenceService', () => {
  let service: EventPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
