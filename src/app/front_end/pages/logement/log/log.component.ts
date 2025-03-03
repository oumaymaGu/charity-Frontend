import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
}

@Component({
  selector: 'app-service',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class ServiceComponent implements OnInit {
  Logements: Logement[] = [];
  selectedLogement: Logement | null = null;  // Pour afficher les détails
  loading: boolean = true;
  error: string | null = null;
  showDetails: boolean = false;  // Pour contrôler l'affichage des détails

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLogements();
  }

  loadLogements() {
    this.loading = true;
    this.http.get<Logement[]>('http://localhost:8089/logement/get-all-log')
      .subscribe({
        next: (data) => {
          this.Logements = data;
          this.loading = false;
          console.log('Logements chargés:', this.Logements);
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des logements';
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

  voirDetails(logement: Logement) {
    this.router.navigate(['/logement', logement.idLog]);
  }

  fermerDetails() {
    this.showDetails = false;
    this.selectedLogement = null;
  }
}
