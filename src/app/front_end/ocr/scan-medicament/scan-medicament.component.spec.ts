import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanMedicamentComponent } from './scan-medicament.component';

describe('ScanMedicamentComponent', () => {
  let component: ScanMedicamentComponent;
  let fixture: ComponentFixture<ScanMedicamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScanMedicamentComponent]
    });
    fixture = TestBed.createComponent(ScanMedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
