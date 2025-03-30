import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/back_end/services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';

interface PaymentResponse {
  requiresAction?: boolean;
  clientSecret?: string;
  payment?: {
    status: string;
  };
  message?: string;
}

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  paymentSuccess = false;
  errorMessage: string | null = null;
  cardElement: StripeCardElement | null = null;
  currentEmail: string = '';
cardError: any;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      donId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeStripeElement();
  }

  async initializeStripeElement(): Promise<void> {
    try {
      await this.stripeService.initialize();
      this.cardElement = this.stripeService.createCardElement();
      this.stripeService.mountCardElement(this.cardElement, '#card-element');
    } catch (error: any) {
      console.error('Stripe initialization error:', error);
      this.errorMessage = this.getErrorMessage(error);
    }
  }

  ngOnDestroy(): void {
    this.stripeService.cleanup();
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;
    this.paymentSuccess = false;
    this.currentEmail = this.paymentForm.get('email')?.value;

    try {
      const formValue = this.paymentForm.value;
      
      const paymentResponse = await this.stripeService.processPayment({
        amount: formValue.amount,
        currency: 'eur',
        email: formValue.email,
        description: formValue.description,
        donId: formValue.donId
      }).toPromise() as PaymentResponse;

      if (!paymentResponse?.clientSecret) {
        throw new Error('No client secret received');
      }

      const stripe = await this.stripeService.getStripeInstance();
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement!,
        billing_details: {
          name: formValue.name,
          email: formValue.email
        }
      });

      if (pmError) throw pmError;
      if (!paymentMethod?.id) throw new Error('Payment method creation failed');

      const { error, paymentIntent } = await this.stripeService.confirmCardPayment(
        paymentResponse.clientSecret,
        paymentMethod.id
      );

      if (error) throw error;
      if (paymentIntent?.status === 'succeeded') {
        this.handlePaymentSuccess();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  handlePaymentSuccess(): void {
    this.paymentSuccess = true;
  }

  async resetPayment(): Promise<void> {
    this.paymentSuccess = false;
    this.currentEmail = '';
    this.paymentForm.reset({
      amount: '',
      email: '',
      name: '',
      description: '',
      donId: ''
    });
    
    this.stripeService.cleanup();
    await this.initializeStripeElement();
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'card_declined') {
      return 'Votre carte a été refusée. Veuillez essayer une autre méthode de paiement.';
    }
    
    if (error.error?.error) {
      switch (error.error.error) {
        case 'VALIDATION_ERROR':
          return `Erreur de validation: ${error.error.message}`;
        case 'STRIPE_ERROR':
          return `Erreur de paiement: ${error.error.message}`;
        default:
          return error.error.message || 'Échec du traitement du paiement';
      }
    }

    return error.message || 'Une erreur inattendue est survenue';
  }
}