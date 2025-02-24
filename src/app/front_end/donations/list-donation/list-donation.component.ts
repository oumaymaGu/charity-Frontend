import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Donation } from '../../pages/models/donation';  // Assure-toi que cette interface est bien définie

@Component({
  selector: 'app-list-donation',
  templateUrl: './list-donation.component.html',
  styles: []
})
export class ListDonationComponent implements OnInit {
  donations: Donation[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDonations();
  }

  loadDonations() {
    this.loading = true;
    this.http.get<Donation[]>('http://localhost:8089/charity/dons/all')
      .subscribe({
        next: (data) => {
          this.donations = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des donations';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }

  deleteDonation(idDon: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette donation ?')) {
      this.http.delete(`http://localhost:8089/charity/dons/delete/${idDon}`)
        .subscribe({
          next: () => {
            this.loadDonations();
            alert('Donation supprimée avec succès');
          },
          error: (error) => {
            console.error('Erreur détaillée lors de la suppression:', error);
            if (error.status === 404) {
              alert('Donation non trouvée');
            } else if (error.status === 0) {
              alert('Erreur de connexion au serveur');
            } else {
              alert(`Erreur lors de la suppression: ${error.message}`);
            }
          }
        });
    }
  }

  modifierDonation(donation: Donation) {
    this.router.navigate(['/edit-donation', donation.idDon]);
  }

  searchDonation() {
    if (this.searchTerm) {
      this.http.get<Donation>(`http://localhost:8089/charity/dons/${this.searchTerm}`)
        .subscribe({
          next: (data) => {
            this.donations = data ? [data] : [];
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            this.error = 'Donation non trouvée';
          }
        });
    } else {
      this.loadDonations();
    }
  }
}
