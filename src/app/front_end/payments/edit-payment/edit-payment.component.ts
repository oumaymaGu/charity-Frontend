import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {
  payment: Payment = {
    datePaiment: '',
    methodePaiment: '',
    statutPaiment: '',
    montant: 0,
    devise: '',
    ribBancaire: '',
    id: 0
  };

  paymentMethods = ['Carte Bancaire', 'Virement Bancaire', 'Espèces'];
  paymentStatuses = ['En attente', 'Validé', 'Refusé'];
  currencies = ['TND', 'USD', 'EUR'];

  errorMessage: string = '';
  successMessage: string = ''; // ✅ Nouveau message de succès
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const paymentId = this.route.snapshot.paramMap.get('id');
    if (paymentId) {
      this.loading = true;
      this.http.get<Payment>(`http://localhost:8089/charity/paiment/get-Paiment/${paymentId}`)
        .subscribe({
          next: (data) => {
            this.payment = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement du paiement:', error);
            this.errorMessage = "Erreur lors du chargement du paiement.";
            this.loading = false;
          }
        });
    }
  }

  validateForm(): boolean {
    if (!this.payment.datePaiment) {
      this.errorMessage = "La date du paiement est requise.";
      return false;
    }
    if (!this.payment.methodePaiment) {
      this.errorMessage = "Veuillez sélectionner une méthode de paiement.";
      return false;
    }
    if (!this.payment.statutPaiment) {
      this.errorMessage = "Veuillez choisir un statut.";
      return false;
    }
    if (this.payment.montant <= 0) {
      this.errorMessage = "Le montant doit être supérieur à zéro.";
      return false;
    }
    if (!this.payment.devise) {
      this.errorMessage = "Veuillez choisir une devise.";
      return false;
    }
    if (!/^\d{20}$/.test(this.payment.ribBancaire)) {
      this.errorMessage = "Le RIB doit contenir exactement 20 chiffres.";
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    
    this.http.put<Payment>(`http://localhost:8089/charity/paiment/modifyPaiment`, this.payment)
      .subscribe({
        next: (response) => {
          this.successMessage = "Paiement mis à jour avec succès !"; // ✅ Ajout du message de succès
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/list-payment']), 2000); // Redirection après 2 sec
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du paiement:', error);
          this.errorMessage = "Une erreur est survenue lors de la mise à jour du paiement.";
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onCancel() {
    this.router.navigate(['/list-payment']);
  }
}
