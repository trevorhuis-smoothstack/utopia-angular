import { TestBed } from '@angular/core/testing';

import { CounterValidationService } from './counter-validation.service';

describe('CounterValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CounterValidationService = TestBed.get(CounterValidationService);
    expect(service).toBeTruthy();
  });
});
