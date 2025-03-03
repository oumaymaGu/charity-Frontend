import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUsername(); // Récupérer le nom de l'utilisateur
  }

  logout() {
    this.authService.logout();
  }
}
