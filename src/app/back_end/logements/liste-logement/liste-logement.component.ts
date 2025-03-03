import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
}

@Component({
  selector: 'app-liste-logement',
  templateUrl: './liste-logement.component.html',
  styles: []
})
export class ListeLogementComponent implements OnInit {
  logements: Logement[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';  // Utilisé pour la recherche

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLogements();
    this.username = this.authService.getUsername();
  }

  // Fonction pour charger tous les logements
  loadLogements() {
    this.loading = true;
    this.http.get<Logement[]>('http://localhost:8089/logement/get-all-log')
      .subscribe({
        next: (data) => {
          this.logements = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des logements';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }

  // Fonction pour supprimer un logement
  deleteLogement(id_log: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
      this.http.delete(`http://localhost:8089/logement/remove-log/${id_log}`)
        .subscribe({
          next: () => {
            this.loadLogements();
            alert('Logement supprimé avec succès');
          },
          error: (error) => {
            console.error('Erreur détaillée lors de la suppression:', error);
            if (error.status === 404) {
              alert('Logement non trouvé');
            } else if (error.status === 0) {
              alert('Erreur de connexion au serveur');
            } else {
              alert(`Erreur lors de la suppression: ${error.message}`);
            }
          }
        });
    }
  }

  // Fonction pour modifier un logement
  modifierLogement(logement: Logement) {
    this.router.navigate(['/admin/logements/modifier', logement.idLog]);
  }

  // Fonction de recherche des logements par nom
  searchLogements() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.error = null;

      // Effectuer la recherche en envoyant une requête HTTP vers le backend
      this.http.get<Logement[]>(`http://localhost:8089/logement/search?nom=${this.searchTerm}`)
        .subscribe({
          next: (data) => {
            this.logements = data;
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Erreur lors de la recherche des logements';
            this.loading = false;
            console.error('Erreur détaillée:', error);
          }
        });
    } else {
      // Si aucun terme de recherche, on charge tous les logements
      this.loadLogements();
    }
  }
  username: string | null = null;




  logout() {
    this.authService.logout();
  }
  
}
