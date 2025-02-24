import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Paiment } from '../../pages/models/payment';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styles: []
})
export class ListPaymentComponent implements OnInit {
  paiements: Paiment[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPaiements();
  }

  loadPaiements() {
    this.loading = true;
    this.http.get<Paiment[]>('http://localhost:8089/charity/paiment/retrieve-all-Paiment')
      .subscribe({
        next: (data) => {
          console.log('Données reçues:', data);
          this.paiements = data.map(paiement => ({
            ...paiement,
            statutPaiment: paiement.statutPaiment // Valeur par défaut
          }));
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des paiements';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }
  deletePayment(idPmt: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      this.http.delete(`http://localhost:8089/charity/paiment/remove-Paiment/${idPmt}`)
        .subscribe({
          next: () => {
            this.loadPaiements();
            alert('Paiement supprimé avec succès');
          },
          error: (error) => {
            console.error('Erreur détaillée lors de la suppression:', error);
            if (error.status === 404) {
              alert('Paiement non trouvé');
            } else if (error.status === 0) {
              alert('Erreur de connexion au serveur');
            } else {
              alert(`Erreur lors de la suppression: ${error.message}`);
            }
          }
        });
    }
  }

  modifierPayment(paiment: Paiment) {
    this.router.navigate(['/edit-payment', paiment.idPmt]);
  }

  searchPayment() {
    if (this.searchTerm) {
      this.http.get<Paiment>(`http://localhost:8089/charity/paiment/get-Paiment/${this.searchTerm}`)
        .subscribe({
          next: (data) => {
            this.paiements = data ? [data] : [];
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            this.error = 'Paiement non trouvé';
          }
        });
    } else {
      this.loadPaiements();
    }
  }

  // Ajouter la méthode pour formater les dates
  formatDate(date: string): string {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('fr-FR'); // Format français (jour/mois/année)
  }
}
