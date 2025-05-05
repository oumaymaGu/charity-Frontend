// user.model.ts
export interface User {
    idUser?: number;
    username: string;
    password: string;
    email: string;
    role?: string;
    resetToken?: string;
    // Add any other fields you might need from the backend (like 'roles', 'refuges', etc.)
  }
  