import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Payment {
  datePaiment: string;
  methodePaiment: string;
  statutPaiment: string;
  montant: number; // Correction ici
  devise: string;
  ribBancaire: string;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './ajout-payment.component.html',
  styleUrls: ['./ajout-payment.component.css']
})
export class AddPaymentComponent {
  payment: Payment =  {
    datePaiment: '',
    methodePaiment: '',
    montant: 0, // Correction ici
    devise: '',
    ribBancaire: '',
    statutPaiment: ''
  };

  errorMessage: string = ''; // Message d'erreur à afficher

  constructor(private http: HttpClient, private router: Router) {}

  // Fonction de validation
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
    this.errorMessage = ''; // Réinitialiser le message d'erreur si tout est OK
    return true;
  }

  // Fonction d'envoi du formulaire
  onSubmit() {
    if (!this.validateForm()) {
      return; // Ne pas soumettre si le formulaire n'est pas valide
    }

    this.http.post<Payment>('http://localhost:8089/charity/paiment/add-Paiment', this.payment)
      .subscribe({
        next: (response) => {
          console.log('Paiement ajouté avec succès:', response);
          alert("Paiement ajouté avec succès !");
          this.router.navigate(['/donate']); // Redirection après ajout
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du paiement:', error);
          this.errorMessage = "Une erreur est survenue lors de l'ajout du paiement.";
        }
      });
  }
}
