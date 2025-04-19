import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim  } from 'src/app/front_end/pages/models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = 'http://localhost:8089/api/claims'; // remplace avec ton vrai endpoint

  constructor(private http: HttpClient) {}

  sendClaim(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(`${this.apiUrl}`, claim);
  }

  getAllClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}`);
  }

  deleteClaim(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}