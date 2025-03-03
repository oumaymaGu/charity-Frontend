import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefugeComponent } from './refuge.component';

describe('RefugeComponent', () => {
  let component: RefugeComponent;
  let fixture: ComponentFixture<RefugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefugeComponent]
    });
    fixture = TestBed.createComponent(RefugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
