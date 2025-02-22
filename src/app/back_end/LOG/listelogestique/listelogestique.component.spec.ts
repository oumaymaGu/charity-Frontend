import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListelogestiqueComponent } from './listelogestique.component';

describe('ListelogestiqueComponent', () => {
  let component: ListelogestiqueComponent;
  let fixture: ComponentFixture<ListelogestiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListelogestiqueComponent]
    });
    fixture = TestBed.createComponent(ListelogestiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
