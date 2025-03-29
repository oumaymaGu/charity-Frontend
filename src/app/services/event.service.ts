import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../front_end/pages/models/event';
import { User } from '../front_end/pages/models/user';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url = 'http://localhost:8089/event';
  userUrl = 'http://localhost:8089/api/auth';
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
  findByNomEvent(nomEvent: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.url}?nomEvent=${nomEvent}`);
  }
  assignUserToEvent(userId: number, eventId: number): Observable<any> {
    return this.http.put(`${this.userUrl}/affecter-user-to-event/${userId}/${eventId}`, {});
  } 

  getEventsByUserId(userId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.userUrl}/get-events-by-user/${userId}`);
  }

  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${this.userUrl}/getUserIdByEmail?email=${email}`);
  }
  
  getUsersByEventId(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/${eventId}/users`);
  }
 
  deassignUserToEventByEmail(email: string, eventId: number): Observable<any> {
    return this.http.delete(`${this.userUrl}/deaffecter-user-from-event/${email}/${eventId}`, {});
  }
  getEventsNear(latitude: number, longitude: number, radius: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/nearby`, {
      params: {
        latitude: latitude.toString(),  
        longitude: longitude.toString(), 
        radius: radius.toString()
      }
    });
  }
  
}