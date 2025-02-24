import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/front_end/pages/models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = 'http://localhost:8089/charity/paiment';

  constructor(private http: HttpClient) {}

  
  getPaiment(): Observable<Payment[]> {
      return this.http.get<Payment[]>(`${this.url}/retrieve-all-Paiment`);
    }
  
    getPaimentById(id: number): Observable<Payment> {
      return this.http.get<Payment>(`${this.url}/get-Paiment/${id}`);
    }
  
    addPaiment(payment: Payment): Observable<Payment> {
      return this.http.post<Payment>(`${this.url}/add-Paiment`, payment);
    }
  
    modifyPaiment(id: number, payment: Payment): Observable<Payment> {
      return this.http.put<Payment>(`${this.url}/modifyPaiment/${id}`, payment);
    }
  
    removePaiment(id: number): Observable<void> {
      return this.http.delete<void>(`${this.url}/remove-Paiment/${id}`);
    }
  }
  