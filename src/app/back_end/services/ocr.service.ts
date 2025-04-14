import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';

export interface MedicationInfo {
  productCode: any;
  medicationName: string;
  expirationDate: string;
  lotNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private apiUrl = 'http://localhost:8089/api/ocr/scan-medication';

  constructor(private http: HttpClient) { }

  scanMedication(imageFile: File): Observable<MedicationInfo> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.http.post<MedicationInfo>(this.apiUrl, formData).pipe(
      timeout(60000),
      map(response => {
        this.validateExpirationDate(response.expirationDate);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private validateExpirationDate(expirationDate: string): void {
    if (!expirationDate) {
      throw new Error('La date d\'expiration est requise');
    }

    const currentYear = new Date().getFullYear();
    const expYear = new Date(expirationDate).getFullYear();
    
    if (expYear < currentYear + 1) {
      throw new Error(`La date d'expiration doit être au moins en ${currentYear + 1}`);
    }
  }

  private handleError(error: HttpErrorResponse | Error) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error instanceof Error) {
      // Erreur de validation
      errorMessage = error.message;
    } else if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 0) {
        errorMessage = 'Connexion au serveur impossible';
      } else if (error.status === 413) {
        errorMessage = 'Fichier trop volumineux (max 5MB)';
      } else if (error.status === 400) {
        errorMessage = error.error || 'Format d\'image non supporté';
      } else {
        errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(errorMessage);
  }
}