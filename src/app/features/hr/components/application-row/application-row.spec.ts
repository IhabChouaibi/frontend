import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRow } from './application-row';

describe('ApplicationRow', () => {
  let component: ApplicationRow;
  let fixture: ComponentFixture<ApplicationRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
