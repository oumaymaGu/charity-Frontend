import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsLogestiquesComponent } from './events-logestiques.component';

describe('EventsLogestiquesComponent', () => {
  let component: EventsLogestiquesComponent;
  let fixture: ComponentFixture<EventsLogestiquesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsLogestiquesComponent]
    });
    fixture = TestBed.createComponent(EventsLogestiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
