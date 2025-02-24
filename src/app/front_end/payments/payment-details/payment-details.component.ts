import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Interface pour un paiement
interface Payment {
  id: number;
  datePaiment: string;
  methodePaiment: string;
  statutPaiment: string;
  montant: number;
  devise: string;
  ribBancaire: string;
}

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  payment: Payment | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadPaymentDetails(id);
    } else {
      alert('Erreur: ID du paiement est invalide');
    }
  }

  loadPaymentDetails(id: number): void {
    const url = `http://localhost:8089/charity/paiment/get-Paiment/${id}`;
    this.http.get<Payment>(url).subscribe({
      next: (data) => {
        this.payment = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails du paiement', error);
        alert('Erreur lors du chargement des détails');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/payment-page']);
  }
}
