import { TestBed } from '@angular/core/testing';

import { JobOfferService } from './job-offer';

describe('JobOffer', () => {
  let service: JobOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
