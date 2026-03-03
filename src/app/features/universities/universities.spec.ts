import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Universities } from './universities';

describe('Universities', () => {
  let component: Universities;
  let fixture: ComponentFixture<Universities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Universities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Universities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
