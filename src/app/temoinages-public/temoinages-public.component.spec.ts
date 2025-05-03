import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemoinagesPublicComponent } from './temoinages-public.component';

describe('TemoinagesPublicComponent', () => {
  let component: TemoinagesPublicComponent;
  let fixture: ComponentFixture<TemoinagesPublicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemoinagesPublicComponent]
    });
    fixture = TestBed.createComponent(TemoinagesPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
