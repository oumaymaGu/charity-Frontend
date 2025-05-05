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

interface Donation {
  typeDon: string;
  idDon: number;
  photoUrl: string;
  donorContact: string;
  dateDon: string;
  donationFrequency: string;
  amount: number;
  heure: string;
  description?: string;
  phone?: string;
  email?: string;
  donorName?: string;
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

  donation: Donation;
  showAmountForm: boolean = false;
  selectedAmount: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
f: any;

  constructor(private http: HttpClient, private router: Router) {
    // Retrieve donation data from navigation state
    this.donation = history.state.donation || { typeDon: 'ARGENT', donationFrequency: '' };
  }

  validateForm(): boolean {
    if (!this.payment.email || !this.payment.cardNumber || !this.payment.expirationMonth || 
        !this.payment.expirationYear || !this.payment.cvv || !this.payment.cardHolderName) {
      this.errorMessage = 'Please fill out all payment fields.';
      return false;
    }
    return true;
  }

  onPaymentSubmit() {
    if (this.validateForm()) {
      this.showAmountForm = true; // Show amount selection after payment details
    }
  }

  onAmountSubmit() {
    if (this.selectedAmount > 0) {
      this.donation.amount = this.selectedAmount;
      this.submitPaymentAndDonation();
    } else {
      this.errorMessage = 'Please enter a valid amount.';
    }
  }

  submitPaymentAndDonation() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // Submit donation first
    this.http.post<Donation>('http://localhost:8089/dons/add', this.donation, httpOptions).subscribe({
      next: (donationResponse) => {
        console.log('Donation saved:', donationResponse);

        // Then submit payment
        this.http.post<Payment>('http://localhost:8089/payments/add', this.payment, httpOptions).subscribe({
          next: (paymentResponse) => {
            console.log('Payment added successfully:', paymentResponse);
            this.successMessage = 'Payment and donation added successfully!';
            setTimeout(() => {
              this.router.navigate(['/donate']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = 'Error adding payment: ' + (error.error?.message || error.message);
            console.error('Payment error:', error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Error adding donation: ' + (error.error?.message || error.message);
        console.error('Donation error:', error);
      }
    });
  }
}