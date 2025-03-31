import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInscriptionComponent } from './payment-inscription.component';

describe('PaymentInscriptionComponent', () => {
  let component: PaymentInscriptionComponent;
  let fixture: ComponentFixture<PaymentInscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentInscriptionComponent]
    });
    fixture = TestBed.createComponent(PaymentInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
