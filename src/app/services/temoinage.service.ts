import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Temoinage } from 'src/app/front_end/pages/models/temoinage';

@Injectable({
  providedIn: 'root'
})
export class TemoinageService {
  private apiUrl = 'http://localhost:8089/temoinage'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) { }
  

  getTemoinages(): Observable<Temoinage[]> {
    return this.http.get<Temoinage[]>(`${this.apiUrl}/retrieve-all-temoinages`);
  }
  addTemoinage(temoinage: Temoinage): Observable<Temoinage> {
    const formData = new FormData();
    formData.append('nom', temoinage.nom || 'Test Nom');
    formData.append('description', temoinage.description || 'Test Description');
    formData.append('statut', temoinage.statut || 'ACCEPTE');

    return this.http.post<Temoinage>(`${this.apiUrl}/temoinages`, formData);
  }

  modifyTemoinage(temoinage: Temoinage): Observable<Temoinage> {
    return this.http.put<Temoinage>(`${this.apiUrl}/modify-temoinage`, temoinage);
  }

  deleteTemoinage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-temoinage/${id}`);
  }

  getTemoinageById(id: number): Observable<Temoinage> {
    return this.http.get<Temoinage>(`${this.apiUrl}/get-temoinage/${id}`);
  }

 
  updateTemoinage(temoinage: Temoinage): Observable<Temoinage> {
    return this.http.put<Temoinage>('http://localhost:8089/temoinage/temoinage/update-temoinage', temoinage);
  }
  
  getTemoinagesPublic(): Observable<Temoinage[]> {
    return this.http.get<Temoinage[]>('http://localhost:8089/temoinage/public');
  }
  getTemoinagesAcceptes(): Observable<Temoinage[]> {
    return this.http.get<Temoinage[]>(`${this.apiUrl}/public`);
  }
  
  
}
