export interface DonationRequest {
  id: string;
  date: Date;
  fullName: string;
  userEmail: string;
  message: string;
  deliveryMethod: string;
  status?: 'pending' | 'accepted' | 'rejected';
}