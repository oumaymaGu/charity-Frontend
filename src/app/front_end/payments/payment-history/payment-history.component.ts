// src/app/front_end/payments/payment-history.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../../pages/models/payment';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  payments: Payment[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  ngOnInit() {
    this.loadPaymentHistory();
  }

  loadPaymentHistory() {
    this.http.get<Payment[]>('http://localhost:8089/payments/all').subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'historique des paiements.';
        this.loading = false;
        console.error('Erreur détaillée:', error);
      }
    });
  }

  returnToDashboard(): void {
    this.router.navigate(['/dash']); // Navigate to the dashboard route
  }
}