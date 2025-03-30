import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/back_end/services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.stripeService.cleanup();
  }
  paymentForm: FormGroup;
  loading = false;
  paymentSuccess = false;
  errorMessage: string | null = null;
  cardElement: StripeCardElement | null = null;
  currentEmail: string = '';
  cardError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      description: ['Donation', Validators.required],
      // Supprimez donId du formulaire
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeStripeElement();
    this.setupCardElementListeners();
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

  setupCardElementListeners(): void {
    if (this.cardElement) {
      this.cardElement.on('change', (event) => {
        this.cardError = event.error?.message || null;
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;
    this.paymentSuccess = false;
    this.currentEmail = this.paymentForm.get('email')?.value;

    try {
      const formValue = this.paymentForm.value;
      
      // Envoyez la requête sans donId
      const paymentResponse = await this.stripeService.processPayment({
        amount: formValue.amount,
        currency: 'eur',
        email: formValue.email,
        description: formValue.description
        // donId est omis volontairement
      }).toPromise();

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

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.clientSecret,
        {
          payment_method: paymentMethod.id,
          receipt_email: formValue.email
        }
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

  // ... autres méthodes inchangées ...


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