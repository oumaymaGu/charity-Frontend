import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8089/api/auth/signin';
  private signupUrl = 'http://localhost:8089/api/auth/signup';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string, role: string, username: string, email: string }>(
      this.loginUrl, { username, password }
    ).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email); // Store email
        }
      })
    );
  }

  // Signup method
  signup(username: string, email: string, password: string): Observable<any> {
    const userData = { username, email, password };
    return this.http.post<{ message: string }>(this.signupUrl, userData).pipe(
      tap(() => {
        // Once the signup is done, redirect the user to the login page
        this.router.navigate(['/signin']);
      })
    );
  }

  // Logout method
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  // Getters for user information
  getUsername(): string | null {
    return localStorage.getItem('username'); // Retrieve username
  }

  getEmail(): string | null {
    return localStorage.getItem('email'); // Retrieve email
  }

  getRole(): string | null {
    return localStorage.getItem('role'); // Retrieve role
  }
}
