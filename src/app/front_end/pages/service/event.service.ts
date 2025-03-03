import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url = 'http://localhost:8089/event';
  constructor(private http: HttpClient) { }

  getAllevents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.url + "/retrieve-all-Events");
  }

  getEventById(id: any): Observable<Event> {
    return this.http.get<Event>(this.url + "/get-event/" + id);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.url + "/add-Event", event);
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(this.url + "/modifyEvent", event);
  }

  deleteEvent(id: any): Observable<void> {
    return this.http.delete<void>(this.url + "/remove-event/" + id);
  }
}