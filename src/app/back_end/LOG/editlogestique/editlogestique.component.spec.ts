import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlogestiqueComponent } from './editlogestique.component';

describe('EditlogestiqueComponent', () => {
  let component: EditlogestiqueComponent;
  let fixture: ComponentFixture<EditlogestiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditlogestiqueComponent]
    });
    fixture = TestBed.createComponent(EditlogestiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
