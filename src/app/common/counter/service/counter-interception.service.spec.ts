import { TestBed } from '@angular/core/testing';

import { CounterInterceptionService } from './counter-interception.service';

describe('CounterInterceptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CounterInterceptionService = TestBed.get(CounterInterceptionService);
    expect(service).toBeTruthy();
  });
});
