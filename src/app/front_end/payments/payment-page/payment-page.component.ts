import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Payment {

  idPmt: number;
  datePaiment: string;
  methodePaiment: string;
  statutPaiment: string;
  montant: number;
  devise: string;
  ribBancaire: string;
}

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
formatMontant(arg0: number,arg1: string) {
throw new Error('Method not implemented.');
}
  payments: Payment[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const url = 'http://localhost:8089/charity/paiment/retrieve-all-Paiment';
    this.http.get<Payment[]>(url).subscribe({
      next: (data) => {
        console.log("📢 Paiements reçus :", data);
        this.payments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des paiements', error);
        this.error = 'Erreur lors du chargement des paiements';
        this.loading = false;
      }
    });
  }

  viewDetails(id: number): void {
    if (id === undefined || id === null) {
      console.error("❌ Erreur : ID du paiement est undefined !");
      return;
    }
    this.router.navigate(['/payment-details', id]);
  }

  deletePayment(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce paiement ?')) {
      const url = `http://localhost:8089/charity/paiment/remove-Paiment/${id}`;
      this.http.delete(url).subscribe({
        next: () => {
          this.payments = this.payments.filter(payment => payment.idPmt !== id);
          alert('✅ Paiement supprimé avec succès');
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

      
      
      }   
  

