import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TemoinageService } from 'src/app/services/temoinage.service';
import { Temoinage, TemoinageStatut } from 'src/app/front_end/pages/models/temoinage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-temoinage',
  templateUrl: './add-temoinage.component.html',
  styleUrls: ['./add-temoinage.component.css']
})
export class AddTemoinageComponent {

  temoinage: Temoinage = {
    nom: '',
    description: '',
    statut: TemoinageStatut.EN_ATTENTE,
    typeTemoinage: '',
    likes: 0,
    comments: [],
    photoUrl: '',
    date: '',
    localisation: '',
    note: 0,
    categorie: '',
    contact: ''
  };

  selectedFile: File | null = null;
  apiKey = 'VUJQOVWJUDSMUUX9F0FP5'; 

  constructor(
    private temoinageService: TemoinageService,
    private router: Router,
    private http: HttpClient
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveTemoinage(): void {
    if (this.selectedFile) {
      // upload image (si tu veux gérer les fichiers plus tard)
    }
  
    this.http.post<any>('http://localhost:8089/temoinage/temoinages', this.temoinage).subscribe({
      next: res => {
        alert("Témoignage ajouté avec succès !");
        this.router.navigate(['/temoinages']); // redirige vers la liste
      },
      error: err => {
        if (err.status === 400 && err.error.includes("Contenu inapproprié")) {
          alert("Erreur : votre témoignage contient un mot interdit !");
        } else {
          alert("Une erreur est survenue. Voir console.");
          console.error(err);
        }
      }
    });
  }
  

  traduireDescription(): void {
    const texte = this.temoinage.description;

    if (!texte) {
      console.error('Aucune description à traduire');
      return;
    }

    // Appel à l'API de traduction via ton backend (qui appelle Targomo ou autre)
    this.http.post<any>('http://localhost:8089/api/translate', { text: texte })
      .subscribe({
        next: res => {
          if (res && res.translatedText) {
            this.temoinage.description = res.translatedText;
            console.log('Description traduite :', res.translatedText);
          } else {
            console.warn('Réponse inattendue:', res);
          }
        },
        error: err => {
          console.error('Erreur lors de la traduction via le backend :', err);
        }
      });
  }
}
