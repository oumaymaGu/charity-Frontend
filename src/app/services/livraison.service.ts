import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Livraisons } from 'src/app/front_end/pages/models/livraison';



@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8089/livraison';
  private baseUrl = 'http://localhost:8089/livraison';
  private livraisonAddedSource = new Subject<Livraisons>();
  private stompClient: any;

  livraisonAdded$ = this.livraisonAddedSource.asObservable();

  constructor(private http: HttpClient) {
   
  }

 
  getAllLivraisons(): Observable<Livraisons[]> {
    return this.http.get<Livraisons[]>(`${this.apiUrl}/retrieve-all-Livraison`);
  }

  addLivraison(livraison: Livraisons): Observable<Livraisons> {
    return this.http.post<Livraisons>(`${this.apiUrl}/add-livraison`, livraison).pipe(
      tap((newLivraison: Livraisons) => this.livraisonAddedSource.next(newLivraison))
    );
  }

  modifyLivraison(livraison: Livraisons): Observable<Livraisons> {
    return this.http.put<Livraisons>(`${this.apiUrl}/modifyLivraison`, livraison);
  }

  deleteLivraison(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-livraison/${id}`);
  }

  getLivraisonById(id: number): Observable<Livraisons> {
    return this.http.get<Livraisons>(`${this.apiUrl}/get-livraison/${id}`);
  }

  updateLivraisonStatus(livraison: Livraisons): Observable<Livraisons> {
    return this.http.put<Livraisons>(`${this.baseUrl}/modifyLivraison`, livraison);
  }

  downloadRecu(idLivr: number): Observable<Blob> {
    return this.http.get(`http://localhost:8089/pdf/recu/${idLivr}`, {
      responseType: 'blob'
    });
  }
}