import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogestiqueServiceService } from 'src/app/services/logestique-service.service';
import { EventService } from 'src/app/services/event.service'; // Import du service Event
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Logistique } from 'src/app/front_end/pages/models/Logestique';

@Component({
  selector: 'app-listelogestique',
  templateUrl: './listelogestique.component.html',
  styleUrls: ['./listelogestique.component.css']
})
export class ListelogestiqueComponent implements OnInit {
  logestiques: any[] = [];
  events: any[] = []; // Liste des événements
  searchTerm: string = '';
  isLoading: boolean = false; // Pour afficher un spinner pendant les requêtes

  constructor(
    private logestiqueService: LogestiqueServiceService,
    private eventService: EventService, // Injection du service Event
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLogestiques();
    this.loadEvents(); // Charge les événements au démarrage
  }

  // Charge les logistiques
  getLogestiques(): void {
    this.logestiqueService.getAlllogestique().subscribe((data: any[]) => {
      this.logestiques = data;
    });
  }

  // Charge la liste des événements
  loadEvents(): void {
    this.eventService.getAllevents().subscribe((data: any[]) => {
      this.events = data;
    });
  }

  // Recherche des logistiques par nom
  searchLogestiques(term: string): void {
    if (term) {
      this.logestiques = this.logestiques.filter(logestique => logestique.ressourceName.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.getLogestiques();
    }
  }

  // Redirection vers l'édition de la logistique
  editLogestique(logestique: any): void {
    this.router.navigate(['/edit-log', logestique.idlogestique]);
  }

  // Confirmation avant suppression de logistique
  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer ce logistique?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteLogestique(id);
        Swal.fire(
          'Supprimé!',
          'Le logistique a été supprimé.',
          'success'
        );
      }
    });
  }

  // Suppression de la logistique
  deleteLogestique(id: number): void {
    this.logestiqueService.deleteLogestique(id).subscribe(() => {
      this.getLogestiques(); // Rafraîchit la liste après suppression
    });
  }

  // Retour au dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Assigner une logistique à un événement avec une quantité
  assignToEvent(logestique: any): void {
    if (this.events.length === 0) {
      Swal.fire('Erreur', 'Aucun événement disponible pour l’assignation.', 'error');
      return;
    }

    const eventOptions = this.events.reduce((options, event) => {
      if (event && event.idEvent !== undefined && event.nomEvent) {
        options[event.idEvent.toString()] = event.nomEvent;
      }
      return options;
    }, {});

    if (Object.keys(eventOptions).length === 0) {
      Swal.fire('Erreur', 'Aucun événement valide disponible pour l’assignation.', 'error');
      return;
    }

    Swal.fire({
      title: 'Assigner à un événement',
      html: `
        <select id="event-select" class="swal2-input">
          ${Object.keys(eventOptions).map(key => `<option value="${key}">${eventOptions[key]}</option>`).join('')}
        </select>
        <input id="quantity" type="number" class="swal2-input" placeholder="Quantité" min="1" max="${logestique.quantity}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Assigner',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const eventId = (document.getElementById('event-select') as HTMLSelectElement).value;
        const quantity = (document.getElementById('quantity') as HTMLInputElement).value;

        if (!eventId || !quantity || parseInt(quantity, 10) <= 0 || parseInt(quantity, 10) > logestique.quantity) {
          Swal.showValidationMessage('Veuillez sélectionner un événement et entrer une quantité valide.');
          return null;
        }

        return { eventId: parseInt(eventId, 10), quantity: parseInt(quantity, 10) };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { eventId, quantity } = result.value;

        this.isLoading = true; // Afficher le spinner

        this.logestiqueService.assignLogToEventWithQuantity(logestique.idlogestique, eventId, quantity).subscribe({
          next: () => {
            Swal.fire('Succès', 'Logistique assignée avec succès.', 'success');
            logestique.quantity -= quantity; // Mettre à jour la quantité localement
            this.isLoading = false; // Masquer le spinner
          },
          error: (err) => {
            console.error("Erreur API:", err);
            Swal.fire('Erreur', 'Impossible d\'assigner la logistique.', 'error');
            this.isLoading = false; // Masquer le spinner
          }
        });
      }
    });
  }

  // Voir les événements assignés à une logistique
  viewAssignedEvents(logestiqueId: number): void {
    this.router.navigate(['/events-logestiques', logestiqueId]);
  }
}