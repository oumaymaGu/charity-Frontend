import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutLogistiqueComponent } from './ajoutlogestique.component';

describe('AjoutlogestiqueComponent', () => {
  let component: AjoutLogistiqueComponent;
  let fixture: ComponentFixture<AjoutLogistiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutLogistiqueComponent]
    });
    fixture = TestBed.createComponent(AjoutLogistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
