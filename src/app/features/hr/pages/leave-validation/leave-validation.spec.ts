import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveValidation } from './leave-validation';

describe('LeaveValidation', () => {
  let component: LeaveValidation;
  let fixture: ComponentFixture<LeaveValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
