import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logement-details',
  templateUrl: './logement-details.component.html',
  styleUrls: ['./logement-details.component.css']
})
export class LogementDetailsComponent implements OnInit {
  logement: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadLogement(id);
  }

  loadLogement(id: number) {
    this.http.get(`http://localhost:8089/logement/get-log/${id}`)
      .subscribe({
        next: (data: any) => {
          this.logement = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement du logement';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }
}