import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-association',
  templateUrl: './modifier-association.component.html',
  styleUrls: ['./modifier-association.component.css']
})
export class ModifierAssociationComponent implements OnInit {
  association = {
    idAss: 0,
    nomAss: '',
    lieu: '',
    date: new Date(),
    contact: '',
    email: '',
    description: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadAssociation(id);
  }

  loadAssociation(id: number) {
    this.http.get(`http://localhost:8089/association/get-ass/${id}`)
      .subscribe({
        next: (data: any) => {
          this.association = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          alert('Erreur lors du chargement de l\'association');
        }
      });
  }

  onSubmit() {
    this.http.put(`http://localhost:8089/association/updateAss`, this.association)
      .subscribe({
        next: () => {
          alert('Association modifiée avec succès');
          this.router.navigate(['/list-asso']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          alert('Erreur lors de la modification de l\'association');
        }
      });
  }
}
