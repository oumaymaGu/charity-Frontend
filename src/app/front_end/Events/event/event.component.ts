import { Component, OnInit } from '@angular/core';
import { EventService } from '../../pages/service/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: any[] = [];


  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getAllevents().subscribe((res: any) => {
      this.events = res;
      console.log(res);
    });
  }

  viewEventDetails(event: any): void {
    this.router.navigate(['/event-details', event.idEvent]);
  }}