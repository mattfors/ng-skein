import { TestBed } from '@angular/core/testing';

import { ReducerService } from './reducer.service';

describe('ReducerService', () => {
  let service: ReducerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReducerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
