import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemoinageComponent } from './add-temoinage.component';

describe('AddTemoinageComponent', () => {
  let component: AddTemoinageComponent;
  let fixture: ComponentFixture<AddTemoinageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTemoinageComponent]
    });
    fixture = TestBed.createComponent(AddTemoinageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
