import { Component } from '@angular/core';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent {
  donationType: string = '1'; // Default to Single Donation
selectedDonationType: any;
  constructor() {}

  onSubmit() {
    this.selectedDonationType = this.donationType === '1' ? 'Single Donation' : 'Monthly Donation';
    // Vous pouvez ajouter ici la logique pour rediriger vers la page d'ajout de donation
  }
}
