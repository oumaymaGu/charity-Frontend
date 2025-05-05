import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/front_end/pages/models/user';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-list-inscription',
  templateUrl: './list-inscription.component.html',
  styleUrls: ['./list-inscription.component.css']
})
export class ListInscriptionComponent implements OnInit {
  users: User[] = [];
  eventId!: number;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.getUsersByEventId(this.eventId);
  }

  getUsersByEventId(eventId: number): void {
    this.eventService.getUsersByEventId(eventId).subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUserFromEvent(email: string): void {
    if (confirm(`Are you sure you want to remove the user with email ${email} from the event?`)) {
      this.eventService.deassignUserToEventByEmail(email, this.eventId).subscribe(
        () => {
          console.log(`User with email ${email} removed from event ${this.eventId}`);
          this.getUsersByEventId(this.eventId); // Refresh the user list
        },
        (error: any) => {
          console.error('Error removing user from event:', error);
        }
      );
    }
  }
}