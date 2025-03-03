import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Refuge {
  idRfg: number;
  nom: string;
  prenom: string;
  email: string;
  nationnalite: string;
  datedenaissance: string;
  localisationActuel: string;
  besoin: string;
}

@Component({
  selector: 'app-last-refuge',
  templateUrl: './last-refuge.component.html',
  styleUrls: ['./last-refuge.component.css']
})
export class LastRefugeComponent implements OnInit {
  lastRefuge: Refuge | null = null;
  loading: boolean = true;
  error: string | null = null;
  showDetails: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLastRefuge();
  }

  loadLastRefuge() {
    this.loading = true;
    this.http.get<Refuge>('http://localhost:8089/refuge/last')
      .subscribe({
        next: (data) => {
          this.lastRefuge = data;
          this.loading = false;
          console.log('Dernier refuge chargé:', this.lastRefuge);
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement du dernier refuge';
          this.loading = false;
          console.error('Erreur détaillée:', error);
          if (error.status === 0) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.';
          } else if (error.status === 404) {
            this.error = 'L\'URL de l\'API est introuvable. Vérifiez l\'URL.';
          } else {
            this.error = `Erreur ${error.status}: ${error.message}`;
          }
        }
      });
  }

  voirDetails() {
    if (this.lastRefuge) {
      this.router.navigate(['/refuge', this.lastRefuge.idRfg]);
    }
  }

  modifierRefuge() {
    if (this.lastRefuge) {
      this.router.navigate(['/refuge/modifier', this.lastRefuge.idRfg]);
    }
  }

  supprimerRefuge() {
    if (this.lastRefuge) {
      const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce refuge ?');
      if (confirmation) {
        this.http.delete(`http://localhost:8089/refuge/remove-ref/${this.lastRefuge.idRfg}`)
          .subscribe({
            next: () => {
              alert('Refuge supprimé avec succès.');
              this.router.navigate(['/service']);
            },
            error: (error) => {
              console.error('Erreur lors de la suppression:', error);
              alert('Erreur lors de la suppression du refuge.');
            }
          });
      }
    }
  }

  fermerDetails() {
    this.showDetails = false;
    this.lastRefuge = null;
  }
}
