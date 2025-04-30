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
    donorInfo: { email: string, name: string, username?: string } | null = null;
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
        } else {
            this.errorMessage = 'Donation ID not found.';
            this.snackBar.open('Invalid donation ID.', 'Close', { duration: 5000 });
        }
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

                // Charger les informations du donateur depuis localStorage
                this.loadDonorInfo();
            },
            error: (error) => {
                this.errorMessage = 'Erreur lors du chargement des détails du don. Veuillez réessayer.';
                this.snackBar.open('Échec du chargement des détails du don.', 'Fermer', { duration: 5000 });
                console.error('Erreur détaillée:', error);
            }
        });
    }

    loadDonorInfo() {
        // Récupérer email et username directement depuis localStorage
        const email = localStorage.getItem('email') || 'No email provided';
        const username = localStorage.getItem('username') || 'Anonymous';

        // Mettre à jour current_donor_info avec ces valeurs
        this.donationRequestService.saveDonorInfo(email, username);

        this.donorInfo = { email, name: username };
        console.log('Informations du donateur chargées depuis localStorage:', this.donorInfo);
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
            console.error('Impossible de contacter le donateur : Don ou ID du don manquant');
            this.errorMessage = 'Impossible de contacter le donateur. Détails du don manquants.';
            this.snackBar.open('Détails du don manquants.', 'Fermer', { duration: 5000 });
            return;
        }

        // Utiliser directement les données de localStorage pour la navigation
        const email = localStorage.getItem('email') || 'No email provided';
        const username = localStorage.getItem('username') || 'Anonymous';

        this.router.navigate(['/donor-contact', this.donation.idDon]).then(success => {
            if (!success) {
                console.error('Échec de la navigation vers la page de contact');
                this.errorMessage = 'Échec de la navigation vers la page de contact. Veuillez réessayer.';
                this.snackBar.open('Échec de la navigation.', 'Fermer', { duration: 5000 });
            }
        }).catch(err => {
            console.error('Erreur de navigation:', err);
            this.errorMessage = 'Une erreur s\'est produite lors de la navigation. Veuillez réessayer.';
            this.snackBar.open('Erreur de navigation survenue.', 'Fermer', { duration: 5000 });
        });
    }

    isMedication(donation: Donation): boolean {
        return donation.category === MaterialCategory.MEDICAMENT;
    }

    getDonorName(): string {
        return this.donorInfo?.name || 'Anonymous';
    }

    getDonorEmail(): string {
        return this.donorInfo?.email || 'No email provided';
    }
}