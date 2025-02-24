import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// Interface pour la donation
interface Donation {
  idDon: number;
  montant: number;
  dateDon: string;
  nomBenificaire: string;
  nomDonneur: string;
  typeDon: string; // "ARGENT" ou "MATERIEL"
}

@Component({
  selector: 'app-edit-donation',
  templateUrl: './edit-donation.component.html',
  styleUrls: ['./edit-donation.component.css']
})
export class EditDonationComponent implements OnInit {
  donation: Donation = {
    idDon: 0,
    montant: 0,
    dateDon: '',
    nomBenificaire: '',
    nomDonneur: '',
    typeDon: 'ARGENT' // Initialisation avec un type de don par défaut
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadDonation(id);
  }

  // Charger les informations d'une donation
  loadDonation(id: number) {
    const url = `http://localhost:8089/charity/dons/${id}`;  // URL pour obtenir la donation par ID
    this.http.get<Donation>(url).subscribe({
      next: (data) => {
        this.donation = data;  // Initialiser les données de la donation
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur lors du chargement de la donation');
      }
    });
  }

  // Soumettre la modification de la donation
  onSubmit() {
    const url = `http://localhost:8089/charity/dons/update/${this.donation.idDon}`;  // URL pour mettre à jour la donation
    this.http.put(url, this.donation).subscribe({
      next: () => {
        alert('Donation modifiée avec succès');
        this.router.navigate(['/list-donation']);  // Rediriger vers la liste des donations après modification
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        alert('Erreur lors de la modification de la donation');
      }
    });
  }

  // Annuler et revenir à la liste des donations
  onCancel() {
    this.router.navigate(['/list-donation']);
  }
}
