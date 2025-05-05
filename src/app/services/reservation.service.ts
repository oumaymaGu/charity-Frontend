// reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8089/api/reservations'; // Base API URL

  constructor(private http: HttpClient) {}

  // Add reservation using username
  ajouterReservation(logementId: number, username: string, message?: string): Observable<any> {
    const body = {
      logementId: logementId,
      username: username,
      message: message || ''
    };
    
    return this.http.post(`${this.apiUrl}`, body);
  }
  
  // Get all reservations
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  
  // Get reservations by user
  getReservationsByUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`);
  }
  
  // Change reservation status
  changerStatut(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { statut });
  }
  
  // Delete reservation
  supprimerReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}