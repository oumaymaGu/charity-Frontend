import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername(); // Récupérer le nom de l'utilisateur
  }

  logout() {
    this.authService.logout();
  }

  onToggleNotifications() {
    this.toggleNotifications.emit();
  }
}