import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceComponent } from './log.component';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceComponent]
    });
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
