import { TestBed } from '@angular/core/testing';

import { ReactionTimeService } from './reaction-time.service';

describe('ReactionTimeService', () => {
  let service: ReactionTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactionTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
