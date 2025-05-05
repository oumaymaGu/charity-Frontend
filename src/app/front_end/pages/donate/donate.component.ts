import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent  implements OnInit {

  isLoggedIn: boolean = false;
  userName: string = '';
  username: string | null = null;
  constructor(private router: Router,     private authService: AuthService


  ) {}

  ngOnInit() {

    this.username = this.authService.getUsername();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  selectedDonationType: string | null = null;
}