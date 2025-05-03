import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
// @ts-ignore
import { EventModel } from '../../../models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: EventModel | undefined;
  location: string = '';
  eventDate: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  
  rejoindreEvent(eventId: number): void {
 
     console.log(`Joining event with ID: ${Event}`);
     this.router.navigate(['/inscription', eventId]);
   }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe(
        (data: EventModel) => {
          this.event = data;
          console.log("Event details:", this.event);
        },
        error => {
          console.error("Error fetching event details", error);
        }
      );
    }
  }
}
