// src/app/back_end/services/donation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Donation, TypeDon, MaterialCategory } from 'src/app/front_end/pages/models/donation'; // Import MaterialCategory from donation.ts

@Injectable({
  providedIn: 'root'
})
export class DonService {
  private baseUrl = 'http://localhost:8089/dons'; // URL de base de l'API

  constructor(private http: HttpClient) {}

  // 🔹 Upload d'une photo et récupération de son URL
  uploadPhoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload-photo`, formData, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Ajouter un don (sans fichier, utilisé principalement pour les dons ARGENT)
  addDon(don: Donation): Observable<Donation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Donation>(`${this.baseUrl}/add`, don, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Ajouter un don matériel avec upload de photo et catégorie
  uploadDonMaterial(don: Partial<Donation>, file: File, category: MaterialCategory): Observable<Donation> {
    return this.uploadPhoto(file).pipe(
      switchMap((photoUrl: string) => {
        const donationData: Donation = {
          idDon: 0, // ID sera généré par le backend
          donorContact: don.donorContact || '', // Valeur par défaut si non fournie
          typeDon: TypeDon.MATERIEL, // Définit le type de don comme matériel
          dateDon: new Date().toISOString(), // Date actuelle
          photoUrl, // URL de la photo uploadée
          category, // Ajoutez la catégorie ici
          amount: 0, // Par défaut à 0 pour les dons matériels (facultatif)
          heure: new Date().toLocaleTimeString(), // Heure actuelle, optionnelle
          uploadedImagePreview: undefined // Ne pas envoyer au backend, juste pour le frontend
          ,

          description: undefined,
          phone: undefined,
          email: undefined,
          donorName: undefined
        };

        return this.addDon(donationData); // Ajoute le don avec l'URL de la photo et la catégorie
      }),
      catchError(this.handleError)
    );
  }

  // 🔹 Récupérer tous les dons
  getAllDons(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Récupérer tous les dons matériels
  getMaterialDons(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}/all/material`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Récupérer un don par son ID
  getDonById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Mettre à jour un don
  updateDon(id: number, don: Donation): Observable<Donation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<Donation>(`${this.baseUrl}/update/${id}`, don, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Supprimer un don
  deleteDon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔹 Gestion des erreurs API
  private handleError(error: any): Observable<never> {
    console.error('Erreur API:', error);
    return throwError(() => new Error('Erreur de communication avec le serveur. Vérifiez la console pour plus de détails.'));
  }
}