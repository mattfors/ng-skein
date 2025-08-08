import { TestBed } from '@angular/core/testing';

import { EventDispatchService } from './event-dispatch.service';

describe('EventDispatchService', () => {
  let service: EventDispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
