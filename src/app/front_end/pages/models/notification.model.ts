export interface Notification {
    id: number;
    message: string;
    type: 'DON_MATERIEL' | 'DON_FINANCIER';
    timestamp: Date;
    donationId: number;
    isRead?: boolean;
  }