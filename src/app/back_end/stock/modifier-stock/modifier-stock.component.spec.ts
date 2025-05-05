import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierStockComponent } from './modifier-stock.component';

describe('ModifierStockComponent', () => {
  let component: ModifierStockComponent;
  let fixture: ComponentFixture<ModifierStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierStockComponent]
    });
    fixture = TestBed.createComponent(ModifierStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
