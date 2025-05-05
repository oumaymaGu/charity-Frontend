import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Reservation {
  idReservation: number;
  dateDemande: string;
  statut: string;
  message: string;
  demandeur: {
    username: string;
    email: string;
  };
  logement: {
    nom: string;
    adresse: string;
  };
}

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage = '';
  adminEmail = 'jelassiaziz88@gmail.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.http.get<Reservation[]>('http://localhost:8089/api/reservations')
      .subscribe({
        next: (data) => this.reservations = data,
        error: (error) => this.errorMessage = 'Failed to load reservations'
      });
  }

  changeStatus(idReservation: number, newStatus: string): void {
    const payload = {
      statut: newStatus,
      adminEmail: this.adminEmail // Always send the admin email
    };

    this.http.put(`http://localhost:8089/api/reservations/${idReservation}/status`, payload)
      .subscribe({
        next: () => {
          // Update local reservation status
          this.reservations = this.reservations.map(reservation =>
            reservation.idReservation === idReservation ? { ...reservation, statut: newStatus } : reservation
          );
          
          // Show appropriate message
          if (newStatus === 'ACCEPTEE') {
            alert('Reservation accepted and notification email sent');
          } else {
            alert('Reservation status updated successfully');
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status');
        }
      });
  }
}