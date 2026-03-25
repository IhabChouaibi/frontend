import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewModal } from './interview-modal';

describe('InterviewModal', () => {
  let component: InterviewModal;
  let fixture: ComponentFixture<InterviewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterviewModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
