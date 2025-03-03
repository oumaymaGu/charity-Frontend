import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Router } from '@angular/router';
import { Event } from '../../pages/models/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getAllevents().subscribe((data: Event[]) => {
      this.events = data;
      this.filteredEvents = data;
    });
  }

  searchEvents(term: string): void {
    if (term) {
      this.filteredEvents = this.events.filter(event => event.nomEvent.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.filteredEvents = this.events;
    }
  }

  viewEventDetails(event: Event): void {
    this.router.navigate(['/event-details', event.idEvent]);
  }

  rejoindreEvent(eventId: number): void {

    console.log(`Joining event with ID: ${Event}`);
    this.router.navigate(['/inscription', eventId]);
  }
}