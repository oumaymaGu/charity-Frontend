import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Donation, TypeDon, MaterialCategory } from 'src/app/front_end/pages/models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonService {
  private baseUrl = 'http://localhost:8089/dons'; // URL de base de l'API

  constructor(private http: HttpClient) {}

  // 🔹 Upload d'une photo et récupération de son URL (peut être conservé pour d'autres usages)
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
    const formData = new FormData();
    // Créer l'objet donationData sans les champs OCR (ils seront détectés côté backend)
    const donationData: Donation = {
      idDon: 0,
      donorContact: don.donorContact || '',
      typeDon: TypeDon.MATERIEL,
      dateDon: new Date().toISOString(),
      photoUrl: '', // Laisser vide, sera rempli par le backend
      category,
      amount: 0,
      heure: new Date().toLocaleTimeString(),
      uploadedImagePreview: undefined,
      description: undefined,
      phone: undefined,
      email: undefined,
      donorName: undefined,
      medicationName: undefined, // Pas besoin côté frontend
      lotNumber: undefined,      // Pas besoin côté frontend
      expirationDate: undefined, // Pas besoin côté frontend
      productCode: undefined     // Pas besoin côté frontend
    };
    // Ajouter les données du don et l'image dans le FormData
    formData.append('don', new Blob([JSON.stringify(donationData)], { type: 'application/json' }));
    formData.append('medicationImage', file);

    return this.http.post<Donation>(`${this.baseUrl}/add-with-medication`, formData).pipe(
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