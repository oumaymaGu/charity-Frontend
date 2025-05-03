import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingupuserComponent } from './singupuser.component';

describe('SingupuserComponent', () => {
  let component: SingupuserComponent;
  let fixture: ComponentFixture<SingupuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingupuserComponent]
    });
    fixture = TestBed.createComponent(SingupuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
