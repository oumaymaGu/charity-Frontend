import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorContactComponent } from './donor-contact.component';

describe('DonorContactComponent', () => {
  let component: DonorContactComponent;
  let fixture: ComponentFixture<DonorContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonorContactComponent]
    });
    fixture = TestBed.createComponent(DonorContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
