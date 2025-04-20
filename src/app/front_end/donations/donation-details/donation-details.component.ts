import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';
import { Donation, MaterialCategory } from 'src/app/front_end/pages/models/donation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent implements OnInit {
  donation: Donation | null = null;
  errorMessage: string | null = null;
  donorInfo: { email: string, name: string } | null = null;
  donationId: string | null = null;
  donationRequest: any = null;
  donationRequests: any[] = [];
  displayedColumns: string[] = ['date', 'fullName', 'userEmail', 'message', 'deliveryMethod', 'actions'];
  medicationDonation = {
    medicationName: '',
    lotNumber: '',
    expirationDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private donationService: DonService,
    private router: Router,
    private donationRequestService: DonationRequestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donationId = id;
      this.loadDonationDetails(+id);
      this.loadDonorInfo();
    } else {
      this.errorMessage = 'Donation ID not found.';
      this.snackBar.open('Invalid donation ID.', 'Close', { duration: 5000 });
    }
  }

  loadDonorInfo() {
    this.donorInfo = this.donationRequestService.getDonorInfo();
    console.log('Donor info from storage:', this.donorInfo);
  }

  loadDonationDetails(id: number) {
    this.donationService.getDonById(id).subscribe({
      next: (data: Donation) => {
        if (data.photoUrl && !data.photoUrl.startsWith('http')) {
          data.photoUrl = `http://localhost:8089/${data.photoUrl}`;
        }
        if (!data.photoUrl || data.photoUrl.trim() === '') {
          data.photoUrl = '/assets/img/default-donation.jpg';
        }
        this.donation = data;
        // Update donor info in localStorage if available
        if (data.donorContact && data.donorName) {
          this.donationRequestService.saveDonorInfo(data.donorContact, data.donorName);
          this.loadDonorInfo();
        }
      },
      error: (error) => {
        this.errorMessage = 'Error loading donation details. Please try again.';
        this.snackBar.open('Failed to load donation details.', 'Close', { duration: 5000 });
        console.error('Detailed error:', error);
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

  contactDonor() {
    if (!this.donation || !this.donation.idDon) {
      console.error('Cannot contact donor: Donation or donation ID is missing');
      this.errorMessage = 'Unable to contact donor. Donation details are missing.';
      this.snackBar.open('Donation details are missing.', 'Close', { duration: 5000 });
      return;
    }

    const contact = this.donorInfo?.email || this.donation.donorContact || '';
    const name = this.donorInfo?.name || this.donation.donorName || 'Donateur';

    this.donationRequestService.saveDonorInfo(contact, name);

    console.log('Navigating to donor-contact with ID:', this.donation.idDon);
    this.router.navigate(['/donor-contact', this.donation.idDon]).then(success => {
      if (!success) {
        console.error('Navigation to donor-contact failed');
        this.errorMessage = 'Failed to navigate to contact page. Please try again.';
        this.snackBar.open('Navigation failed.', 'Close', { duration: 5000 });
      }
    }).catch(err => {
      console.error('Navigation error:', err);
      this.errorMessage = 'An error occurred while navigating. Please try again.';
      this.snackBar.open('Navigation error occurred.', 'Close', { duration: 5000 });
    });
  }

  isMedication(donation: Donation): boolean {
    return donation.category === MaterialCategory.MEDICAMENT;
  }

  getDonorName(): string {
    if (this.donorInfo?.name) {
      return this.donorInfo.name;
    }
    if (this.donation?.donorName) {
      return this.donation.donorName;
    }
    return 'Anonymous';
  }
}
