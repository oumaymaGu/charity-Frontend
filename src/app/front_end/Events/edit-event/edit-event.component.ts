import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../pages/service/event.service';
import { Event } from '../../pages/models/event';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  event: Event = new Event();

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe(
        (data: any) => {
          this.event = data;
        },
        error => {
          console.error('Error fetching event', error);
        }
      );
    }
  }

  updateEvent(): void {
    this.eventService.updateEvent(this.event).subscribe(
      response => {
        console.log('Event updated successfully', response);
        this.router.navigate(['/event']);
      },
      error => {
        console.error('Error updating event', error);
      }
    );
  }
}