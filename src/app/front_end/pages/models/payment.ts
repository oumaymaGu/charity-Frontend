export interface Payment {
date: string|number|Date;
donationType: any;


  idPmt: number;
  
  amount: number;
  email: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
  cardHolderName: string;
}
