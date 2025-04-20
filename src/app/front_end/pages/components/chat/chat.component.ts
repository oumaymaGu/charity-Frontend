import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface Message {
  senderId: number;
  receiverId: number;
  senderUsername?: string;
  content: string;
  timestamp: string;
  idAss?: number | null;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  senderId = 0;
  receiverId = 1; // Admin ID
  idAss: number | null = null;
  messageContent = '';
  messages: Message[] = [];
  senderUsername = '';
  isLoading = false;
  private messageSub?: Subscription;

  constructor(
    private wsService: WebSocketService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const idParam = params['associationId'];
      this.idAss = idParam && !isNaN(+idParam) ? +idParam : null;

      this.senderId = this.getLoggedInUserId();
      this.senderUsername = localStorage.getItem('username') || 'Utilisateur';

      if (this.idAss !== null) {
        this.loadConversation();
        this.wsService.connect(this.senderId, this.idAss);
        this.messageSub = this.wsService.messages$.subscribe((msg: Message | null) => {
          if (
            msg &&
            msg.idAss === this.idAss &&
            ((msg.senderId === this.senderId && msg.receiverId === this.receiverId) ||
              (msg.receiverId === this.senderId && msg.senderId === this.receiverId))
          ) {
            this.messages.push(msg);
            this.scrollToBottom();
          }
        });
      } else {
        console.warn('Paramètre idAss manquant ou invalide');
      }
    });
  }

  loadConversation(): void {
    this.isLoading = true;
    this.http
      .get<Message[]>(
        `http://localhost:8089/api/messages/conversation?userId1=${this.senderId}&userId2=${this.receiverId}&idAss=${this.idAss}`
      )
      .subscribe({
        next: (res) => {
          this.messages = res;
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors du chargement de la conversation :', err);
        },
      });
  }

  send(): void {
    if (this.messageContent.trim() && this.idAss !== null) {
      const newMsg: Message = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        content: this.messageContent,
        timestamp: new Date().toISOString(),
        idAss: this.idAss,
        senderUsername: this.senderUsername,
      };

      this.wsService.sendMessage(newMsg as {
        senderId: number;
        receiverId: number;
        idAss: number;
        content: string;
        timestamp?: string;
      });

      this.messages.push(newMsg);
      this.messageContent = '';
      setTimeout(() => this.scrollToBottom(), 100);
    } else {
      console.warn('Message vide ou association non définie');
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.getElementById('messageContainer');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  getLoggedInUserId(): number {
    const idFromStorage = localStorage.getItem('idUser');
    return idFromStorage ? parseInt(idFromStorage, 10) : 0;
  }

  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
    this.wsService.disconnect();
  }
}
