export interface Livraisons {
    idLivr: number;
    nom: string;
    adresseLivr: string;
    dateLivraison: Date;
    etatLivraisons: 'ENCOURS' | 'LIVREE' | 'ANNULEE';
    emailClient: string; // 👈 ajouté ici
    signatureImage?: string; 
    pinCode?: string;      // <-- nouveau champ (optionnel)
    enteredPin?: string;
    
  }
  