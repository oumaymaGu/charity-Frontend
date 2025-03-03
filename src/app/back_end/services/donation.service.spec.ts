import { TestBed } from '@angular/core/testing';

import { DonService } from './donation.service';

describe('DonationService', () => {
  let service: DonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
