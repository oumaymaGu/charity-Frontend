import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SseService } from 'src/app/services/sse.service';
import { AuthService } from 'src/app/services/auth.service';


interface Logement {
  idLog: number;
  nom: string;
  adresse: string;
  capacite: number;
  disponnibilite: string;
}

interface Notification {
  id: number;
  message: string;
  date: Date;
  lu: boolean;
}

@Component({
  selector: 'app-service',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class ServiceComponent implements OnInit {
  Logements: Logement[] = [];
  selectedLogement: Logement | null = null;
  loading: boolean = true;
  error: string | null = null;
  showDetails: boolean = false;

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

  ngOnInit() {
    this.loadLogements();
    this.notifications = [];
    this.username = this.authService.getUsername();
    

    this.sseService.getServerSentEvent('http://localhost:8089/notificationrefuge/stream')
      .subscribe({
        next: (notification) => {
          const existingNotification = this.notifications.find(n => n.id === notification.id);
          if (!existingNotification) {
            this.notifications.unshift({
              ...notification,
              date: new Date(notification.date)
            });
            console.log('Nouvelle notification reçue:', notification);
          }
        },
        error: (err) => {
          console.error('Erreur SSE:', err);
        }
      });

      

    this.http.get<any[]>('http://localhost:8089/notificationrefuge').subscribe(
      (notifications) => {
        this.notifications = notifications.map(notification => ({
          ...notification,
          date: new Date(notification.date)
        }));
        console.log('Notifications initiales:', this.notifications);
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    );

    // Initialisation de isLoggedIn et récupération du nom utilisateur
    this.isLoggedIn = !!localStorage.getItem('token');
    this.userName = localStorage.getItem('userName') || 'Utilisateur';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  // ... Le reste de ton code inchangé ...

  deleteNotification(notification: Notification) {
    this.http.delete<void>(`http://localhost:8089/notificationrefuge/delete/${notification.id}`).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      (error) => {
        console.error('Erreur lors de la suppression de la notification:', error);
      }
    );
  }

  deleteAllNotifications() {
    this.http.delete('http://localhost:8089/notificationrefuge/delete-all').subscribe({
      next: () => {
        this.notifications = [];
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de toutes les notifications:', error);
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(notif => !notif.lu).length;
  }

  loadLogements() {
    this.loading = true;
    this.http.get<Logement[]>('http://localhost:8089/logement/get-all-log').subscribe({
      next: (data) => {
        this.Logements = data;
        this.loading = false;
        console.log('Logements chargés:', this.Logements);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des logements';
        this.loading = false;
        console.error('Erreur détaillée:', error);
      },
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.markAllAsRead();
    }
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

  voirDetails(logement: Logement) {
    this.router.navigate(['/logement', logement.idLog]);
  }

  fermerDetails() {
    this.showDetails = false;
    this.selectedLogement = null;
  }

 /* addLogement() {
    const newLogement: Logement = {
      idLog: this.Logements.length + 1,
      nom: 'Nouveau Logement',
      adresse: 'Adresse de test',
      capacite: 4,
      disponnibilite: 'Disponible'
    };

    this.Logements.push(newLogement);

    const notificationMessage = `Nouveau logement ajouté : ${newLogement.nom}, ${newLogement.adresse}`;
    const newNotification: Notification = {
      id: this.notifications.length + 1,
      message: notificationMessage,
      date: new Date(),
      lu: false
    };

    this.notifications.push(newNotification);
    console.log('Logement ajouté et notification envoyée:', newLogement, newNotification);
  }*/
}
