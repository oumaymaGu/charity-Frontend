import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  selectedUserId: number | null = null;
selectedUsername: string | null = null;
selectedAssId: number | null = null;

showChat = false;

openChat(senderId: number, username: string, idAss: number): void {
  this.selectedUserId = senderId;
  this.selectedUsername = username;
  this.selectedAssId = idAss;
  this.showChat = true;
}

closeChat(): void {
  this.showChat = false;
}


 

}
