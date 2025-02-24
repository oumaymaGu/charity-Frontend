import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Donation {
  idDon: number;
  montant: number;
  dateDon: string;
  nomBenificaire: string;
  nomDonneur: string;
  typeDon: string;
}

@Component({
  selector: 'app-donation-page',
  templateUrl: './donation-page.component.html',
  styleUrls: ['./donation-page.component.css']
})
export class DonationPageComponent implements OnInit {
  donations: Donation[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAllDonations();
  }

  loadAllDonations(): void {
    const url = 'http://localhost:8089/charity/dons/all';
    this.http.get<Donation[]>(url).subscribe({
      next: (data) => {
        this.donations = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des donations', error);
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/donation-details', id]);
  }
}
