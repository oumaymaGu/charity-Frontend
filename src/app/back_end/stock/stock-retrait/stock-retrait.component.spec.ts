import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRetraitComponent } from './stock-retrait.component';

describe('StockRetraitComponent', () => {
  let component: StockRetraitComponent;
  let fixture: ComponentFixture<StockRetraitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockRetraitComponent]
    });
    fixture = TestBed.createComponent(StockRetraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
