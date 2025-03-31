import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDonationComponent } from './material-donation.component';

describe('MaterialDonationComponent', () => {
  let component: MaterialDonationComponent;
  let fixture: ComponentFixture<MaterialDonationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialDonationComponent]
    });
    fixture = TestBed.createComponent(MaterialDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
