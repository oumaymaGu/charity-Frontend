import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit, OnDestroy {
  username: string = '';
  donations: any[] = [];
  donationCount: number = 0;
  private donationsSub: Subscription | null = null;
  private notificationSub: Subscription | null = null;
  unreadNotificationsCount: number = 0;
  showGiftSection: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  // Système de récompense
  giftOptions = [
    { 
      id: 1, 
      name: 'Code promo de 15%', 
      description: 'Valable sur votre prochain don',
      icon: 'fa-solid fa-percentage',
      claimed: false 
    },
    { 
      id: 2, 
      name: 'T-shirt exclusif', 
      description: 'T-shirt collector de notre association',
      icon: 'fa-solid fa-shirt',
      claimed: false 
    },
    { 
      id: 3, 
      name: 'Arbre planté en votre nom', 
      description: 'Nous planterons un arbre pour vous',
      icon: 'fa-solid fa-tree',
      claimed: false 
    }
  ];
  selectedGiftId: number | null = null;
  giftClaimed: boolean = false;
  giftSuccessMessage: string = '';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Anonymous';
    this.loadDonations();
    this.setupNotificationListener();
  }

  private loadDonations() {
    const apiUrl = `${environment.apiUrl}/dons/all`;
    
    this.isLoading = true;
    this.errorMessage = null;
    this.donationsSub = this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.donations = data.filter(donation => 
          donation.donorName === this.username
        );
        this.donationCount = this.donations.length;
        this.isLoading = false;
        this.showGiftSection = this.donationCount >= 3;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
        this.errorMessage = err.status === 404 
          ? 'Endpoint non trouvé. Contactez l\'administrateur.'
          : 'Impossible de charger les dons. Veuillez réessayer plus tard.';
      }
    });
  }

  private setupNotificationListener() {
    this.notificationSub = this.notificationService.notifications$.subscribe(notifications => {
      this.unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
      
      const newDonationNotification = notifications.find(n => 
        !n.isRead && (n.type === 'DON_MATERIEL' || n.type === 'DON_FINANCIER' || n.type === 'STRIPE_PAYMENT')
      );
      
      if (newDonationNotification) {
        this.loadDonations();
      }
    });
  }

  claimGift(): void {
    if (this.selectedGiftId === null) {
      this.errorMessage = 'Veuillez sélectionner un cadeau';
      return;
    }
    
    const selectedGift = this.giftOptions.find(g => g.id === this.selectedGiftId);
    if (selectedGift) {
      this.isLoading = true;
      this.errorMessage = null;
      
      // Simulation d'appel API
      setTimeout(() => {
        selectedGift.claimed = true;
        this.giftClaimed = true;
        this.isLoading = false;
        
        // Message de succès personnalisé
        this.giftSuccessMessage = `
          Félicitations ! Votre ${selectedGift.name.toLowerCase()} a été enregistré.
          ${selectedGift.id === 1 ? 'Le code vous sera envoyé par email.' : 
           selectedGift.id === 2 ? 'Nous vous contacterons pour les détails de livraison.' :
           'Vous recevrez un certificat de plantation par email.'}
        `;
        
        // Ici vous feriez normalement un vrai appel API :
        // this.http.post(`${environment.apiUrl}/gifts/claim`, { 
        //   userId: this.username, 
        //   giftId: this.selectedGiftId 
        // }).subscribe(...);
      }, 1500);
    }
  }

  markNotificationAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  ngOnDestroy() {
    this.donationsSub?.unsubscribe();
    this.notificationSub?.unsubscribe();
  }
}