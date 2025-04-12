import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, retry, takeUntil, tap } from 'rxjs/operators';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

interface Notification {
  id: number;
  message: string;
  type: 'DON_MATERIEL' | 'DON_FINANCIER' | 'STRIPE_PAYMENT';
  timestamp: string;
  isRead: boolean;
  donationId?: number;
  stripePaymentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private stompClient!: Client;
  private subscription: StompSubscription | null = null;
  private apiUrl = `${environment.apiUrl}/notifications`;
  private destroy$ = new Subject<void>();
  private readonly RECONNECT_DELAY = 5000;
  private connectionPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
    this.loadInitialNotifications();
  }

  private initializeWebSocket(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-charity`),
      reconnectDelay: this.RECONNECT_DELAY,
      debug: (str) => console.debug('[STOMP]', str),
      onConnect: () => this.handleConnectionSuccess(),
      onStompError: (frame) => this.handleStompError(frame),
      onWebSocketClose: () => this.handleWebSocketClose(),
      onWebSocketError: (error) => this.handleWebSocketError(error)
    });

    this.stompClient.activate();
  }

  private handleConnectionSuccess(): void {
    console.log('WebSocket connected successfully');
    this.subscribeToNotifications();
    if (this.connectionPromise) {
      const resolve = this.connectionPromise as any;
      resolve();
      this.connectionPromise = null;
    }
  }

  private handleStompError(frame: any): void {
    console.error('STOMP protocol error:', frame.headers.message);
  }

  private handleWebSocketClose(): void {
    console.log('WebSocket connection closed');
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private handleWebSocketError(error: any): void {
    console.error('WebSocket error:', error);
  }

  private subscribeToNotifications(): void {
    this.subscription = this.stompClient.subscribe(
      '/topic/notifications',
      (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body);
          this.addNotification(notification);
        } catch (e) {
          console.error('Error parsing notification:', e);
        }
      }
    );
  }

  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    if (!current.some(n => n.id === notification.id)) {
      this.notificationsSubject.next([notification, ...current]);
    }
  }

  private loadInitialNotifications(): void {
    this.http.get<Notification[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleHttpError)
    ).subscribe({
      next: (notifs) => this.notificationsSubject.next(notifs),
      error: (err) => console.error('Failed to load initial notifications:', err)
    });
  }

  public waitForConnection(): Promise<void> {
    if (this.stompClient.connected) {
      return Promise.resolve();
    }
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve) => {
        const checkConnection = () => {
          if (this.stompClient.connected) {
            resolve();
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }
    return this.connectionPromise;
  }

  public sendNotification(destination: string, body: any): void {
    this.waitForConnection().then(() => {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body)
      });
    });
  }

  public markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        const updated = this.notificationsSubject.value.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(updated);
      }),
      catchError(this.handleHttpError)
    );
  }

  public deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updated = this.notificationsSubject.value.filter(n => n.id !== id);
        this.notificationsSubject.next(updated);
      }),
      catchError(this.handleHttpError)
    );
  }

  public getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.isRead).length)
    );
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP error occurred:', error);
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription?.unsubscribe();
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
  private handleNotification(message: any): void {
    // Exclure les dons non spécifiés et les doublons
    if (message.type === 'DON_MATERIEL') {
      if (message.message.includes('Non spécifié')) return;
      
      const duplicate = this.notificationsSubject.value.find(n => 
        n.type === 'DON_MATERIEL' && 
        n.message === message.message &&
        new Date(n.timestamp).getTime() > Date.now() - 300000 // 5 minutes
      );
      
      if (duplicate) return;
    }

    this.notificationsSubject.next([
      message,
      ...this.notificationsSubject.value
    ]);
  }
}
  

