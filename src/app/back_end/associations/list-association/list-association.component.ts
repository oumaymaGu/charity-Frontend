import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Association {
  idAss: number;
  nomAss: string;
  lieu: string;
  date: Date;
  contact: string;
  email: string;
  description: string;
}

@Component({
  selector: 'app-list-association',
  templateUrl: './list-association.component.html',
  styleUrls: ['./list-association.component.css']
})
export class ListAssociationComponent implements OnInit {
  associations: Association[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAssociations();
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

  deleteAssociation(id_ass: number) {
    if (confirm('Are you sure you want to delete this association?')) {
      this.http.delete(`http://localhost:8089/association/remove-ass/${id_ass}`)
        .subscribe({
          next: () => {
            this.loadAssociations();
            alert('Association removed successfully');
          },
          error: (error) => {
            console.error('Erreur détaillée lors de la suppression:', error);
            if (error.status === 404) {
              alert('Association non trouvée');
            } else if (error.status === 0) {
              alert('Erreur de connexion au serveur');
            } else {
              alert(`Erreur lors de la suppression: ${error.message}`);
            }
          }
        });
    }
  }

  modifierAssociation(association: Association) {
    this.router.navigate(['/modifierasso', association.idAss]);
  }

  searchAssociation() {
    if (this.searchTerm) {
      this.http.get<Association>(`http://localhost:8089/association/get-ass/${this.searchTerm}`)
        .subscribe({
          next: (data) => {
            this.associations = data ? [data] : [];
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            this.error = 'Association non trouvée';
          }
        });
    } else {
      this.loadAssociations();
    }
  }
}
