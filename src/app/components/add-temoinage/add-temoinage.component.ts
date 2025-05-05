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

  // Ajouter des variables pour la reconnaissance vocale
  isSpeechRecognitionActive = false;
  recognition: any;

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

  photoPreview: string | null = null;
  selectedFile: File | null = null;

  apiKey = 'VUJQOVWJUDSMUUX9F0FP5';

  constructor(
    private temoinageService: TemoinageService,
    private router: Router,
    private http: HttpClient
  ) {
    // Initialiser SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US'; // Langue française (vous pouvez fr-FR changer pour 'en-US' si nécessaire)
      this.recognition.interimResults = true; // Afficher les résultats intermédiaires en temps réel
      this.recognition.continuous = true; // Continuer à écouter jusqu'à ce qu'on arrête

      // Mettre à jour la description en temps réel avec les résultats de la reconnaissance vocale
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        this.temoinage.description = transcript;
      };

      // Gérer les erreurs
      this.recognition.onerror = (event: any) => {
        console.error('Erreur de reconnaissance vocale :', event.error);
        if (event.error === 'no-speech') {
          alert('Aucune parole détectée. Veuillez parler plus fort ou vérifier votre microphone.');
        } else if (event.error === 'not-allowed') {
          alert('Accès au microphone refusé. Veuillez autoriser l\'accès au microphone dans les paramètres de votre navigateur.');
        }
      };

      // Réinitialiser lorsque la reconnaissance vocale s'arrête
      this.recognition.onend = () => {
        if (this.isSpeechRecognitionActive) {
          this.recognition.start(); // Redémarrer si on est encore en mode écoute
        }
      };
    } else {
      alert('La reconnaissance vocale n\'est pas prise en charge par votre navigateur. Veuillez utiliser un navigateur compatible comme Chrome.');
    }
  }

  // Méthode pour gérer la sélection d'un fichier
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => this.photoPreview = e.target?.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Méthode pour enregistrer un témoignage
  saveTemoinage(): void {
    const formData = new FormData();
    formData.append('nom', this.temoinage.nom);
    formData.append('description', this.temoinage.description);
    formData.append('description_en', this.temoinage.description_en);
    formData.append('statut', this.temoinage.statut);
    formData.append('typeTemoinage', this.temoinage.typeTemoinage);
    formData.append('photoUrl', this.temoinage.photoUrl);
    formData.append('date', this.temoinage.date);
    formData.append('localisation', this.temoinage.localisation);
    formData.append('note', this.temoinage.note.toString());
    formData.append('categorie', this.temoinage.categorie);
    formData.append('contact', this.temoinage.contact);

    if (this.audioFile) {
      formData.append('audio', this.audioFile, 'audioFile.wav');
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

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

  // Méthode pour démarrer la reconnaissance vocale
  startSpeechRecognition(): void {
    if (this.recognition) {
      this.isSpeechRecognitionActive = true;
      this.recognition.start();
      console.log('Reconnaissance vocale démarrée');
    } else {
      alert('La reconnaissance vocale n\'est pas disponible.');
    }
  }

  // Méthode pour arrêter la reconnaissance vocale
  stopSpeechRecognition(): void {
    if (this.recognition) {
      this.isSpeechRecognitionActive = false;
      this.recognition.stop();
      console.log('Reconnaissance vocale arrêtée');
    }
  }

  // Méthode pour démarrer l'enregistrement audio
  startRecording(): void {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.audioFile = new File([audioBlob], 'temoinage.wav', { type: 'audio/wav' });
          this.audioChunks = [];
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      }).catch(err => {
        console.error('Erreur d\'accès au microphone:', err);
        alert('Erreur d\'accès au microphone. Veuillez vérifier les autorisations.');
      });
    } else {
      alert('Votre navigateur ne prend pas en charge l\'enregistrement audio.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  // Supprimez la méthode traduireDescription() si vous n'en avez plus besoin
}