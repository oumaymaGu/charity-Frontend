import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
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
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des logements';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }

  voirDetails(logement: Logement) {
    this.router.navigate(['/logement', logement.idLog]);
  }
}