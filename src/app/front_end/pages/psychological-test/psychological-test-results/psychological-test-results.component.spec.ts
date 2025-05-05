import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalTestResultsComponent } from './psychological-test-results.component';

describe('PsychologicalTestResultsComponent', () => {
  let component: PsychologicalTestResultsComponent;
  let fixture: ComponentFixture<PsychologicalTestResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PsychologicalTestResultsComponent]
    });
    fixture = TestBed.createComponent(PsychologicalTestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
