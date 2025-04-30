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
    dateDon: new Date().toISOString(), // Set default date for ARGENT
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
  donationFrequency: string = '';
  successMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onTypeDonChange() {
    this.showDonationFrequencyForm = this.donation.typeDon === TypeDon.ARGENT;
    // Set default date for ARGENT, empty for MATERIEL
    this.donation.dateDon = this.donation.typeDon === TypeDon.ARGENT ? new Date().toISOString() : '';
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
      // Navigate to payment page with donation data
      this.router.navigate(['/stripe-payment'], { state: { donation: this.donation } });
    } else {
      alert("Veuillez sélectionner un type de donation.");
    }
  }

  submitDonation() {
    this.donation.dateDon = this.donation.dateDon || new Date().toISOString();
    this.donation.heure = new Date().toLocaleTimeString();

    this.http.post<Donation>('http://localhost:8089/dons/add', this.donation).subscribe({
      next: (response) => {
        console.log('Donation saved:', response);
        
        setTimeout(() => {
          this.router.navigate(['/material-donation']);
        }, 2000);
      },
      error: (error) => {
        console.error('Donation error:', error);
      }
    });
  }
}