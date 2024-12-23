import { TestBed } from '@angular/core/testing';

import { SpotTheDifferenceService } from './spot-the-difference.service';

describe('SpotTheDifferenceService', () => {
  let service: SpotTheDifferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotTheDifferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
