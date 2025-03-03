// src/app/front_end/donations/ajout-donation/ajout-donation.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Donation } from '../../pages/models/donation';

export enum TypeDon {
  ARGENT = "ARGENT",
  MATERIEL = "MATERIEL"
}

@Component({
  selector: 'app-ajout-donation',
  templateUrl: './ajout-donation.component.html',
  styleUrls: ['./ajout-donation.component.css']
})
export class AjoutDonationComponent {
  donation: Donation = {
    typeDon: TypeDon.ARGENT,
    idDon: 0,
    photoUrl: '',
    donorContact: '',
    dateDon: '', // Initially empty, will be set in onSubmit/submitDonation
    donationFrequency: '',
    amount: 0,
    heure: '',
    description: undefined,
    phone: undefined,
    email: undefined,
    donorName: undefined
  };

  TypeDon = TypeDon;
  showDonationFrequencyForm: boolean = false;
  showAmountForm: boolean = false; // Ajoutez cette ligne
  donationFrequency: string = '';
  selectedAmount: number = 0; // Ajoutez cette ligne
  successMessage: string | null = null;
  username: any;
  logout: any;

  constructor(private http: HttpClient, private router: Router) {}

  onTypeDonChange() {
    this.showDonationFrequencyForm = this.donation.typeDon === TypeDon.ARGENT;
    this.showAmountForm = false; // Réinitialiser l'affichage du formulaire de montant
    // Reset dateDon when changing type
    this.donation.dateDon = this.donation.typeDon === TypeDon.ARGENT ? 'N/A' : '';
  }

  onSubmit() {
    if (this.donation.typeDon === TypeDon.ARGENT) {
      this.showDonationFrequencyForm = true;
    } else if (this.donation.typeDon === TypeDon.MATERIEL) {
      this.submitDonation();
    }
  }

  onDonationFrequencySubmit() {
    if (this.donationFrequency) {
      this.donation.donationFrequency = this.donationFrequency;
      this.showAmountForm = true; // Afficher le formulaire de montant
    }
  }

  onAmountSubmit() {
    if (this.selectedAmount > 0) {
      this.donation.amount = this.selectedAmount;
      this.submitDonation();
    } else {
      alert("Veuillez entrer un montant valide.");
    }
  }

  submitDonation() {
    // Set dateDon to 'N/A' for ARGENT donations, keep it as is (or empty) for MATERIEL
    if (this.donation.typeDon === TypeDon.ARGENT) {
      this.donation.dateDon = this.donation.dateDon || new Date().toISOString();
    } else if (this.donation.typeDon === TypeDon.MATERIEL) {
      this.donation.dateDon = this.donation.dateDon || new Date().toISOString(); // Set current date if not set
    }

    this.http.post<Donation>('http://localhost:8089/dons/add', this.donation)
      .subscribe({
        next: (response) => {
          console.log('Donation saved:', response);
          this.successMessage = this.donation.typeDon === TypeDon.ARGENT
            ? 'Donation saved'
            : 'Donation saved';

          setTimeout(() => {
            if (this.donation.typeDon === TypeDon.ARGENT) {
              this.router.navigate(['/ajout-payment']);
            } else if (this.donation.typeDon === TypeDon.MATERIEL) {
              this.router.navigate(['/material-donation']);
            }
          }, 2000);
        },
        error: (error) => {
          console.error('Donation error:', error);
        }
      });
  }
}