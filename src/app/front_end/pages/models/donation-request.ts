// src/app/models/donation-request.model.ts
export interface DonationRequest {
    id?: string; // Optionnel pour un identifiant unique
    fullName: string;
    email: string;
    phone: string;
    message: string;
    deliveryMethod: 'pickup' | 'delivery';
    termsAccepted: boolean;
    date: Date;
    requesterEmail?: string;
    donorEmail?: string;
  donationId?: number; 
  userEmail?: string;
  status?: string; 
 
    
  }