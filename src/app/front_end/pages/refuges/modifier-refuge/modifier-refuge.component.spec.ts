import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRefugeComponent } from './modifier-refuge.component';

describe('ModifierRefugeComponent', () => {
  let component: ModifierRefugeComponent;
  let fixture: ComponentFixture<ModifierRefugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierRefugeComponent]
    });
    fixture = TestBed.createComponent(ModifierRefugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
