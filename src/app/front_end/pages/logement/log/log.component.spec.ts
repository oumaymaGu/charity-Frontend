import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Import your SSE service if it exists
// If not, we'll need to create one
import { SseService } from 'src/app/services/sse.service';

interface Notification {
  id: number;
  message: string;
  date: string;
  lu: boolean;
}

@Component({
  selector: 'app-service',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class ServiceComponent implements OnInit, OnDestroy {
  // Add the notifications property
  notifications: Notification[] = [];
  private sseSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private sseService: SseService
  ) {}

  ngOnInit(): void {
    // Fetch existing notifications
    this.fetchNotifications();
    
    // Subscribe to new notifications via SSE
    this.setupSSEConnection();
  }

  ngOnDestroy(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }

  // Add the missing methods
  setupSSEConnection(): void {
    this.sseSubscription = this.sseService
      .getServerSentEvent('http://localhost:8080/notificationrefuge/stream')
      .subscribe({
        next: (message) => {
          console.log("🔔 New notification received:", message);
          this.handleNewNotification(message);
        },
        error: (err) => {
          console.error('SSE Error', err);
          // Try to reconnect after a delay
          setTimeout(() => this.setupSSEConnection(), 5000);
        }
      });
  }

  fetchNotifications(): void {
    this.http.get<Notification[]>('http://localhost:8080/notificationrefuge')
      .subscribe({
        next: (data) => {
          // Get only unread notifications, sorted by date (newest first)
          this.notifications = data
            .filter(notification => !notification.lu)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
        }
      });
  }

  handleNewNotification(message: string): void {
    // Create a notification object
    const newNotification: Notification = {
      id: 0, // Temporary ID
      message: message,
      date: new Date().toISOString(),
      lu: false
    };
    
    // Add to the start of the array
    this.notifications.unshift(newNotification);
    
    // Refresh notifications from server to get the real ID
    setTimeout(() => this.fetchNotifications(), 1000);
  }

  // Add the markAsRead method that's referenced in the template
  markAsRead(id: number): void {
    this.http.post<any>(`http://localhost:8080/notificationrefuge/mark-as-read/${id}`, {})
      .subscribe({
        next: () => {
          // Remove from UI list
          this.notifications = this.notifications.filter(n => n.id !== id);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
  }
}