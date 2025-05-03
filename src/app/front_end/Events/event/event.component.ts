
import { Event } from '../../pages/models/event';
import {Component, OnInit} from "@angular/core";
import {EventService} from "../../../services/event.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  today: Date = new Date(); // Current date

  Events: any[] = [];

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  isEventInPast(eventDate: any): boolean {
    const eventDateObj = new Date(eventDate);
    return eventDateObj < this.today; // Check if the event date is in the past
  }
  getEvents(): void {

    this.eventService.getAllevents().subscribe((data: Event[]) => {
      this.events = data;
      this.filteredEvents = data;
      console.log("Événements récupérés :", this.events); // Vérification
    });
  }

  searchEvents(term: string): void {
    if (term) {
      this.filteredEvents = this.events.filter(event => event.nomEvent.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.filteredEvents = this.events;
    }


  }


  findEventsNearMe(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

         
          const radius = 80; // Search radius in kilometers
          this.eventService.getEventsNear(latitude, longitude, radius).subscribe(events => {
            console.log('Nearby events:', events);

            if (events.length > 0) {
              this.filteredEvents = events; // Update the filteredEvents array
            } else {
              alert('No events found near your location.');
            }
          });
        },
        (error) => {
          console.error('Geolocation error', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
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
