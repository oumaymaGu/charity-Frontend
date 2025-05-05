import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalTestComponent } from './psychological-test.component';

describe('PsychologicalTestComponent', () => {
  let component: PsychologicalTestComponent;
  let fixture: ComponentFixture<PsychologicalTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PsychologicalTestComponent]
    });
    fixture = TestBed.createComponent(PsychologicalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
