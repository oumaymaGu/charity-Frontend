import { Injectable } from '@angular/core';
import { DonationRequest } from 'src/app/front_end/pages/models/donation-request';

@Injectable({
  providedIn: 'root'
})
export class DonationRequestService {
  private storageKey = 'donation_requests';
  private donorInfoKey = 'current_donor_info';

  constructor() { }

  // Sauvegarder les infos du donateur
  saveDonorInfo(email: string, name: string): void {
    localStorage.setItem(this.donorInfoKey, JSON.stringify({ email, name }));
  }

  // Récupérer les infos du donateur
  getDonorInfo(): { email: string, name: string } | null {
    const data = localStorage.getItem(this.donorInfoKey);
    return data ? JSON.parse(data) : null;
  }

  // Ajouter une nouvelle demande
  addRequest(request: DonationRequest): void {
    const requests = this.getAllRequests();
    const donorInfo = this.getDonorInfo();
    
    // Assure que l'email est toujours inclus
    const completeRequest = {
      ...request,
      userEmail: request.userEmail || donorInfo?.email || '',
      id: this.generateId(),
      date: new Date()
    };

    requests.push(completeRequest);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }

  // Récupérer toutes les demandes
  getAllRequests(): DonationRequest[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getRequestById(id: string): DonationRequest | null {
    const requests = this.getAllRequests();
    return requests.find(req => req.id === id) || null;
  }
  updateRequestStatus(id: string, status: 'pending' | 'accepted' | 'rejected'): void {
    const requests = this.getAllRequests();
    const index = requests.findIndex(req => req.id === id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status: status
      };
      localStorage.setItem(this.storageKey, JSON.stringify(requests));
    }
  }
  
  deleteRequestById(id: string): void {
    const requests = this.getAllRequests().filter(req => req.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
  }
}