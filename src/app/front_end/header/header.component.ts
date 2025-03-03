import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  username: string | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit() {
      this.username = this.authService.getUsername(); // Récupérer le nom de l'utilisateur
    }
  
    logout() {
      this.authService.logout();     //i added this code yesterday to affichage of profile logout in home 
    }

}
