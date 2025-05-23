
import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import { Router } from '@angular/router';
import { Event } from '../../pages/models/event';

@Component({
  selector: 'ajout-event',
  templateUrl: './ajout-event.component.html',
  styleUrls: ['./ajout-event.component.css']
})

export class AjoutEventComponent implements OnInit {
  event: Event = new Event();
  minDate: string = '';
  selectedFile: File | null = null;

  constructor(private eventService: EventService, private router: Router) {
  }

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Set minDate to today's date in YYYY-MM-DD format
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addEvent() {
    if (!this.selectedFile) {
      alert('Please select an image for the event.');
      return;
    }

    this.eventService.addEvent(this.event, this.selectedFile).subscribe(
      response => {
        console.log('Event added successfully', response);
        this.router.navigate(['/list-event']);
      },
      error => {
        console.error('Error adding event', error);
      }
    );
  }
}

