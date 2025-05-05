import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError, of, EMPTY } from 'rxjs';
import { catchError, map, retry, takeUntil, tap, shareReplay } from 'rxjs/operators';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  type: 'DON_MATERIEL' | 'DON_FINANCIER' | 'STRIPE_PAYMENT';
  timestamp: string;
  isRead: boolean;
  don_id?: number;
  stripe_payment_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  [x: string]: any;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]>;
  private stompClient!: Client;
  private subscription: StompSubscription | null = null;
  private apiUrl = `${environment.apiUrl}/notifications`;
  private destroy$ = new Subject<void>();
  private readonly RECONNECT_DELAY = 5000;
  private connectionPromise: Promise<void> | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.notifications$ = this.notificationsSubject.asObservable().pipe(
      tap(notifications => console.log('Notifications émises par notifications$:', notifications)),
      shareReplay(1)
    );
    this.loadInitialNotifications();
    this.initializeWebSocket();
  }

  private loadInitialNotifications(): void {
    this.http.get<Notification[]>(this.apiUrl).pipe(
      retry(2),
      tap(notifs => {
        console.log('Notifications initiales chargées:', notifs);
        if (!notifs || notifs.length === 0) {
          console.warn('Aucune notification trouvée dans la réponse de l’API.');
        }
        this.notificationsSubject.next(notifs);
      }),
      catchError(err => {
        console.error('Erreur lors du chargement des notifications initiales:', err);
        this.notificationsSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  private reloadNotifications(): void {
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
    console.log('WebSocket connecté avec succès');
    this.subscribeToNotifications();
    if (this.connectionPromise) {
      const resolve = this.connectionPromise as any;
      resolve();
      this.connectionPromise = null;
    }
  }

  private handleStompError(frame: any): void {
    console.error('Erreur de protocole STOMP:', frame.headers.message);
  }

  private handleWebSocketClose(): void {
    console.log('Connexion WebSocket fermée');
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private handleWebSocketError(error: any): void {
    console.error('Erreur WebSocket:', error);
  }

  private subscribeToNotifications(): void {
    this.subscription = this.stompClient.subscribe(
      '/topic/notifications',
      (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          console.log('Notification WebSocket reçue:', notification);
          this.addWebSocketNotification(notification);
          this.showToastNotification(notification);
        } catch (e) {
          console.error('Erreur lors de l\'analyse de la notification:', e);
        }
      }
    );
  }

  private addWebSocketNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.getValue();
    if (!currentNotifications.some(n => n.id === notification.id)) {
      this.notificationsSubject.next([notification, ...currentNotifications]);
    }
  }

  private showToastNotification(notification: Notification): void {
    const isOnDashboard = this.router.url.includes('/dash');
    if (!isOnDashboard) {
      console.log('Notification received but not on dashboard, skipping toast:', notification);
      return;
    }

    let message = notification.message;
    let action = 'Fermer';
    let panelClass = '';

    switch (notification.type) {
      case 'STRIPE_PAYMENT':
        panelClass = 'stripe-notification-toast';
        break;
      case 'DON_FINANCIER':
        panelClass = 'financial-notification-toast';
        break;
      case 'DON_MATERIEL':
        panelClass = 'material-notification-toast';
        break;
    }

    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: [panelClass, 'notification-toast'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
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

  public markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        const updated = this.notificationsSubject.getValue().map((n: Notification) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        console.log('Notifications après marquage comme lu:', updated);
        this.notificationsSubject.next(updated);
        this.reloadNotifications();
      }),
      catchError(err => {
        if (err.status === 404) {
          const updated = this.notificationsSubject.getValue().map((n: Notification) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          this.notificationsSubject.next(updated);
          this.reloadNotifications();
          return EMPTY;
        }
        return this.handleHttpError(err);
      })
    );
  }

  public deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.getValue();
        console.log('Notifications avant suppression:', currentNotifications);
        const updated = currentNotifications.filter((n: Notification) => n.id !== id);
        console.log('Notifications après suppression:', updated);
        this.notificationsSubject.next(updated);
        this.reloadNotifications();
      }),
      catchError(err => {
        if (err.status === 404) {
          const currentNotifications = this.notificationsSubject.getValue();
          const updated = currentNotifications.filter((n: Notification) => n.id !== id);
          this.notificationsSubject.next(updated);
          this.reloadNotifications();
          return EMPTY;
        }
        return this.handleHttpError(err);
      })
    );
  }

  public getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.isRead).length)
    );
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur HTTP survenue:', error);
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur côté serveur: ${error.status} ${error.message}`;
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
}