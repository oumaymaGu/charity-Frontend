import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


interface Logement {
  idLog?: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponibilite: string;
}

@Component({
  selector: 'app-ajouter-logement',
  templateUrl: './ajouter-logement.component.html',
  styles: []
})
export class AjouterLogementComponent {
  logement: Logement = {
    nom: '',
    adresse: '',
    capacite: 0,
    disponibilite: 'disponible'
  };
  username: string | null = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService

  ) {}
  ngOnInit() {
    this.username = this.authService.getUsername();
  }


  onSubmit() {
    this.http.post<Logement>('http://localhost:8089/logement/add-log', this.logement)
      .subscribe({
        next: (response) => {
          console.log('Logement ajouté avec succès:', response);
          this.router.navigate(['/admin/logements/liste']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du logement:', error);
        }
      });
  }

  logout() {
    this.authService.logout();
  }
} 