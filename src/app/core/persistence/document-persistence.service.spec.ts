import { TestBed } from '@angular/core/testing';

import { DocumentPersistenceService } from './document-persistence.service';

describe('DocumentPersistenceService', () => {
  let service: DocumentPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
