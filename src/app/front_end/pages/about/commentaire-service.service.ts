// src/app/services/commentaire.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from './Commentaire.models';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private baseUrl = 'http://localhost:8089/api/commentaires';

  constructor(private http: HttpClient) {}

  getCommentairesParAssociation(id: number) {
    return this.http.get<Commentaire[]>(`${this.baseUrl}/association/${id}`);
  }

  ajouterCommentaire(commentaire: Commentaire) {
    const params = new HttpParams()
      .set('idAss', commentaire.idAss!.toString())
      .set('contenu', commentaire.contenu);
    
    return this.http.post<Commentaire>(`${this.baseUrl}/add`, {}, { params });
  }
}
