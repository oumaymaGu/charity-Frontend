import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';
import { Donation, MaterialCategory } from 'src/app/front_end/pages/models/donation';

@Component({
  selector: 'app-material-donation-list',
  templateUrl: './material-donation-list.component.html',
  styleUrls: ['./material-donation-list.component.css']
})
export class MaterialDonationListComponent implements OnInit {
  MaterialCategory = MaterialCategory;
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;
  searchQuery: string = '';
  selectedCategory: MaterialCategory | '' = ''; // Add property for selected category

  constructor(
    private donationService: DonService,
    private donationRequestService: DonationRequestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMaterialDonations();
  }

  loadMaterialDonations() {
    this.isLoading = true;
    this.errorMessage = null;

    const donorInfo = this.donationRequestService.getDonorInfo();

    this.donationService.getMaterialDonsWithQuantity().subscribe({
      next: (data: Donation[]) => {
        this.donations = data.map(donation => ({
          ...donation,
          donorName: donorInfo?.name || 'Anonymous',
          donorContact: donorInfo?.email || ''
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading material donations:', error);
        this.errorMessage = 'Error loading material donations. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategoryChange(category: MaterialCategory | '') {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.donations];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(donation =>
        (donation.description?.toString().toLowerCase().includes(searchTerm) ||
         this.getCategoryLabel(donation.category)?.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(donation =>
        donation.category === this.selectedCategory
      );
    }

    this.filteredDonations = filtered;
  }

  getCategoryLabel(category: MaterialCategory | undefined): string {
    if (!category) return 'Not Specified';
    switch (category) {
      case MaterialCategory.CLOTHES: return 'Clothes';
      case MaterialCategory.MEDICAMENT: return 'Medications';
      case MaterialCategory.FOOD: return 'Food';
      default: return category;
    }
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToDetails(donationId: number) {
    const donorInfo = this.donationRequestService.getDonorInfo();
    if (donorInfo) {
      this.donationRequestService.saveDonorInfo(donorInfo.email, donorInfo.name);
    }
    this.router.navigate(['/donation-details', donationId]);
  }

  contactDonor(donation: Donation) {
    if (!donation.donorContact) {
      alert('No contact information available.');
      return;
    }

    if (donation.donorContact.includes('@')) {
      this.contactDonorByEmail(donation.donorContact);
    } else if (donation.donorContact.includes('facebook.com')) {
      this.contactDonorByFacebook(donation.donorContact);
    } else {
      alert('Invalid contact information.');
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