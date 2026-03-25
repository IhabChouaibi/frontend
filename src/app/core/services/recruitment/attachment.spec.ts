import { TestBed } from '@angular/core/testing';

import { AttachmentService } from './attachment';

describe('Attachment', () => {
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
