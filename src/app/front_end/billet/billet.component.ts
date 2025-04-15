import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Billet } from '../../services/event.service';

@Component({
  selector: 'app-billet',
  templateUrl: './billet.component.html',
  styleUrls: ['./billet.component.css']
})
export class BilletComponent implements OnInit {
  billet?: Billet;
  billetUrl: string = '';

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.eventService.getBillet(eventId, userId).subscribe(
      (billet) => {
        this.billet = billet;
       this.billetUrl = `http://192.168.1.100:4200/billet/${billet.id}`;      },
      (error) => {
        console.error("Erreur lors de la récupération du billet", error);
      }
    );
  }

  printBillet(): void {
    window.print();
  }
}