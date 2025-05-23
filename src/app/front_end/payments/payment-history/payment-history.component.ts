import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  email: string;
  paymentDate: string;
  paymentIntentId: string;
  showFullId?: boolean; // Pour afficher/masquer l'ID complet
}

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  payments: Payment[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  apiUrl: string = 'http://localhost:8089'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  loadPaymentHistory(): void {
    this.http.get<Payment[]>(`${this.apiUrl}/api/stripe-payments/all`).subscribe({
      next: (data) => {
        // Ajoute la propriété showFullId à chaque paiement
        this.payments = data.map(payment => ({
          ...payment,
          showFullId: false
        }));
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'historique des paiements.';
        this.loading = false;
        console.error('Erreur détaillée:', error);
        if (error.error?.message) {
          this.errorMessage += ` Détails : ${error.error.message}`;
        }
      }
    });
  }

  returnToDashboard(): void {
    this.router.navigate(['/dash']);
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
  }

  toggleVisibility(payment: Payment): void {
    payment.showFullId = !payment.showFullId;
  }
}
