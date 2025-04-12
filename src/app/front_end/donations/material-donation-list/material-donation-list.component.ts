import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { Donation, MaterialCategory } from 'src/app/front_end/pages/models/donation';

@Component({
  selector: 'app-material-donation-list',
  templateUrl: './material-donation-list.component.html',
  styleUrls: ['./material-donation-list.component.css']
})
export class MaterialDonationListComponent implements OnInit {
  MaterialCategory = MaterialCategory;
  categories: (MaterialCategory | 'ALL')[] = ['ALL', MaterialCategory.FOOD, MaterialCategory.CLOTHES, MaterialCategory.MEDICAMENT];
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;
  selectedCategory: MaterialCategory | 'ALL' = 'ALL';

  // Add medication specific properties to the Donation interface
  medicationDonation = {
    medicationName: '',
    lotNumber: '',
    expirationDate: ''
  };
 

  constructor(private donationService: DonService, private router: Router) {}

  ngOnInit() {
    this.loadMaterialDonations();
  }

  loadMaterialDonations() {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationService.getMaterialDons().subscribe({
      next: (data: Donation[]) => {
        this.donations = data.filter(donation => donation.photoUrl && donation.photoUrl.trim() !== '');
        this.filterDonations();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des dons matériels:', error);
        this.errorMessage = 'Erreur lors du chargement des dons matériels. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  filterDonations() {
    if (this.selectedCategory === 'ALL') {
      this.filteredDonations = [...this.donations];
    } else {
      this.filteredDonations = this.donations.filter(
        donation => donation.category === this.selectedCategory
      );
    }
  }

  onCategoryChange(category: MaterialCategory | 'ALL') {
    this.selectedCategory = category;
    this.filterDonations();
  }

  // Add this method to get category labels
  getCategoryLabel(category: MaterialCategory | 'ALL'): string {
    switch (category) {
      case 'ALL': return 'Tous';
      case MaterialCategory.CLOTHES: return 'Vêtements';
      case MaterialCategory.MEDICAMENT: return 'Médicaments';
      case MaterialCategory.FOOD: return 'Nourriture';
      default: return category;
    }
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Date inconnue';
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
    if (!donation.donorContact) {
      alert('Aucune information de contact disponible.');
      return;
    }

    if (donation.donorContact.includes('@')) {
      this.contactDonorByEmail(donation.donorContact);
    } else if (donation.donorContact.includes('facebook.com')) {
      this.contactDonorByFacebook(donation.donorContact);
    } else {
      alert('Informations de contact invalides.');
    }
  }

  private contactDonorByEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  private contactDonorByFacebook(facebookUrl: string) {
    window.open(facebookUrl, '_blank');
  }

  isMedication(donation: Donation): boolean {
    return donation.category === MaterialCategory.MEDICAMENT;
  }
}