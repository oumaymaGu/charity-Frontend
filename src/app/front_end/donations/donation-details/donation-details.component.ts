import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Donation {
  idDon: number;
  montant: number;
  dateDon: string;
  nomBenificaire: string;
  nomDonneur: string;
  typeDon: string;
}

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.css']
})
export class DonationDetailsComponent implements OnInit {
  donation: Donation | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // Récupérer l'ID depuis l'URL
    this.loadDonationDetails(id); // Charger les détails de la donation
  }

  loadDonationDetails(id: number): void {
    const url = `http://localhost:8089/charity/dons/${id}`; // L'URL de ton API backend
    this.http.get<Donation>(url).subscribe({
      next: (data) => {
        this.donation = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails de la donation', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/donation-page']); // Naviguer vers la page des donations
  }

  goToEdit(): void {
    if (this.donation) {
      this.router.navigate(['/edit-donation', this.donation.idDon]); // Naviguer vers la page d'édition de la donation
    }
  }
}
