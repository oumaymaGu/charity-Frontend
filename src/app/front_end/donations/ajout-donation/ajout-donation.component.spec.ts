import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutDonationComponent } from './ajout-donation.component';

describe('AjoutDonationComponent', () => {
  let component: AjoutDonationComponent;
  let fixture: ComponentFixture<AjoutDonationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutDonationComponent]
    });
    fixture = TestBed.createComponent(AjoutDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
