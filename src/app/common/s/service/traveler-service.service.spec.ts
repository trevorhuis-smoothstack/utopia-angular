import { TestBed } from '@angular/core/testing';

import { TravelerServiceService } from './traveler-service.service';

describe('TravelerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TravelerServiceService = TestBed.get(TravelerServiceService);
    expect(service).toBeTruthy();
  });
});
