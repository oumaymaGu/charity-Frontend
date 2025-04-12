import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { Donation } from 'src/app/front_end/pages/models/donation';

@Component({
  selector: 'app-material-donation-list',
  templateUrl: './material-donation-list.component.html',
  styleUrls: ['./material-donation-list.component.css']
})
export class MaterialDonationListComponent implements OnInit {
  donations: Donation[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;
donation: any;

  constructor(private donationService: DonService, private router: Router) {}

  ngOnInit() {
    this.loadMaterialDonations();
  }

  loadMaterialDonations() {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationService.getMaterialDons().subscribe({
      next: (data: Donation[]) => {
        console.log("Données reçues :", data); // 🔍 Debug
        this.donations = data.filter(donation => donation.photoUrl && donation.photoUrl.trim() !== ''); // Filtrage des images nulles
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des dons matériels:', error);
        this.errorMessage = 'Erreur lors du chargement des dons matériels. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToDetails(donationId: number) {
    this.router.navigate(['/donation-details', donationId]);
  }

  contactDonor(donation: Donation) {
    if (donation.donorContact) {
      if (donation.donorContact.includes('@')) {
        this.contactDonorByEmail(donation.donorContact);
      } else if (donation.donorContact.includes('facebook.com')) {
        this.contactDonorByFacebook(donation.donorContact);
      } else {
        alert('Informations de contact invalides.');
      }
    } else {
      alert('Aucune information de contact disponible.');
    }
  }

  contactDonorByEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  contactDonorByFacebook(facebookUrl: string) {
    window.open(facebookUrl, '_blank');
  }
}
