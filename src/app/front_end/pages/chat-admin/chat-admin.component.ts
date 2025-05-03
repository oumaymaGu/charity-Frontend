import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit, OnDestroy {
  @Input() selectedUserId: number | null = null;
  @Input() selectedUsername: string | null = null;
  @Input() selectedAssId: number | null = null;

  messages: Message[] = [];
  replyContent = '';

  // Les 3 infos passées en query params
  // Removed duplicate declaration of selectedUsername

  private messageSub?: Subscription;

  constructor(
    private wsService: WebSocketService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) On se connecte au topic admin
    this.wsService.connectAsAdmin();

    // 2) On lit les params de l'URL
    this.route.queryParams.subscribe(params => {
      this.selectedUserId   = params['senderId']  ? +params['senderId']  : null;
      this.selectedUsername = params['username']  || null;
      this.selectedAssId    = params['idAss']     ? +params['idAss']     : null;

      // Si on a tout, on charge l’historique
      if (this.selectedUserId !== null && this.selectedAssId !== null) {
        this.loadConversation();
      }
    });

    // 3) On écoute les nouveaux messages WebSocket
    this.messageSub = this.wsService.messages$.subscribe(msg => {
      if (!msg) return;
      // On filtre sur la même association et la même conversation
      if (
        msg.idAss === this.selectedAssId &&
        (msg.senderId === this.selectedUserId || msg.receiverId === this.selectedUserId)
      ) {
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });
  }

  // Charge l'historique via votre endpoint REST
  loadConversation(): void {
    // userId1=1 car admin=1, userId2=selectedUserId
    this.http
      .get<Message[]>(
        `http://localhost:8089/api/messages/conversation?userId1=1&userId2=${this.selectedUserId}&idAss=${this.selectedAssId}`
      )
      .subscribe({
        next: res => {
          this.messages = res;
          this.scrollToBottom();
        },
        error: err => console.error('Erreur conversation', err)
      });
  }

  // Envoi d’une réponse
  sendReply(): void {
    if (
      !this.replyContent.trim() ||
      this.selectedUserId == null ||
      this.selectedAssId == null
    ) {
      return;
    }
  
    const msg = {
      senderId: 1, // Admin
      receiverId: this.selectedUserId,
      content: this.replyContent,
      idAss: this.selectedAssId,
      timestamp: new Date().toISOString(),
      senderUsername: 'Admin'
    };
  
    this.wsService.sendMessage(msg);
  
    // ❌ On n’ajoute plus le message localement
    this.replyContent = '';
  }
  

  private scrollToBottom(): void {
    setTimeout(() => {
      const c = document.getElementById('adminMessageContainer');
      if (c) c.scrollTop = c.scrollHeight;
    }, 100);
  }

  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
    this.wsService.disconnect();
  }

  showEmojiPicker: boolean = false;

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
  console.log('Emoji picker ouvert:', this.showEmojiPicker);
}


addEmoji(event: any) {
  const emoji = event.emoji.native; // Récupère l'emoji sélectionné
  this.replyContent = (this.replyContent || '') + emoji; // Ajoute l'emoji au message
  console.log('Emoji ajouté:', emoji);
}

  
}