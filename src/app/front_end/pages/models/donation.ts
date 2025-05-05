// src/app/front_end/pages/models/donation.ts
export enum TypeDon {
  ARGENT = 'ARGENT',
  MATERIEL = 'MATERIEL'
}

export enum MaterialCategory {
  CLOTHES = 'Clothes',
  MEDICAMENT = 'Medicament',
  FOOD = 'nourriture'
}

export interface Donation {
  idDon: number;
  donorContact: string;
  donorName?: string;
  typeDon: TypeDon;
  dateDon: string;
  heure?: string;
  photoUrl: string;
  description?: string;
  phone?: string;
  email?: string;
  amount?: number;
  category?: MaterialCategory;
  uploadedImagePreview?: string | ArrayBuffer | null;
  donationFrequency?: string;
  medicationName?: string;
  lotNumber?: string;
  expirationDate?: string;
  productCode?: string;
  fabricationDate?: string;
  quantity?: number;
  donorEmail?: string;
}