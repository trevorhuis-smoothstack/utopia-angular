import { TestBed } from '@angular/core/testing';

import { CounterDataService } from './counter-data.service';

describe('CounterDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CounterDataService = TestBed.get(CounterDataService);
    expect(service).toBeTruthy();
  });
});
