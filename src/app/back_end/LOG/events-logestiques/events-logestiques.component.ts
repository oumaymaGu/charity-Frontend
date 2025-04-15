import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { LogestiqueServiceService } from 'src/app/services/logestique-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events-logestiques',
  templateUrl: './events-logestiques.component.html',
  styleUrls: ['./events-logestiques.component.css']
})
export class EventsLogestiquesComponent implements OnInit {
  logestiqueId!: number;
  events: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private logestiqueService: LogestiqueServiceService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.logestiqueId = +(params.get('id')!); 
      this.getEventsForLogestique(this.logestiqueId);
    });
  }

  getEventsForLogestique(logestiqueId: number): void {
    this.eventService.getEventsWithLogistics().subscribe((events: any[]) => {
      
      this.events = events.filter(event =>
        event.logestiques && event.logestiques.some((log: { idlogestique: number; }) => log.idlogestique === logestiqueId)
      );
      
      if (this.events.length === 0) {
        Swal.fire('Aucun événement', 'Aucun événement n\'est assigné à cette logistique.', 'info');
      }
    }, error => {
      console.error('Erreur lors de la récupération des événements :', error);
      Swal.fire('Erreur', 'Impossible de récupérer les événements.', 'error');
    });
  }
}
