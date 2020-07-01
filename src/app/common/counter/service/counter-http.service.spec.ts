import { TestBed } from '@angular/core/testing';

import { CounterHttpService } from './counter-http.service';

describe('CounterHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CounterHttpService = TestBed.get(CounterHttpService);
    expect(service).toBeTruthy();
  });
});
