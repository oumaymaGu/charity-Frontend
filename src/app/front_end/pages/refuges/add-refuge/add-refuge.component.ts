import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Refuge {
  idRfg?: number;
  nom: string;
  prenom: string;
  email: string;
  nationnalite: string;
  datedenaissance: Date;
  localisationActuel: string;
  besoin: string;
  imagePath?: string;
  detectedGender?: string;
  genderConfidence?: number;
  detectedAge?: number;
  emotionHappiness?: number;
  emotionSadness?: number;
  emotionAnger?: number;
  emotionSurprise?: number;
  emotionFear?: number;
  emotionDisgust?: number;
  emotionNeutral?: number;
}

@Component({
  selector: 'app-add-refuge',
  templateUrl: './add-refuge.component.html',
  styleUrls: ['./add-refuge.component.css']
})
export class AddRefugeComponent {
  refuge: Refuge = {
    nom: '',
    prenom: '',
    email: '',
    nationnalite: '',
    datedenaissance: new Date(),
    localisationActuel: '',
    besoin: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateForm(): boolean {
    return !!(
      this.refuge.nom &&
      this.refuge.prenom &&
      this.refuge.email &&
      this.refuge.nationnalite &&
      this.refuge.datedenaissance &&
      this.refuge.localisationActuel &&
      this.refuge.besoin
    );
  }

  onSubmit() {
    if (!this.validateForm()) {
      console.error('Formulaire invalide. Veuillez remplir tous les champs.');
      return;
    }

    if (!this.selectedFile) {
      console.error('Veuillez sélectionner une image.');
      return;
    }

    const formData = new FormData();

    // Append JSON as a Blob with content type application/json
    formData.append(
      'refuge',
      new Blob([JSON.stringify(this.refuge)], { type: 'application/json' })
    );

    // Append the image file
    formData.append('image', this.selectedFile, this.selectedFile.name);

    this.http
      .post<Refuge>('http://localhost:8089/refuge/add-ref', formData)
      .subscribe({
        next: (response) => {
          console.log('Refuge ajouté avec succès avec image:', response);
          this.resetForm();
          this.router.navigate(['/lastrefuge']); // or wherever you want to navigate
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du refuge:', error);
        }
      });
  }

  resetForm() {
    this.refuge = {
      nom: '',
      prenom: '',
      email: '',
      nationnalite: '',
      datedenaissance: new Date(),
      localisationActuel: '',
      besoin: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
