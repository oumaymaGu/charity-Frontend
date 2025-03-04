import { Component } from '@angular/core';
import { EventService } from '../../pages/service/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'card-event',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
  events: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.eventService.getAllevents().subscribe((res) => {
      this.events = res;
      console.log(res);
    });
  }

  editEvent(event: any): void {
    // Navigate to the edit event page with the event id
    this.router.navigate(['/edit-event', event.idEvent]);
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe(
      response => {
        console.log('Event deleted successfully', response);
        this.getEvents(); // Refresh the list of events
      },
      error => {
        console.error('Error deleting event', error);
      }
    );
  }

  getEvents(): void {
    this.eventService.getAllevents().subscribe((res) => {
      this.events = res;
      console.log(res);
    });
  }
}
