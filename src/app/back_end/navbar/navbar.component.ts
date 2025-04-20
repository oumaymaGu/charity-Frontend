import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  conversations: { senderId: number; senderUsername: string; idAss: number | null }[] = [];

  constructor(
    private authService: AuthService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Récupérer le nom d'utilisateur
    this.username = this.authService.getUsername();

    // Charger les conversations du localStorage
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      this.conversations = JSON.parse(savedConversations);
    }

    // Souscrire aux messages WebSocket
    this.wsService.messages$.subscribe((msg) => {
      if (msg) {
        // Si senderUsername est manquant ou undefined, définir 'Inconnu'
        const safeSenderUsername = msg.senderUsername ?? 'Inconnu';

        // Vérifier si cette conversation existe déjà
        const exists = this.conversations.find(
          (c) => c.senderId === msg.senderId && c.idAss === msg.idAss
        );

        // Si la conversation n'existe pas, on l'ajoute
        if (!exists) {
          this.conversations.unshift({
            senderId: msg.senderId,
            senderUsername: safeSenderUsername, // Utilisation du nom d'utilisateur sécurisé
            idAss: msg.idAss ?? null, // Associer l'ID de l'association (ou null si absent)
          });

          // Sauvegarder les conversations dans le localStorage
          localStorage.setItem('conversations', JSON.stringify(this.conversations));
        }
      }
    });

    // Se connecter au WebSocket pour l'admin
    this.wsService.connectAsAdmin();
  }

  // Ouvrir la conversation de chat
  openChat(senderId: number, username: string, idAss: number | null): void {
    console.log(`Ouverture du chat avec ${username} pour l'association ${idAss}`);
    window.location.href = `/chat-admin?senderId=${senderId}&username=${username}&idAss=${idAss}`;
  }
  

  // Déconnexion de l'utilisateur
  logout(): void {
    this.authService.logout();
  }
}
