import { TestBed } from '@angular/core/testing';

import { DonationRequestService } from './donation-request.service';

describe('DonationRequestService', () => {
  let service: DonationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
