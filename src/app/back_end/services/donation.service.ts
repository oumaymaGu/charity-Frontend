import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 import { Donation } from 'src/app/front_end/pages/models/donation';



 @Injectable({
  providedIn: 'root'
})
export class DonationService {
  
url = 'http://localhost:8089/charity/dons';
  constructor(private http: HttpClient) {}

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.url}/all`);
  }

  getDonationById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.url}/${id}`);
  }

  addDonation(donation: Donation): Observable<Donation> {
    return this.http.post<Donation>(`${this.url}/add`, donation);
  }

  updateDonation(id: number, donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(`${this.url}/update/${id}`, donation);
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}