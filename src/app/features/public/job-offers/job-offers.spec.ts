import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffers } from './job-offers';

describe('JobOffers', () => {
  let component: JobOffers;
  let fixture: ComponentFixture<JobOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobOffers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOffers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
