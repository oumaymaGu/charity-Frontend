import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Commentaire {
  id?: number;
  contenu: string;
  dateCreation?: Date;
  user?: {
    username?: string;
    email?: string;
  };
  idAss?: number;
}

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
  selector: 'app-association-detail',
  templateUrl: './association-detail.component.html',
  styleUrls: ['./association-detail.component.css']
})
export class AssociationDetailComponent implements OnInit {
  association: Association | null = null;
  commentaires: Commentaire[] = [];
  newCommentaire: string = '';
  loading: boolean = true;
  loadingCommentaires: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadAssociationDetails();
    this.loadCommentaires();
  }

  loadAssociationDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Association>(`http://localhost:8089/association/get-ass/${id}`).subscribe({
        next: (data) => {
          this.association = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des détails de l\'association';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
    }
  }

  loadCommentaires() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Commentaire[]>(`http://localhost:8089/api/commentaires/association/${id}`).subscribe({
        next: (data) => {
          this.commentaires = data;
          this.loadingCommentaires = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des commentaires';
          this.loadingCommentaires = false;
          console.error('Erreur détaillée:', error);
        }
      });
    }
  }

  ajouterCommentaire() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.newCommentaire.trim()) {
      this.http.post<Commentaire>('http://localhost:8089/api/commentaires/add', {
        idAss: id,
        contenu: this.newCommentaire
      }).subscribe({
        next: (data) => {
          this.commentaires.push(data);
          this.newCommentaire = '';
        },
        error: (error) => {
          this.error = 'Erreur lors de l\'ajout du commentaire';
          console.error('Erreur détaillée:', error);
        }
      });
    }
  }
}
