import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './don-notification.service'; // Utiliser NotificationService
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let matSnackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    matSnackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ]
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/notifications`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(service).toBeTruthy();
  });
});