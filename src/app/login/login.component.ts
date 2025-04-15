import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

 onSubmit() {
  this.authService.login(this.credentials.username, this.credentials.password).subscribe({
    next: (response) => {
      console.log('Réponse du backend:', response); // Affiche la réponse complète
      if (response.accessToken) {
        console.log('Jeton JWT:', response.accessToken); // Affiche le jeton reçu
      }

      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('username', response.username);
      localStorage.setItem('role', response.roles[0]);
      localStorage.setItem('email', response.email); // Stocker l'email

      this.successMessage = 'Connection successful! Redirecting...';
      this.errorMessage = '';

      setTimeout(() => {
        if (response.email === 'admin@gmail.com') {
          this.router.navigate(['/dash']);
        } else {
          this.router.navigate(['/home']);
        }
      }, 1000); // Attente de 1 seconde avant redirection
    },
    error: () => {
      this.errorMessage = 'Incorrect credentials. Please try again.';
      this.successMessage = '';
    }
  });
}


  
}
