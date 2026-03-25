import { TestBed } from '@angular/core/testing';

import { LeaveValidationService } from './leave-validation-service';

describe('LeaveValidationService', () => {
  let service: LeaveValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
