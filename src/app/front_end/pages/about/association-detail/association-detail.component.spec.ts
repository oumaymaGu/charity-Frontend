import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationDetailComponent } from './association-detail.component';

describe('AssociationDetailComponent', () => {
  let component: AssociationDetailComponent;
  let fixture: ComponentFixture<AssociationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociationDetailComponent]
    });
    fixture = TestBed.createComponent(AssociationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
