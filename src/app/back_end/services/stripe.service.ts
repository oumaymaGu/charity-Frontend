import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  private apiUrl = 'http://localhost:8089/api/stripe-payments';
  private stripePublicKey = 'pk_test_51QwSi3GduHSrwvYoe89vQJOKtuA1Odrrp6HweNNgmuRDxJPR4nPVHh1s8C9lmWP3TSEy3ZvdkgFH11tXFxDmXMps00FB63iQV5';

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(this.stripePublicKey);
  }

  async initialize(): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe initialization failed');
    this.elements = stripe.elements();
  }

  createCardElement(options?: any): StripeCardElement {
    if (!this.elements) throw new Error('Stripe Elements not initialized');
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a'
        }
      },
      ...options
    });
    return this.cardElement;
  }

  mountCardElement(element: StripeCardElement, selector: string): void {
    const container = document.querySelector(selector);
    if (container && container.children.length === 0) {
      element.mount(selector);
    }
  }

  processPayment(paymentData: {
    amount: number;
    currency: string;
    email: string;
    description?: string;
    donId?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, {
      amount: Math.round(paymentData.amount * 100),
      currency: paymentData.currency || 'eur',
      email: paymentData.email,
      description: paymentData.description,
      donId: paymentData.donId
    }).pipe(
      catchError(this.handleError)
    );
  }

  async confirmCardPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');
    
    if (!clientSecret.includes('_secret_')) {
      throw new Error('Invalid client secret format');
    }

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId
    });
  }

  async getStripeInstance(): Promise<Stripe> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');
    return stripe;
  }

  cleanup(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.elements = null;
  }

  private handleError(error: any): Observable<never> {
    console.error('Stripe Service Error:', error);
    const errorMsg = error.error?.message || error.message || 'An unknown error occurred';
    return throwError(() => new Error(errorMsg));
  }
  // Ajoutez cette méthode à votre service existant
  generateReceipt(receiptData: {
    paymentIntentId: string;
    customerName: string;
    email: string;
    amount: number;
  }): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/receipt/${receiptData.paymentIntentId}`, {
      params: {
        customerName: receiptData.customerName,
        email: receiptData.email,
        amount: receiptData.amount.toString()
      },
      responseType: 'blob' // Corrected this line
    });
  }
}