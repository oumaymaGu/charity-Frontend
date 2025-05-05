import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  conversations: { senderId: number; senderUsername: string; idAss: number | null }[] = [];

  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private wsService: WebSocketService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Récupération du nom d'utilisateur
    this.username = this.authService.getUsername();

    // Chargement des conversations du localStorage
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      this.conversations = JSON.parse(savedConversations);
    }

    // Souscription aux messages WebSocket
    this.wsService.messages$.subscribe((msg) => {
      if (msg) {
        const safeSenderUsername = msg.senderUsername ?? 'Inconnu';
        const exists = this.conversations.find(
          (c) => c.senderId === msg.senderId && c.idAss === msg.idAss
        );

        if (!exists) {
          this.conversations.unshift({
            senderId: msg.senderId,
            senderUsername: safeSenderUsername,
            idAss: msg.idAss ?? null
          });

          localStorage.setItem('conversations', JSON.stringify(this.conversations));
        }
      }
    });

    // Connexion WebSocket en tant qu'admin
    this.wsService.connectAsAdmin();
  }

  // Ouvrir une discussion
  openChat(senderId: number, username: string, idAss: number | null): void {
    window.location.href = `/chat-admin?senderId=${senderId}&username=${username}&idAss=${idAss}`;
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
  }

  // Toggle de la zone de notification
  onToggleNotifications(): void {
    this.toggleNotifications.emit();
  }
}
