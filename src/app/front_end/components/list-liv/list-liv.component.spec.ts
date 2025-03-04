import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLivComponent } from './list-liv.component';

describe('ListLivComponent', () => {
  let component: ListLivComponent;
  let fixture: ComponentFixture<ListLivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLivComponent]
    });
    fixture = TestBed.createComponent(ListLivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
