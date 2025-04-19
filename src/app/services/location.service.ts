import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations = [
    { lat: 48.8566, lng: 2.3522 }, // Paris
    { lat: 48.8584, lng: 2.2945 }, // Tour Eiffel
    { lat: 48.8606, lng: 2.3376 }  // Musée du Louvre
  ];

  constructor() {}

  getRealTimeLocation(): Observable<{ lat: number; lng: number }> {
    let index = 0;
    return new Observable(observer => {
      setInterval(() => {
        observer.next(this.locations[index]);
        index = (index + 1) % this.locations.length; // Boucle sur les positions
      }, 3000); // Mise à jour toutes les 3 secondes
    });
  }
}