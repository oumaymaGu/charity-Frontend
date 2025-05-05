import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Logement {
  idLog?: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
}

@Component({
  selector: 'app-ajouter-logement',
  templateUrl: './ajouter-logement.component.html',
  styles: []
})
export class AjouterLogementComponent implements OnInit {
  logement: Logement = {
    nom: '',
    adresse: '',
    capacite: 0,
    disponnibilite: 'disponible'
  };
  username: string | null = null;
  isSubmitting = false;
  notificationSent = false; // Ajouter cette variable pour vérifier si la notification a été envoyée

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
  }
  
  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    this.http.post<Logement>('http://localhost:8089/logement/add-log', this.logement)
      .subscribe({
        next: (response) => {
          console.log('Logement ajouté avec succès:', response);
          
          // Vérifiez si la notification a déjà été envoyée
          if (!this.notificationSent) {
            const notificationMessage = `New housing "${this.logement.nom}" has been added at location: ${this.logement.adresse}`;
            this.notificationSent = true; // Marquez comme envoyé
          }

          // Navigate after a short delay to ensure notification is sent
          setTimeout(() => {
            this.router.navigate(['/admin/logements/liste']);
            this.isSubmitting = false;
          }, 500);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du logement:', error);
          this.isSubmitting = false;
        }
      });
  }

  // Method to send notification
  /*sendNotification(message: string) {
    const notification = {
      message: message,
      date: new Date().toISOString(),
      lu: false
    };

    this.http.post<any>('http://localhost:8089/notificationrefuge/send', notification)
      .subscribe({
        next: (response) => {
          console.log('Notification sent successfully:', response);
        },
        error: (err) => {
          console.error('Error sending notification:', err);
          alert('Une erreur est survenue lors de l\'envoi de la notification');
        }
      });
  }*/

  logout() {
    this.authService.logout();
  }
}
