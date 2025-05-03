import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../pages/models/event';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  event: Event = new Event();
  minDate!: string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Set minDate to today's date in YYYY-MM-DD format

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe(
        (data: any) => {
          this.event = data;
          this.event.dateEvent = new Date(this.event.dateEvent).toISOString().split('T')[0];
        },
        error => {
          console.error('Error fetching event', error);
        }
      );
    }
  }

  updateEvent(): void {
    if (this.event.prixevent <= 0) {
      alert('Price must be a positive number.');
      return;
    }

    if (new Date(this.event.dateEvent) < new Date(this.minDate)) {
      alert('Date cannot be in the past.');
      return;
    }

    this.eventService.updateEvent(this.event).subscribe(
      response => {
        console.log('Event updated successfully', response);
        this.router.navigate(['/list-event']);
      },
      error => {
        console.error('Error updating event', error);
      }
    );
  }
}