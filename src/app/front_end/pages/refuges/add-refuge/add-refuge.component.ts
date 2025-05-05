import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SseService } from 'src/app/services/sse.service';
import { AuthService } from 'src/app/services/auth.service';

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

interface Notification {
  id: number;
  message: string;
  date: Date;
  lu: boolean;
}

@Component({
  selector: 'app-add-refuge',
  templateUrl: './add-refuge.component.html',
  styleUrls: ['./add-refuge.component.css']
})
export class AddRefugeComponent implements OnInit {
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

  notifications: Notification[] = [];
  showNotifications: boolean = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  username: string | null = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    private sseService: SseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Auth status
    this.isLoggedIn = !!localStorage.getItem('token');
    this.userName = localStorage.getItem('userName') || 'Utilisateur';

    // Notifications via SSE
    this.sseService.getServerSentEvent('http://localhost:8089/notificationrefuge/stream')
      .subscribe({
        next: (notification: any) => {
          const exists = this.notifications.some(n => n.id === notification.id);
          if (!exists) {
            this.notifications.unshift({
              ...notification,
              date: new Date(notification.date)
            });
            console.log('Nouvelle notification :', notification);
          }
        },
        error: (err) => console.error('Erreur SSE:', err)
      });

    // Charger les notifications initiales
    this.http.get<Notification[]>('http://localhost:8089/notificationrefuge').subscribe({
      next: (data) => {
        this.notifications = data.map(n => ({
          ...n,
          date: new Date(n.date)
        }));
      },
      error: (err) => console.error('Erreur chargement notifications:', err)
    });
  }

  // 🔐 Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  // 📩 Notification
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) this.markAllAsRead();
  }

  markAsRead(notificationId: number) {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.lu = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notif => notif.lu = true);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  deleteNotification(notification: Notification): void {
    this.http.delete(`http://localhost:8089/notificationrefuge/delete/${notification.id}`).subscribe({
      next: () => this.notifications = this.notifications.filter(n => n.id !== notification.id),
      error: (err) => console.error('Erreur suppression notif:', err)
    });
  }

  deleteAllNotifications(): void {
    this.http.delete('http://localhost:8089/notificationrefuge/delete-all').subscribe({
      next: () => this.notifications = [],
      error: (err) => console.error('Erreur suppression toutes notifs:', err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateForm(): boolean {
    return !!(
      this.refuge.nom && this.refuge.prenom && this.refuge.email &&
      this.refuge.nationnalite && this.refuge.datedenaissance &&
      this.refuge.localisationActuel && this.refuge.besoin
    );
  }

  onSubmit(): void {
    if (!this.validateForm() || !this.selectedFile) {
      console.error('Formulaire invalide ou image manquante');
      return;
    }

    const formData = new FormData();
    formData.append('refuge', new Blob([JSON.stringify(this.refuge)], { type: 'application/json' }));
    formData.append('image', this.selectedFile, this.selectedFile.name);

    this.http.post<Refuge>('http://localhost:8089/refuge/add-ref', formData).subscribe({
      next: (response) => {
        console.log('Refuge ajouté avec succès:', response);
        this.resetForm();
        this.router.navigate(['/lastrefuge']);
      },
      error: (error) => console.error('Erreur lors de l\'ajout:', error)
    });
  }

  resetForm(): void {
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
