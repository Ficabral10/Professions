import { TestBed } from '@angular/core/testing';

import { MemoryCardGameService } from './memory-card-game.service';

describe('MemoryCardGameService', () => {
  let service: MemoryCardGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryCardGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
