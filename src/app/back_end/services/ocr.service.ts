import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { MedicationInfo } from 'src/app/front_end/pages/models/medication-info';
 // Correct import

@Injectable({
  providedIn: 'root'
})
export class OcrService implements OnDestroy {
  private stompClient!: Client;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private readonly serverUrl = 'http://localhost:8089/ws-charity';
  private destroy$ = new Subject<void>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    try {
      const socket = new SockJS(this.serverUrl, null, {
        transports: ['websocket', 'xhr-streaming']
      });

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.debug('STOMP: ' + str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      this.stompClient.onConnect = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.connectionStatus.next(true);
      };

      this.stompClient.onStompError = (frame) => {
        console.error('WebSocket Error:', frame.headers['message']);
        this.handleConnectionError();
      };

      this.stompClient.onWebSocketError = (event) => {
        console.error('WebSocket Error:', event);
        this.handleConnectionError();
      };

      this.stompClient.activate();
    } catch (error) {
      console.error('WebSocket Initialization Error:', error);
      this.handleConnectionError();
    }
  }

  private handleConnectionError(): void {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.initializeWebSocketConnection(), 5000);
    } else {
      console.error('Max reconnection attempts reached');
      this.connectionStatus.next(false);
    }
  }

  scanMedication(file: File): Observable<MedicationInfo> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<MedicationInfo>('http://localhost:8089/api/ocr/scan-medication', formData).pipe(
      catchError(err => throwError(err))
    );
  }

  processImage(file: File): Observable<any> {
    return new Observable(observer => {
      const connectionSubscription = this.connectionStatus.subscribe(isConnected => {
        if (!isConnected) {
          observer.error('WebSocket not connected. Please try again.');
          return;
        }

        const formData = new FormData();
        formData.append('image', file);

        this.http.post<{ processId: string }>(
          'http://localhost:8089/api/ocr/process-async',
          formData,
          { withCredentials: true }
        ).pipe(
          catchError(err => {
            observer.error('HTTP Error: ' + err.message);
            return throwError(err);
          })
        ).subscribe({
          next: (response) => {
            const subscription = this.stompClient.subscribe(
              `/topic/ocr-result/${response.processId}`,
              (message) => {
                try {
                  const result = JSON.parse(message.body);
                  observer.next(result);
                  observer.complete();
                } catch (e) {
                  observer.error('Invalid response format');
                }
                subscription.unsubscribe();
              }
            );
          },
          error: (err) => observer.error(err)
        });
      });

      return () => {
        connectionSubscription.unsubscribe();
      };
    });
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}