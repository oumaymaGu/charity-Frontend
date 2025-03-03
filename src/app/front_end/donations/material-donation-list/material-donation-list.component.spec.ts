import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDonationListComponent } from './material-donation-list.component';

describe('MaterialDonationListComponent', () => {
  let component: MaterialDonationListComponent;
  let fixture: ComponentFixture<MaterialDonationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialDonationListComponent]
    });
    fixture = TestBed.createComponent(MaterialDonationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
