import { Component, OnInit } from '@angular/core';
import { SseService } from 'src/app/services/sse.service';

@Component({
  selector: 'app-notifications-refuge',
  templateUrl: './notifications-refuge.component.html',
  styleUrls: ['./notifications-refuge.component.css']
})
export class NotificationsRefugeComponent implements OnInit {

  notifications: string[] = [];
  isPopupVisible: boolean = false;

  constructor(private sseService: SseService) {}

  ngOnInit(): void {
    this.sseService.getServerSentEvent('http://localhost:8089/notificationrefuge/stream')
      .subscribe({
        next: (message) => {
          console.log("🔔 Nouvelle notification reçue :", message);
          this.notifications.unshift(message);
        },
        error: (err) => {
          console.error('Erreur SSE', err);
        }
      });
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }
}
