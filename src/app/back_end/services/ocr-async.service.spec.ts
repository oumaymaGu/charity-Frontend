import { TestBed } from '@angular/core/testing';

import { OcrAsyncService } from './ocr-async.service';

describe('OcrAsyncService', () => {
  let service: OcrAsyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrAsyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
