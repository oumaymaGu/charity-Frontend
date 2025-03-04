import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLivComponent } from './edit-liv.component';

describe('EditLivComponent', () => {
  let component: EditLivComponent;
  let fixture: ComponentFixture<EditLivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLivComponent]
    });
    fixture = TestBed.createComponent(EditLivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
