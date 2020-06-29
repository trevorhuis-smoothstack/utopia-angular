import { TestBed } from '@angular/core/testing';

import { AgentUtopiaService } from './agent-utopia.service';

describe('ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentUtopiaService = TestBed.get(AgentUtopiaService);
    expect(service).toBeTruthy();
  });
});
