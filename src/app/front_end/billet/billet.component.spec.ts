import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilletComponent } from './billet.component';

describe('BilletComponent', () => {
  let component: BilletComponent;
  let fixture: ComponentFixture<BilletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BilletComponent]
    });
    fixture = TestBed.createComponent(BilletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
