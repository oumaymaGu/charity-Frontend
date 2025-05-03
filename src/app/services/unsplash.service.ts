import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  private baseUrl = 'http://localhost:8089/livraison';
  private apiKey = 'Rz9k_4me1x68VA7bvCw-hRlIeSOma6XUwi195ZCb39k';

  constructor(private http: HttpClient) { }

  getRandomImage(query: string): Observable<string> {
    return this.http.get(this.baseUrl + '/get-random-image?query=' + query, { responseType: 'text' });
  }
  downloadImage(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }
}
