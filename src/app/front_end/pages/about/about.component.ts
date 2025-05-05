import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';



interface Association {
  idAss: number;
  nomAss: string;
  lieu: string;
  date: Date;
  contact: string;
  email: string;
  description: string;
  photoUrl: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  associations: Association[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
    isLoggedIn: boolean = false;
  userName: string = '';
  username: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router, private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAssociations();
    this.username = this.authService.getUsername();

  }

  loadAssociations() {
    this.loading = true;
    this.http.get<Association[]>('http://localhost:8089/association/get-all-ass')
      .subscribe({
        next: (data) => {
          this.associations = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des associations';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
    }
    visibleAssociationsCount = 3;

    showAllAssociations() {
      this.visibleAssociationsCount = this.associations.length;
    }

    logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
    }
