import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Presence } from './presence';

describe('Presence', () => {
  let component: Presence;
  let fixture: ComponentFixture<Presence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Presence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Presence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
