import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, tap, switchMap } from 'rxjs/operators';

interface Notification {
  id: number;
  message: string;
  type: 'DON_MATERIEL' | 'DON_FINANCIER' | 'STRIPE_PAYMENT';
  timestamp: string;
  isRead: boolean;
  don_id?: number;
  stripe_payment_id?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Ajout de la stratégie OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  showNotificationsPanel = true;
  filteredNotifications: Observable<Notification[]> | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredNotifications = this.notificationService.notifications$.pipe(
      tap(notifications => {
        console.log('Notifications reçues dans filteredNotifications:', notifications);
        this.cdr.markForCheck(); // Utilisation de markForCheck au lieu de detectChanges
      }),
      takeUntil(this.destroy$)
    );
  }

  toggleNotificationsPanel(): void {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    console.log('Panneau de notifications visible:', this.showNotificationsPanel);
    this.cdr.markForCheck();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      DON_MATERIEL: 'fas fa-box-open',
      DON_FINANCIER: 'fas fa-money-bill-wave',
      STRIPE_PAYMENT: 'fab fa-cc-stripe'
    };
    return icons[type] || 'fas fa-bell';
  }

  getNotificationTitle(notification: Notification): string {
    const titles: { [key: string]: string } = {
      DON_MATERIEL: 'Don Matériel',
      STRIPE_PAYMENT: 'Paiement Stripe'
    };
    return titles[notification.type] || notification.type;
  }

  clearAllNotifications(): void {
    if (confirm('Voulez-vous vraiment effacer toutes les notifications ?')) {
      this.notificationService.notifications$
        .pipe(
          takeUntil(this.destroy$),
          switchMap((notifications: Notification[]) => {
            const deleteObservables = notifications.map(notification =>
              this.notificationService.deleteNotification(notification.id)
            );
            return deleteObservables.length > 0
              ? of(...deleteObservables).pipe(
                  tap(() => console.log('Notification supprimée'))
                )
              : of(null);
          })
        )
        .subscribe({
          complete: () => {
            console.log('Toutes les notifications ont été supprimées');
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Erreur lors de la suppression de toutes les notifications:', err)
        });
    }
  }

  removeNotification(event: Event, notificationId: number): void {
    event.stopPropagation();
    console.log(`Clic détecté pour supprimer la notification ${notificationId}`);
    this.notificationService.deleteNotification(notificationId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        console.log(`Notification ${notificationId} supprimée avec succès`);
        this.cdr.markForCheck(); // Utilisation de markForCheck
      },
      error: (err) => console.error(`Erreur lors de la suppression de la notification ${notificationId}:`, err)
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        console.log(`Notification ${notificationId} marquée comme lue`);
        this.cdr.markForCheck(); // Utilisation de markForCheck
      },
      error: (err) => console.error(`Erreur lors du marquage de la notification ${notificationId} comme lue:`, err)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}