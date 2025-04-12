// src/app/front_end/pages/models/donation.ts
export enum TypeDon {
  ARGENT = 'ARGENT',
  MATERIEL = 'MATERIEL'
  
  
}

export enum MaterialCategory {  // Move and export MaterialCategory here
  CLOTHES = 'Clothes',
  MEDICAMENT = 'Medicament',
  FOOD = 'nourriture'
}

export interface Donation {
donorName: any;
description: any;
phone: any;
email: any;
idDon: number;
donorContact: string;
typeDon: TypeDon;
dateDon: string; // Use dateDon instead of date to match backend
heure?: string; // Optional, as it can be handled on the backend
photoUrl: string;
amount?: number; // Optional, only for financial donations
category?: MaterialCategory; // Add category for material donations, optional
uploadedImagePreview?: string | ArrayBuffer | null; // Optional, only for frontend preview
donationFrequency?: string; // Optional, only for financial donations*
medicationName?: string;
  lotNumber?: string;
  expirationDate?: string;
 


}