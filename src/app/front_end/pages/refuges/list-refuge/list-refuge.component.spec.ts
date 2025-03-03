import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRefugeComponent } from './list-refuge.component';

describe('ListRefugeComponent', () => {
  let component: ListRefugeComponent;
  let fixture: ComponentFixture<ListRefugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRefugeComponent]
    });
    fixture = TestBed.createComponent(ListRefugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
