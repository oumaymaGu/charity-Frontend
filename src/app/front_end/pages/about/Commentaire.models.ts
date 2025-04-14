export interface Commentaire {
    id?: number;
    contenu: string;
    dateCreation?: Date;
    user?: {
        username?: string;
      
       email?: string;
    };
    idAss?: number;
  }
  