import { TestBed } from '@angular/core/testing';

import { SolveService } from './solve.service';

describe('SolveService', () => {
  let service: SolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
