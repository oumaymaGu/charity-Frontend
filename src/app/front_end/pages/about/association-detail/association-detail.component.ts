import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


interface Commentaire {
  id?: number;
  contenu: string;
  dateCreation?: Date;
  user?: {
    username?: string;
    email?: string;
  };
  idAss?: number;
  likes?: number;
  reponses?: Commentaire[];
  showReplyForm?: boolean; // Ajout de la propriété pour afficher le formulaire de réponse
  replyContent?: string;

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
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
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

  showEmojiPicker = false;
  // Pour Giphy
gifSearchTerm: string = '';
gifs: any[] = [];
showGifPicker: boolean = false;


toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmoji(event: any) {
  // Selon la version, l’objet peut être différent
  const emoji = event.emoji?.native || event.detail?.unicode || event.unicode;
  if (emoji) {
    this.newCommentaire += emoji;
  } else {
    console.warn('Emoji non détecté dans l’événement', event);
  }
}


likeCommentaire(id: number | undefined) {
  if (id) {
    this.http.post<Commentaire>(`http://localhost:8089/api/commentaires/${id}/like`, {}).subscribe({
      next: () => {
        const comment = this.commentaires.find(c => c.id === id);
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
        }  // Logique pour mettre à jour le nombre de likes localement, si nécessaire
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du like', error);
      }
    });
  }
}

repondreAuCommentaire(parentId: number, contenu: string) {
  if (contenu.trim()) {
    this.http.post<Commentaire>(`http://localhost:8089/api/commentaires/${parentId}/repondre`, {
      contenu: contenu
    }).subscribe({
      next: (data) => {
        const parent = this.commentaires.find(c => c.id === parentId);
        if (parent) {
          if (!parent.reponses) parent.reponses = [];
          parent.reponses.push(data); // Ajouter dans le tableau de réponses du parent uniquement
          parent.showReplyForm = false;
          parent.replyContent = '';
        }
      },
      error: (err) => {
        console.error('Erreur ajout réponse', err);
      }
    });
  }
}



toggleReply(commentId: number | undefined) {
  const commentaire = this.commentaires.find(c => c.id === commentId);
  if (commentaire) {
    commentaire.showReplyForm = !commentaire.showReplyForm;
  }
  
}


getCommentairesByAssociation(idAss: number) {
  return this.http.get<Commentaire[]>(`http://localhost:8089/api/commentaires/association/${idAss}`);
}


autoResize(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

 
searchGifsFromBackend() {
  const query = this.gifSearchTerm.trim();
  if (!query) return;

  this.http.get<any>(`http://localhost:8089/api/giphy/search?query=${encodeURIComponent(query)}`).subscribe({
    next: (res) => {
      console.log('Giphy API response:', res);
      // Assigner directement la réponse des URLs à this.gifs
      this.gifs = res;  // Si la réponse est simplement un tableau d'URLs
      console.log('GIFs:', this.gifs);
    },
    error: (err) => {
      console.error('Erreur lors de la recherche de GIFs depuis le backend', err);
    }
  });
}






addGifToComment(gifUrl: string) {
  if (!gifUrl) {
    console.error('URL du GIF non valide');
    return;
  }
  // On s'assure que l'URL commence par "http"
  if (!gifUrl.startsWith('http')) {
    gifUrl = 'https://media.giphy.com/' + gifUrl;
  }
  // Ajoute l'image GIF au commentaire sous forme d'élément <img>
  this.newCommentaire += ` <img src="${gifUrl}" alt="gif" style="max-height: 150px;" /> `;
}



toggleGifPicker() {
  this.showGifPicker = !this.showGifPicker; //Méthode pour ouvrir/fermer le sélecteur de GIFs
}

sanitizeHtml(contenu: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(contenu);
}




  
}
