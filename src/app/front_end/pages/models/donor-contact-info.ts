export interface DonorContactInfo {
    id: number;
    requesterName: string;
    requesterEmail: string;
    message: string;
    requestDate: string;
    responded: boolean;
    donationId: number;
    donorEmail: string; 
    facebookUrl?: string;
   
    donorname: string;
  }
  export interface ContactRequest {
    donationId: number;
    donorEmail: string;
    requesterEmail: string;
    message: string;
    deliveryMethod: 'pickup' | 'delivery';
    availability: string;
  }
  