import { Component } from '@angular/core';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showNotificationsPanel = false;
  filteredNotifications: Observable<any[]>;

  constructor(public notificationService: NotificationService) {
    this.filteredNotifications = this.notificationService.notifications$.pipe(
      map(notifications => notifications.filter(n => 
        !(n.type === 'DON_MATERIEL' && n.message.includes('Non spécifié'))
      ))
    );
  }

  toggleNotificationsPanel() {
    this.showNotificationsPanel = !this.showNotificationsPanel;
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'DON_MATERIEL': 'fas fa-box-open',
      'DON_FINANCIER': 'fas fa-money-bill-wave',
      'STRIPE_PAYMENT': 'fab fa-cc-stripe'
    };
    return icons[type] || 'fas fa-bell';
  }

  getNotificationTitle(notification: any): string {
    const titles: { [key: string]: string } = {
      'DON_MATERIEL': 'Don Matériel',
      'STRIPE_PAYMENT': 'Paiement Stripe'
    };
    return titles[notification.type] || notification.type;
  }

  clearAllNotifications() {
    if (confirm('Voulez-vous vraiment effacer toutes les notifications ?')) {
      this.notificationService.notifications$.pipe(
        map(notifications => {
          notifications.forEach(notification => {
            this.notificationService.deleteNotification(notification.id).subscribe();
          });
        })
      ).subscribe();
    }
  }

  removeNotification(event: Event, notificationId: number) {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId).subscribe();
  }
}