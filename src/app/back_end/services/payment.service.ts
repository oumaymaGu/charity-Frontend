import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Payment } from 'src/app/front_end/pages/models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = 'http://localhost:8089/payments';  // URL du back-end

  constructor(private http: HttpClient) {}

  // Récupérer tous les paiements
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}/all`).pipe(
      catchError(err => {
        // Gérer les erreurs ici
        console.error('Erreur HTTP lors de la récupération de tous les paiements:', err);
        return throwError(() => new Error('Erreur lors de la récupération de tous les paiements'));
      })
    );
  }

  // Récupérer les paiements par ID de don
  getPaymentsByDonId(donId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}/don/${donId}`).pipe(
      catchError(err => {
        console.error('Erreur HTTP:', err);
        return throwError(() => new Error('Erreur lors de la récupération des paiements'));
      })
    );
  }

  // Ajouter un paiement
  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.url}/add`, payment).pipe(
      catchError(err => {
        console.error('Erreur HTTP lors de l\'ajout du paiement:', err);
        return throwError(() => new Error('Erreur lors de l\'ajout du paiement'));
      })
    );
  }

  // Modifier un paiement
  modifyPayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.url}/modifyPayment/${id}`, payment).pipe(
      catchError(err => {
        console.error('Erreur HTTP lors de la modification du paiement:', err);
        return throwError(() => new Error('Erreur lors de la modification du paiement'));
      })
    );
  }

  // Supprimer un paiement
  removePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`).pipe(
      catchError(err => {
        console.error('Erreur HTTP lors de la suppression du paiement:', err);
        return throwError(() => new Error('Erreur lors de la suppression du paiement'));
      })
    );
  }
}