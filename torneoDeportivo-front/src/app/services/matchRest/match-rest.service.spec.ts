import { TestBed } from '@angular/core/testing';

import { MatchRestService } from './match-rest.service';

describe('MatchRestService', () => {
  let service: MatchRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
