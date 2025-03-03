import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface Donation {
  dateDon: string;
  donorContact: string;
  photo_url: string;
  typeDon: string;
  amount: number;
}

@Component({
  selector: 'app-list-donation',
  templateUrl: './list-donation.component.html',
  styleUrls: ['./list-donation.component.css'],
})
export class ListDonationComponent implements OnInit {
  donations: Donation[] = [];
  loading: boolean = true;
  error: string | null = null;
  totalAmount: number = 0;

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  ngOnInit() {
    this.loadDonations();
  }

  loadDonations() {
    this.http
      .get<Donation[]>('http://localhost:8089/dons/all')
      .pipe(
        map((data) => {
          if (!Array.isArray(data)) {
            throw new Error('Les données reçues ne sont pas valides.');
          }
          return data.filter((donation) => this.validateDonation(donation));
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.donations = data;
          this.loading = false;
          this.calculateTotalAmount();
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des donations.';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        },
      });
  }

  private validateDonation(donation: Donation): boolean {
    return (
      !!donation.typeDon &&
      (donation.typeDon === 'MATERIEL' || donation.typeDon === 'ARGENT') &&
      (donation.typeDon === 'MATERIEL' || donation.amount !== undefined)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur côté client s’est produite:', error.error.message);
    } else {
      console.error(
        `Le serveur a retourné un code ${error.status}, ` +
        `message d'erreur: ${error.message}`
      );
    }
    this.error = 'Une erreur s’est produite. Veuillez réessayer plus tard.';
  }

  getDisplayDate(donation: Donation): string {
    return donation.dateDon ? new Date(donation.dateDon).toLocaleDateString('fr-FR') : 'N/A';
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.donations
      .filter((donation) => donation.typeDon === 'ARGENT')
      .reduce((sum, donation) => sum + (donation.amount || 0), 0);
    console.log('Total amount of ARGENT donations:', this.totalAmount, 'TND');
  }

  // Method to navigate back to dashboard
  returnToDashboard(): void {
    this.router.navigate(['/dash']); // Adjust the route as needed
  }
}