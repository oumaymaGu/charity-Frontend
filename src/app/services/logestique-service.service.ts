import { Injectable } from '@angular/core';
import { Logistique } from '../front_end/pages/models/Logestique';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogestiqueServiceService {
  // Removed duplicate implementation of getEventsWithLogestiques
  url = 'http://localhost:8089/logestique';

  constructor(private http: HttpClient) { }

  getAlllogestique(): Observable<Logistique[]> {
    return this.http.get<Logistique[]>(this.url + "/retrieve-all-log");
  }
     getlogById(id: any): Observable<Logistique> {
      return this.http.get<Logistique>(this.url + "/get-log/" + id);
    }
  
    addlog(logestique: Logistique): Observable<Logistique> {
      return this.http.post<Logistique>(this.url + "/add-log", logestique);
    }
  
    updateLogestique(logestique: Logistique): Observable<Logistique> {
      return this.http.put<Logistique>(this.url + "/modifylog", logestique);
    }
  
    deleteLogestique(id: any): Observable<void> {
      return this.http.delete<void>(this.url + "/remove-log/" + id);
    }


  findByRessourceName(ressourceName: string): Observable<Logistique[]> {
    return this.http.get<Logistique[]>(`${this.url}?ressourceName=${ressourceName}`);
  }
  assignLogToEvent(logestiqueId: number, eventId: number): Observable<Logistique> {
    return this.http.post<Logistique>(`${this.url}/${logestiqueId}/assign-to-event/${eventId}`, {});
  }
  assignLogToEventWithQuantity(idlogestique: number, idEvent: number, quantity: number) {
    return this.http.post(`${this.url}/${idlogestique}/assign-to-event/${idEvent}?quantity=${quantity}`, {});
  }
      
  
  
  
}