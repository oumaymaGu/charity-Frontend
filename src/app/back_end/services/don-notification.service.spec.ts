import { TestBed } from '@angular/core/testing';

import { DonNotificationService } from './don-notification.service';

describe('DonNotificationService', () => {
  let service: DonNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
