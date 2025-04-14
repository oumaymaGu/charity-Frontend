import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';

import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';
import { Donation, MaterialCategory } from 'src/app/front_end/pages/models/donation';

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent implements OnInit {
  
  
  donation: Donation | null = null;
  errorMessage: string | null = null;
  donorInfo: { email: string, name: string } | null = null; // Stocke les infos du donateur
  donationId: number | null = null;
  donationRequest: any = null; // Pour stocker la demande de don
  donationRequests: any[] = []; // Pour stocker toutes les demandes de don
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
    private donationRequestService: DonationRequestService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDonationDetails(+id);
      this.loadDonorInfo(); // Charge automatiquement les infos du localStorage
    } else {
      this.errorMessage = 'Donation ID not found.';
    }
  }

  // Charge les infos du donateur depuis le localStorage
  loadDonorInfo() {
    this.donorInfo = this.donationRequestService.getDonorInfo();
    console.log('Donor info from storage:', this.donorInfo);
  }

  loadDonationDetails(id: number) {
    this.donationService.getDonById(id).subscribe({
      next: (data: Donation) => {
        // Traitement de l'image
        if (data.photoUrl && !data.photoUrl.startsWith('http')) {
          data.photoUrl = `http://localhost:8089/${data.photoUrl}`;
        }
        if (!data.photoUrl || data.photoUrl.trim() === '') {
          data.photoUrl = '/assets/img/default-donation.jpg';
        }

        this.donation = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails du don. Veuillez réessayer.';
        console.error('Erreur détaillée:', error);
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
    if (!this.donation || !this.donorInfo) return;
    
    // Utilise les infos du localStorage si disponibles
    const contact = this.donorInfo.email || this.donation.donorContact || '';
    const name = this.donorInfo.name || this.donation.donorName || 'Donateur';
    
    this.donationRequestService.saveDonorInfo(contact, name);
    this.router.navigate(['/donor-contact', this.donation.idDon]);
  }
  isMedication(donation: Donation): boolean {
    return donation.category === MaterialCategory.MEDICAMENT;
  }
  getDonorName(): string {
    // Priorité 1: Nom du localStorage
    if (this.donorInfo?.name) {
      return this.donorInfo.name;
    }
    
    // Priorité 2: Nom du don depuis l'API
    if (this.donation?.donorName) {
      return this.donation.donorName;
    }
    
    // Par défaut
    return 'Anonymous';
  }
}