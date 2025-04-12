import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';
import { Subscription } from 'rxjs';

interface DonNotification {
  id: number;
  message: string;
  type: 'DON_MATERIEL' | 'DON_FINANCIER' | 'STRIPE_PAYMENT';
  timestamp: string;
  isRead: boolean;
  donationId?: number;
  stripePaymentId?: number;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: DonNotification[] = [];
  unreadCount = 0;
  private notificationSub!: Subscription;
  private unreadCountSub!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.setupNotificationListener();
    this.setupUnreadCountListener();
  }

  private setupNotificationListener(): void {
    this.notificationSub = this.notificationService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateUnreadCount();
      },
      error: (err) => console.error('Notification error:', err)
    });
  }

  private setupUnreadCountListener(): void {
    this.unreadCountSub = this.notificationService.getUnreadCount().subscribe({
      next: (count) => this.unreadCount = count,
      error: (err) => console.error('Unread count error:', err)
    });
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notification: DonNotification): void {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      error: (err) => console.error('Mark as read failed:', err)
    });
  }

  deleteNotification(notification: DonNotification, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.notificationService.deleteNotification(notification.id).subscribe({
      error: (err) => console.error('Delete failed:', err)
    });
  }

  getNotificationIcon(type: string): string {
    const icons = {
      'DON_MATERIEL': 'fas fa-box-open',
      'DON_FINANCIER': 'fas fa-money-bill-wave',
      'STRIPE_PAYMENT': 'fab fa-cc-stripe'
    } as const;
    return icons[type as keyof typeof icons] || 'fas fa-bell';
  }

  getNotificationClass(type: string): string {
    const classes = {
      'DON_MATERIEL': 'material-notification',
      'DON_FINANCIER': 'financial-notification',
      'STRIPE_PAYMENT': 'stripe-notification'
    } as const;
    return classes[type as keyof typeof classes] || 'default-notification';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
    this.unreadCountSub?.unsubscribe();
  }
  get filteredNotifications() {
    return this.notifications.filter(notification => {
      // Exclusion des dons non spécifiés
      if (notification.type === 'DON_MATERIEL' && 
          notification.message.includes('Non spécifié')) {
        return false;
      }
      
      // Exclusion des doublons
      const firstOccurrence = this.notifications.find(n => 
        n.type === notification.type && 
        n.message === notification.message
      );
      
      return firstOccurrence?.id === notification.id;
    });
  }
}