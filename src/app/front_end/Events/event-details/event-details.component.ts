import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
// @ts-ignore
import { EventModel } from '../../../models/event.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: EventModel | undefined;
  location: string = '';
  eventDate: string = '';
  isLoggedIn: boolean = false;
  Events: any[] = [];
  userName: string = '';
  username: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
     private authService: AuthService
  ) {}

  
  rejoindreEvent(eventId: number): void {
 
     console.log(`Joining event with ID: ${eventId}`);
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
      this.username = this.authService.getUsername();

    }
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}