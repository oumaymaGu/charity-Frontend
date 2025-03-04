import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Signup successful');
        // Redirect to login page after successful signup
        this.router.navigate(['/singin']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
      }
    });
  }
}
