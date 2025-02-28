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
        console.log('Réponse du backend:', response); // 🛠 Debugging
  
        localStorage.setItem('token', response.token); 
        localStorage.setItem('username', response.username); 
        localStorage.setItem('role', response.roles[0]); 
        localStorage.setItem('email', response.email); // Stocker l'email
  
        this.successMessage = 'Connexion réussie ! Redirection en cours...';
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
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        this.successMessage = '';
      }
    });
  }
  
}
