import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Router } from '@angular/router';
import { Event } from '../../pages/models/event';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  events: Event[] = [];
  searchTerm: string = '';

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getAllevents().subscribe(
      (data: Event[]) => {
        this.events = data;
      },
      (error) => {
        console.error("Erreur lors de la récupération des événements", error);
      }
    );
  }

  editEvent(event: Event): void {
    this.router.navigate(['/edit-event', event.idEvent]);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer cet événement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEvent(id);
        Swal.fire(
          'Supprimé!',
          'L\'événement a été supprimé.',
          'success'
        );
      }
    });
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe(
      response => {
        console.log('Événement supprimé avec succès', response);
        this.getEvents(); // Rafraîchir la liste des événements
      },
      error => {
        console.error('Erreur lors de la suppression de l\'événement', error);
      }
    );
  }

  searchEvents(term: string): void {
    if (term) {
      this.events = this.events.filter(event => event.nomEvent.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.getEvents();
    }
  }

  rejoindreEvent(eventId: number): void {
    this.router.navigate(['/inscription', eventId]);
  }
}
