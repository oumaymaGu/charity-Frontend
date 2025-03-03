import { TestBed } from '@angular/core/testing';

import { LogestiqueServiceService } from './logestique-service.service';

describe('LogestiqueServiceService', () => {
  let service: LogestiqueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogestiqueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
