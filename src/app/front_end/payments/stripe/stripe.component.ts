import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/back_end/services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { DonService } from 'src/app/back_end/services/donation.service';
import { NotificationService } from 'src/app/back_end/services/don-notification.service';
import { saveAs } from 'file-saver';

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
  cardError: string | null = null;
  paymentIntentId: string | null = null;

  constructor(
    private stripeService: StripeService,
    private donService: DonService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      description: ['Donation', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.stripeService.cleanup();
  }

  private async initializeStripe(): Promise<void> {
    try {
      await this.stripeService.initialize();
      this.cardElement = this.stripeService.createCardElement();
      this.stripeService.mountCardElement(this.cardElement, '#card-element');
      
      this.cardElement.on('change', (event) => {
        this.cardError = event.error?.message || null;
      });
    } catch (error) {
      console.error('Stripe initialization error:', error);
      this.errorMessage = this.getErrorMessage(error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;
    const formValue = this.paymentForm.value;

    try {
      const donationData = {
        typeDon: 'ARGENT',
        amount: formValue.amount,
        email: formValue.email,
        donorName: formValue.name,
        description: formValue.description,
        dateDon: new Date().toISOString(),
        
      };

      const paymentResponse = await this.stripeService.processPayment({
        amount: formValue.amount,
        currency: 'eur',
        email: formValue.email,
        description: formValue.description,
        
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
        this.paymentIntentId = paymentIntent.id;
        this.paymentSuccess = true;
        this.downloadReceipt(); // Téléchargement automatique
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'card_declined') {
      return 'Votre carte a été refusée. Veuillez essayer une autre méthode de paiement.';
    }
    
    if (error.error?.error) {
      switch (error.error.error) {
        case 'VALIDATION_ERROR': return `Erreur de validation: ${error.error.message}`;
        case 'STRIPE_ERROR': return `Erreur de paiement: ${error.error.message}`;
        default: return error.error.message || 'Échec du traitement du paiement';
      }
    }

    return error.message || 'Une erreur inattendue est survenue';
  }

  async downloadReceipt(): Promise<void> {
    if (!this.paymentIntentId || !this.paymentForm.valid) return;

    try {
      const formValue = this.paymentForm.value;
      const receiptBlob = await this.stripeService.generateReceipt({
        paymentIntentId: this.paymentIntentId,
        customerName: formValue.name,
        email: formValue.email,
        amount: formValue.amount
      }).toPromise();
      
      if (receiptBlob) {
        saveAs(receiptBlob, `receipt_${this.paymentIntentId}.pdf`);
      } else {
        console.error('Receipt blob is undefined');
        this.errorMessage = 'Erreur lors du téléchargement du reçu';
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      this.errorMessage = 'Erreur lors du téléchargement du reçu';
    }
  }
  
}