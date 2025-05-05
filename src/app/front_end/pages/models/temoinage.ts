
export enum TemoinageStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  statut1 = 'statut1',
  statut2 = 'statut2',
  statut3 = 'statut3'
}

  export interface Temoinage {
    idTemoin?: number;
    nom: string;
    
    description: string;
    description_en: string; 
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
    audioUrl?: string;
    photo?: string;
    id: number;
    

    
  }