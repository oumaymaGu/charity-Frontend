import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Association {
  nomAss: string;
  lieu: string;
  date: Date;
  contact: string;
  email: string;
  description: string;
  photoUrl: string;
}

@Component({
  selector: 'app-ajouter-association',
  templateUrl: './ajouter-association.component.html',
  styleUrls: ['./ajouter-association.component.css']
})
export class AjouterAssociationComponent {
  association: Association = {
    nomAss: '',
    lieu: '',
    date: new Date(),
    contact: '',
    email: '',
    description: '',
    photoUrl: '' // Ajout du champ pour stocker l'URL de l'image
  };

  selectedFile: File | null = null; // Stocke le fichier sélectionné

  constructor(private http: HttpClient, private router: Router) {}

  submitted = false;
  successMessage = '';
  errorMessage = '';

  // Fonction pour récupérer le fichier sélectionné
// Variable pour stocker l'URL de prévisualisation
imagePreview: string | ArrayBuffer | null = null;

// Fonction modifiée pour récupérer le fichier sélectionné et créer une prévisualisation
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] || null;
  
  // Créer une prévisualisation de l'image
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      // Temporairement afficher l'image en prévisualisation
      this.association.photoUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}

// Fonction modifiée pour supprimer l'image sélectionnée
removeImage() {
  this.selectedFile = null;
  this.imagePreview = null;
  this.association.photoUrl = '';
}

  onSubmit() {
    this.submitted = true;

    if (!this.isValid()) {
      this.errorMessage = "Please fill in all fields correctly.";
      return;
    }

    if (this.selectedFile) {
      // Étape 1 : Upload de l'image
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('http://localhost:8089/association/upload-photo', formData, { responseType: 'text' })
        .subscribe({
          next: (photoUrl: string) => {
            this.association.photoUrl = photoUrl; // Récupérer l'URL retournée par le backend
            this.addAssociation(); // Étape 2 : Ajouter l'association avec la photo
          },
          error: (error) => {
            console.error('Erreur lors de l\'upload de la photo:', error);
            this.errorMessage = "Erreur lors de l'upload de la photo.";
          }
        });
    } else {
      this.addAssociation(); // Ajouter l'association même sans image
    }
  }

  addAssociation() {
    this.http.post<Association>('http://localhost:8089/association/add-ass', this.association)
      .subscribe({
        next: (response) => {
          console.log('Association added successfully:', response);
          this.successMessage = "Association added successfully!";
          this.resetForm();
          setTimeout(() => this.router.navigate(['/list-asso']), 1000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'association:', error);
          this.errorMessage = "Erreur lors de l'ajout. Veuillez réessayer.";
        }
      });
  }

  isValid(): boolean {
    const { nomAss, lieu, contact, email, description } = this.association;
    return nomAss.trim() !== '' &&
           lieu.trim() !== '' &&
           contact.trim().match(/^\d{8,}$/) !== null &&
           this.isValidEmail(email) &&
           description.trim() !== '';
  }

  isValidEmail(email: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  resetForm() {
    this.association = {
      nomAss: '',
      lieu: '',
      date: new Date(),
      contact: '',
      email: '',
      description: '',
      photoUrl: ''
    };
    this.selectedFile = null;
    this.submitted = false;
  }
}