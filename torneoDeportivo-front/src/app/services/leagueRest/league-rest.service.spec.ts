import { TestBed } from '@angular/core/testing';

import { LeagueRestService } from './league-rest.service';

describe('LeagueRestService', () => {
  let service: LeagueRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
