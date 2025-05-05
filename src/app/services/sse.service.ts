import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  constructor(private zone: NgZone) {}

  getServerSentEvent(url: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data);
            observer.next(data);
          } catch (error) {
            console.error('Erreur lors du parsing de la notification:', error);
            observer.error(error);
          }
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          console.error('Erreur SSE:', error);
          observer.error(error);
          eventSource.close();
        });
      };

      eventSource.onopen = () => {
        console.log('Connexion SSE établie');
      };

      return () => {
        eventSource.close();
        console.log('Connexion SSE fermée');
      };
    });
  }
}