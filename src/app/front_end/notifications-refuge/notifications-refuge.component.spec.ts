import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsRefugeComponent } from './notifications-refuge.component';

describe('NotificationsRefugeComponent', () => {
  let component: NotificationsRefugeComponent;
  let fixture: ComponentFixture<NotificationsRefugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsRefugeComponent]
    });
    fixture = TestBed.createComponent(NotificationsRefugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
