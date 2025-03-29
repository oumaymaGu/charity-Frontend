import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';

import { Event } from '../../pages/models/event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;

  location: string = '';  
  eventDate: string = '';  

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService,
   
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe((data: Event) => {
        this.event = data;
        console.log("Event details:", this.event); // Log event details for debugging
      });
    }
  }
}

