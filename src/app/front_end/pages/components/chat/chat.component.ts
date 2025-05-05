import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';


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
  @Input() idAss: number | null = null; 
  senderId = 0;
  receiverId = 1; // Admin ID
  // Removed duplicate declaration of idAss
  messageContent = '';
  messages: Message[] = [];
  senderUsername = '';
  isLoading = false;
  private messageSub?: Subscription;
  audio = new Audio('assets/message.mp3');


  constructor(
    private wsService: WebSocketService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.idAss === null) {
      this.route.queryParams.subscribe((params) => {
        const idParam = params['associationId'];
        this.idAss = idParam && !isNaN(+idParam) ? +idParam : null;
        this.setupChat();
      });
    } else {
      this.setupChat();
    }
  }
  
  setupChat(): void {
    if (this.idAss !== null) {
      this.senderId = this.getLoggedInUserId();
      this.senderUsername = localStorage.getItem('username') || 'Utilisateur';
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

  isChatOpen: boolean = false;

toggleChat() {
  this.isChatOpen = !this.isChatOpen;
}

showEmojiPicker: boolean = false;

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
  console.log('Emoji picker ouvert:', this.showEmojiPicker);
}


addEmoji(event: any) {
  const emoji = event.emoji.native; // Récupère l'emoji sélectionné
  this.messageContent = (this.messageContent || '') + emoji; // Ajoute l'emoji au message
  console.log('Emoji ajouté:', emoji);
}


onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  this.http.post('http://localhost:8089/upload', formData, { responseType: 'text' })
    .subscribe({
      next: (imagePath: string) => {
        const imageUrl = 'http://localhost:8089' + imagePath;

        const imageMessage: Message = {
          senderId: this.senderId,
          receiverId: this.receiverId,
          content: imageUrl,
          timestamp: new Date().toISOString(),
          idAss: this.idAss,
          senderUsername: this.senderUsername,
        };

        this.wsService.sendMessage({
          ...imageMessage,
          idAss: this.idAss as number // On assure que c’est bien un `number` ici
        });
        
        this.messages.push(imageMessage);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erreur lors de l\'upload de l\'image :', err);
      }
    });
}

isImageUrl(url: string): boolean {
  return /\.(jpeg|jpg|gif|png)$/i.test(url);
}





}