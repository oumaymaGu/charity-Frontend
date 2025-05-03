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
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioBlob?: Blob;
  audioUrl?: string;
  isRecording = false;
  audioFile: File | null = null;

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
    contact: '',
    description_en: '', 
    id: 0,
    
  };

  photoPreview: string | null = null;  // Pour afficher la prévisualisation de l'image
  selectedFile: File | null = null;

  apiKey = 'VUJQOVWJUDSMUUX9F0FP5';

  constructor(
    private temoinageService: TemoinageService,
    private router: Router,
    private http: HttpClient
  ) {}

  // Méthode pour gérer la sélection d'un fichier
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Méthode pour enregistrer un témoignage
  saveTemoinage(): void {
    const formData = new FormData();
  
    // Ajout des champs de texte dans le FormData
    formData.append('nom', this.temoinage.nom);
    formData.append('description', this.temoinage.description);
    formData.append('description_en', this.temoinage.description_en);  // Assure-toi que ce champ existe maintenant
    formData.append('statut', this.temoinage.statut);
    formData.append('typeTemoinage', this.temoinage.typeTemoinage);
    formData.append('photoUrl', this.temoinage.photoUrl);
    formData.append('date', this.temoinage.date);
    formData.append('localisation', this.temoinage.localisation);
    formData.append('note', this.temoinage.note.toString());
    formData.append('categorie', this.temoinage.categorie);
    formData.append('contact', this.temoinage.contact);
  
    // Ajouter les fichiers audio et photo
    if (this.audioFile) {
      formData.append('audio', this.audioFile, 'audioFile.wav');
    }
  
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }
  
    // Envoi de la requête POST
    this.http.post<any>('http://localhost:8089/temoinage/temoinages', formData).subscribe({
      next: res => {
        alert("Témoignage ajouté avec succès !");
        this.router.navigate(['/temoinages']);
      },
      error: err => {
        console.error('Erreur de requête HTTP:', err);
        alert("Erreur lors de l'ajout du témoignage. Veuillez vérifier les données envoyées.");
      }
    });
  }
  
  // Méthode pour traduire la description
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

  // Méthode pour démarrer l'enregistrement audio
  startRecording(): void {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        
        // Spécifie le type de l'événement
        this.mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.audioChunks = [];
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      }).catch(err => {
        console.error('Erreur d\'accès au microphone:', err);
      });
    }
  }

  // Méthode pour arrêter l'enregistrement audio
  stopRecording(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      this.audioFile = new File([audioBlob], 'temoinage.wav', { type: 'audio/wav' });
      this.audioChunks = [];
    };
  }
  
}


