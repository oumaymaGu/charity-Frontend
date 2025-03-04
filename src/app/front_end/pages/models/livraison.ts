export interface Livraisons {
    idLivr: number;
    nom: string;
    adresseLivr: string;
    dateLivraison: Date;
    etatLivraisons: 'ENCOURS' | 'LIVREE' | 'ANNULEE';
    
  }
  