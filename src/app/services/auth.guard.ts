import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Vérifie si le token existe dans localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Récupérer le rôle stocké

    if (token && role === 'ROLE_ADMIN') {
      return true; // Autoriser uniquement les admins
    } else {
      this.router.navigate(['/singin']); // Rediriger si non admin
      return false;
    }
  }
}
