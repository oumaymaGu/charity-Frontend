import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
  username: string; // Ensure this is available in your Logement object
}

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.css']
})
export class LogementComponent implements OnInit {
  logements: Logement[] = [];
  loading = true;
  error: string | null = null;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadLogements();
  }
  
  loadLogements() {
    this.http.get<Logement[]>('http://localhost:8089/logement/get-all-log')
      .subscribe({
        next: (data) => {
          this.logements = data;
          
          // Make sure the disabled properties are correctly set
          this.logements.forEach(logement => {
            // Ensure username is available for routing
            if (!logement.username) {
              logement.username = localStorage.getItem('username') || '';
            }
          });
          
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading accommodations. Please try again later.';
          this.loading = false;
          console.error('Detailed error:', error);
        }
      });
  }
  
  voirDetails(logement: Logement) {
    this.router.navigate(['/logement-details', logement.idLog]);
  }
  
  // Helper method to check if a reservation is possible
  canReserve(logement: Logement): boolean {
    return logement.disponnibilite === 'disponible' && logement.capacite > 0;
  }
}