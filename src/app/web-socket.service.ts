import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

interface Message {
  senderId: number;
  receiverId: number;
  senderUsername?: string;
  content: string;
  timestamp: string;
  idAss?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private connected = false;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  messages$ = this.messageSubject.asObservable();

  connect(userId: number, idAss: number): void {
    if (this.connected) return;

    this.stompClient = Stomp.over(() => new SockJS('http://localhost:8089/ws-charity'));
    this.stompClient.reconnectDelay = 5000;

    this.stompClient.onConnect = () => {
      console.log('🟢 WebSocket connecté');
      this.stompClient.subscribe(
        `/topic/messages/${userId}/association/${idAss}`,
        (message: IMessage) => {
          const msg = JSON.parse(message.body);
          this.messageSubject.next(msg);
        }
      );
      this.connected = true;
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur WebSocket : ', frame);
    };

    this.stompClient.activate();
  }

  connectAsAdmin(): void {
    if (this.connected) return;

    this.stompClient = Stomp.over(() => new SockJS('http://localhost:8089/ws-charity'));
    this.stompClient.reconnectDelay = 5000;

    this.stompClient.onConnect = () => {
      console.log('🟢 WebSocket admin connecté');
      this.stompClient.subscribe('/topic/admin', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        this.messageSubject.next(msg);
      });
      this.connected = true;
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur WebSocket admin : ', frame);
    };

    this.stompClient.activate();
  }

  sendMessage(message: {
    senderId: number;
    receiverId: number;
    idAss: number;
    content: string;
    timestamp?: string;
    senderUsername?: string;
  }): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message),
      });
    } else {
      console.error('⛔ WebSocket non connecté');
    }
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }
  
}
