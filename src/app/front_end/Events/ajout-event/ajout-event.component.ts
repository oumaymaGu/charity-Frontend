import { Component } from '@angular/core';
import { EventService } from '../../pages/service/event.service';
import { Router } from '@angular/router';
import { Event } from '../../pages/models/event';

@Component({
  selector: 'ajout-event',
  templateUrl: './ajout-event.component.html',
  styleUrls: ['./ajout-event.component.css']
})
export class AjoutEventComponent {
  event: Event = new Event();

  constructor(private eventService: EventService, private router: Router) {}

  addEvent() {
    this.eventService.addEvent(this.event).subscribe(
      response => {
        console.log('Event added successfully', response);
        this.router.navigate(['/event']);
      },
      error => {
        console.error('Error adding event', error);
      }
    );
  }
}