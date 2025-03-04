import { TestBed } from '@angular/core/testing';

import { TemoinageService } from './temoinage.service';

describe('TemoinageService', () => {
  let service: TemoinageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemoinageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
