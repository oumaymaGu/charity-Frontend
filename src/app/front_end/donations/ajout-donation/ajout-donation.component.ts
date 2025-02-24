import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Définition de l'enum TypeDon
export enum TypeDon {
  ARGENT = "ARGENT",
  MATERIEL = "MATERIEL"
}

interface Donation {
  montant: number;
  dateDon: string;
  nomBenificaire: string;
  nomDonneur: string;
  typeDon: TypeDon;
}

@Component({
  selector: 'app-ajout-donation',
  templateUrl: './ajout-donation.component.html',
  styleUrls: ['./ajout-donation.component.css']
})
export class AjoutDonationComponent {
  donation: Donation = {
    montant: 0,
    dateDon: '',
    nomBenificaire: '',
    nomDonneur: '',
    typeDon: TypeDon.ARGENT // Initialisation avec un type de don par défaut
  };

  // Rendre l'enum TypeDon accessible dans le template
  TypeDon = TypeDon;

  successMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<Donation>('http://localhost:8089/charity/dons/add', this.donation)
      .subscribe({
        next: (response) => {
          console.log('donation ajouté avec succès:', response);
          this.successMessage = 'Donation ajoutée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/donate']);
          }, 2000); // Redirige après 2 secondes
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du donation:', error);
        }
      });
  }
}