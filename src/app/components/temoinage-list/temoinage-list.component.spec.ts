import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemoinageListComponent } from './temoinage-list.component';

describe('TemoinageListComponent', () => {
  let component: TemoinageListComponent;
  let fixture: ComponentFixture<TemoinageListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemoinageListComponent]
    });
    fixture = TestBed.createComponent(TemoinageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
