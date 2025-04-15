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

  assignToEvent(logestiqueId: number): void {
    // Vérification si la liste d'événements est bien chargée
    if (this.events.length === 0) {
      Swal.fire('Erreur', 'Aucun événement disponible pour l’assignation.', 'error');
      return;
    }
  
    // Préparer les options pour la liste déroulante
    const eventOptions = this.events.reduce((options, event) => {
      // Utilisez les noms de propriétés corrects (par exemple, idEvent et nomEvent)
      if (event && event.idEvent !== undefined && event.nomEvent) {
        options[event.idEvent.toString()] = event.nomEvent; // Ajouter l'événement à la liste
      } else {
        console.warn("⚠️ Événement invalide détecté :", event); // Debug si erreur
      }
      return options;
    }, {});
  
    // Vérification si des options valides ont été générées
    if (Object.keys(eventOptions).length === 0) {
      Swal.fire('Erreur', 'Aucun événement valide disponible pour l’assignation.', 'error');
      return;
    }
  
    // Afficher la boîte de dialogue SweetAlert
    Swal.fire({
      title: 'Assigner à un événement',
      input: 'select',
      inputOptions: eventOptions,
      inputPlaceholder: 'Sélectionnez un événement',
      showCancelButton: true,
      confirmButtonText: 'Assigner',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      console.log("Résultat SweetAlert:", result); // Log debug
  
      if (result.isConfirmed && result.value !== undefined && result.value !== '') {
        const eventId = Number(result.value); // Convertir l'ID en nombre
  
        if (isNaN(eventId)) {
          Swal.fire('Erreur', 'ID d\'événement invalide.', 'error');
          return;
        }
  
        // Appeler le service pour assigner la logistique à l'événement
        this.logestiqueService.assignLogToEvent(logestiqueId, eventId).subscribe({
          next: () => {
            Swal.fire('Succès', 'Logistique assignée à l\'événement avec succès.', 'success');
          },
          error: (err) => {
            console.error("Erreur API:", err); // Log erreur
            Swal.fire('Erreur', 'Impossible d\'assigner la logistique.', 'error');
          }
        });
      }
    });
  }

  
  viewAssignedEvents(logestiqueId: number): void {
    this.router.navigate(['/events-logestiques', logestiqueId]);
  }
}