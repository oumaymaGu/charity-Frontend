import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Event } from '../front_end/pages/models/event'; 

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  idEvent!: number;
  event?: Event & { prixevent?: number };
  user: any = {};
  totalAmount: number = 0;
  userId!: number; // Add a property to store the user ID
  validationMessage: string = ''; // Add a property for the validation message

  constructor(private route: ActivatedRoute, private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.idEvent = Number(this.route.snapshot.paramMap.get('id'));
    this.getEventDetails(this.idEvent);
    this.loadUserData();
  }

  getEventDetails(eventId: number) {
    this.eventService.getEventById(eventId).subscribe(
      (data: Event) => {
        this.event = data;
      },
      (error: any) => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  loadUserData() {
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    if (email && username) {
      this.user.email = email;
      this.user.username = username; 
      // Retrieve userId from the backend
      this.eventService.getUserIdByEmail(email).subscribe(
        (userId: number) => {
          this.userId = userId;
        },
        (error: any) => {
          console.error('Error fetching user ID:', error);
        }
      );
    }
  }

  validerInscription(form: NgForm) {
    const user = {
      username: form.value.nom,
      email: form.value.email,
      ticket: form.value.tickets
    };

    console.log("Inscription validée pour l'événement", this.idEvent);
    this.assignUserToEvent(this.userId, this.idEvent); // Use the stored user ID
  }

  assignUserToEvent(userId: number, eventId: number) {
    this.eventService.assignUserToEvent(userId, eventId)
      .subscribe(response => {
        console.log('User assigned to event:', response);
        this.validationMessage = 'Registration successful!'; // Set the validation message
      }, error => {
        console.error('Error assigning user to event:', error);
      });
  }

  // New method to deassign a user from the event
  deassignUserFromEvent(email: string, eventId: number) {
    if (confirm(`Are you sure you want to cancel your registration for this event?`)) {
      this.eventService.deassignUserToEventByEmail(email, eventId)
        .subscribe(response => {
          console.log(`User with email ${email} deassigned from event ${eventId}`);
          this.validationMessage = 'You have been successfully removed from the event.';
        }, error => {
          console.error('Error deassigning user from event:', error);
        });
    }
  } 
}