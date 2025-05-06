import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStatistiqueComponent } from './stock-statistique.component';

describe('StockStatistiqueComponent', () => {
  let component: StockStatistiqueComponent;
  let fixture: ComponentFixture<StockStatistiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockStatistiqueComponent]
    });
    fixture = TestBed.createComponent(StockStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
