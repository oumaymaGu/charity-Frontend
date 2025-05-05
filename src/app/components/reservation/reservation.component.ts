import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { HttpClient } from '@angular/common/http';

interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  
  idLog!: number;
  username!: string;
  message: string = '';
  successMessage = '';
  errorMessage = '';
  logement: Logement | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }
  
  ngOnInit(): void {
    // Get logementId and username
    this.idLog = Number(this.route.snapshot.paramMap.get('logementId'));
    this.username = localStorage.getItem('username') || '';
    
    if (!this.username) {
      this.errorMessage = 'Vous devez être connecté pour faire une réservation.';
      return;
    }
    
    // Fetch logement details to check availability
    this.fetchLogementDetails();
  }
  
  fetchLogementDetails(): void {
    this.http.get<Logement>(`http://localhost:8089/logement/get-log/${this.idLog}`)
    .subscribe({
      next: (logement) => {
        this.logement = logement;
        if (logement.disponnibilite !== 'disponible' || logement.capacite <= 0) {
          this.errorMessage = 'Ce logement n\'est plus disponible ou n\'a plus de places.';
        }
      },
      error: (error) => {
        console.error('Error fetching logement details:', error);
        this.errorMessage = 'Erreur lors de la récupération des détails du logement.';
      }
    });
  }
  
  reserver(): void {
    if (!this.logement) {
      this.errorMessage = 'Impossible de récupérer les détails du logement.';
      return;
    }
    
    if (this.logement.capacite <= 0) {
      this.errorMessage = 'Plus de places disponibles pour ce logement.';
      return;
    }
    
    if (this.idLog && this.username) {
      console.log('Sending reservation with:', {
        idLog: this.idLog,
        username: this.username,
        message: this.message
      });
      
      this.reservationService.ajouterReservation(this.idLog, this.username, this.message)
        .subscribe({
          next: () => {
            this.successMessage = 'Demande de réservation effectuée avec succès ! En attente de confirmation.';
            setTimeout(() => this.router.navigate(['/service']), 2000); // Redirect after success
          },
          error: (error) => {
            console.error('Error during reservation:', error);
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Erreur lors de la réservation. Veuillez réessayer.';
            }
          }
        });
    } else {
      this.errorMessage = 'Erreur : idLog ou username manquant';
    }
  }
  
  goToReservation(logementId: number): void {
    if (this.username && logementId) {
      this.router.navigate(['/reservation', this.username, logementId]);
    } else {
      this.errorMessage = 'Erreur : username ou logementId manquant';
    }
  }
}