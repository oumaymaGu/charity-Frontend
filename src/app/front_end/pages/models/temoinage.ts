export enum TemoinageStatut {
    EN_ATTENTE = 'EN_ATTENTE',
    APPROUVE = 'APPROUVE',
    REJETE = 'REJETE'
  }
  
  export interface Temoinage {
    idTemoin?: number;
    nom: string;
    description: string;
    statut: TemoinageStatut;
    typeTemoinage: string;
    likes: number;
    comments: string[];
    photoUrl: string;
    date: string;
    localisation: string;
    note: number;
    categorie: string;
    contact: string;
  }