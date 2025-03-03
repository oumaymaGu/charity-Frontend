import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-logement',
  templateUrl: './modifier-logement.component.html',
  styleUrls: ['./modifier-logement.component.css']
})
export class ModifierLogementComponent implements OnInit {
  logement = {
    idLog: 0,
    nom: '',
    adresse: '',
    capacite: 0,
    disponnibilite: 'disponible'
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
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
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          alert('Erreur lors du chargement du logement');
        }
      });
  }

  onSubmit() {
    this.http.put(`http://localhost:8089/logement/updatelog`, this.logement)
      .subscribe({
        next: () => {
          alert('Logement modifié avec succès');
          this.router.navigate(['/admin/logements/liste']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          alert('Erreur lors de la modification du logement');
        }
      });
  }
} 