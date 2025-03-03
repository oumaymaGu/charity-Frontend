import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRefugeComponent } from './last-refuge.component';

describe('LastRefugeComponent', () => {
  let component: LastRefugeComponent;
  let fixture: ComponentFixture<LastRefugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastRefugeComponent]
    });
    fixture = TestBed.createComponent(LastRefugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
