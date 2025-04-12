import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { Donation } from 'src/app/front_end/pages/models/donation';

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent implements OnInit {
  donation: Donation | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private donationService: DonService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDonationDetails(+id); // Convertir l'ID en nombre
    } else {
      this.errorMessage = 'Donation ID not found.';
    }
  }

  loadDonationDetails(id: number) {
    this.donationService.getDonById(id).subscribe({ // Correction du nom de la méthode
      next: (data: Donation) => {
        console.log("Donation data received:", data);
        console.log("Photo URL:", data.photoUrl);

        // Si photoUrl est relatif, ajoutez un préfixe pour le backend
        if (data.photoUrl && !data.photoUrl.startsWith('http')) {
          data.photoUrl = `http://localhost:8089/${data.photoUrl}`; // Ajustez selon votre backend
        }
        // Si photoUrl est null ou vide, utilisez une URL par défaut
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

  // Méthode pour formater la date (comme dans votre MaterialDonationListComponent)
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

  // Méthode principale pour contacter le donateur
  contactDonor() {
    if (this.donation && this.donation.donorContact) {
      if (this.donation.donorContact.includes('@')) {
        this.contactDonorByEmail(this.donation.donorContact);
      } else if (this.donation.donorContact.includes('facebook.com')) {
        this.contactDonorByFacebook(this.donation.donorContact);
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

  returnToList() {
    this.router.navigate(['/material-donation-list']);
  }
}
