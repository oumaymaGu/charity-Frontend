import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Payment {
  email: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
  cardHolderName: string;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './ajout-payment.component.html',
  styleUrls: ['./ajout-payment.component.css']
})
export class AddPaymentComponent {
  payment: Payment = {
    email: '',
    cardNumber: '',
    expirationMonth: 0,
    expirationYear: 0,
    cvv: '',
    cardHolderName: ''
  };

  errorMessage: string = '';
successMessage: any;

  constructor(private http: HttpClient, private router: Router) {}

  validateForm(): boolean {
    // Validation logic here
    return true;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<Payment>('http://localhost:8089/payments/add', this.payment, httpOptions).subscribe({
      next: (response) => {
        console.log('Paiement ajouté avec succès:', response);
        alert("Paiement ajouté avec succès !");
        this.router.navigate(['/donate']);
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        if (error.error) {
          console.error('Réponse du serveur:', error.error); // Afficher la réponse du serveur
          this.errorMessage = error.error.message || "Erreur lors de l'ajout du paiement.";
        } else {
          this.errorMessage = "Erreur lors de l'ajout du paiement.";
        }
      }
    });
  }
}