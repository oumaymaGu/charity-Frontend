import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/back_end/services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-payment-inscription',
  templateUrl: './payment-inscription.component.html',
  styleUrls: ['./payment-inscription.component.css']
})
export class PaymentInscriptionComponent  implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  paymentSuccess = false;
  errorMessage: string | null = null;
  cardElement: StripeCardElement | null = null;
  currentEmail: string = '';
  cardError: string | null = null;
  idEvent!: number;
  event?: Event & { prixevent?: number };
  user: any = {};
  userId!: number;
  isLoggedIn: boolean = false;
  userName: string = '';
  username: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService

  ) {
    // Initialize the payment form
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      description: ['Donation', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // Retrieve userId and eventId from query parameters
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      console.log('Query Params:', params); // Debugging line
      this.userId = +params['userId'];
      this.idEvent = +params['eventId'];
  
      console.log('Retrieved userId:', this.userId);
      console.log('Retrieved idEvent:', this.idEvent);
  
      if (!this.userId || isNaN(this.idEvent)) {
        console.error('Missing or invalid userId or idEvent in query parameters.');
      }
  
      // Load event details and user data
      this.loadEventDetails();
      this.loadUserData();

      this.username = this.authService.getUsername();

    });
  
 

  // Initialize Stripe and set up card element listeners
  await this.initializeStripeElement();
  this.setupCardElementListeners();
}

  ngOnDestroy(): void {
    // Cleanup Stripe elements on component destroy
    this.stripeService.cleanup();
  }

  /**
   * Load event details to pre-fill the amount
   */
  loadEventDetails(): void {
    if (this.idEvent) {
      this.eventService.getEventById(this.idEvent).subscribe(
        (event: any) => {
          this.event = event;
          this.paymentForm.patchValue({
            amount: this.event?.prixevent ?? 0 // Pre-fill the amount with event price
          });
        },
        (error: any) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  /**
   * Load user data from localStorage and pre-fill the form
   */
  loadUserData(): void {
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    if (email && username) {
      this.user.email = email;
      this.user.username = username;

      // Pre-fill the form with user data
      this.paymentForm.patchValue({
        email: email,
        name: username
      });

      // Retrieve userId from the backend
      this.eventService.getUserIdByEmail(email).subscribe(
        (userId: number) => {
          this.userId = userId;
        },
        (error: any) => {
          console.error('Error fetching user ID:', error);
        }
      );
    }
  }

  /**
   * Initialize Stripe card element
   */
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

  /**
   * Setup listeners for the Stripe card element
   */
  setupCardElementListeners(): void {
    if (this.cardElement) {
      this.cardElement.on('change', (event) => {
        this.cardError = event.error?.message || null;
      });
    }
  }

  /**
   * Handle form submission and process payment
   */
  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;
    this.paymentSuccess = false;
    this.currentEmail = this.paymentForm.get('email')?.value;

    try {
      const formValue = this.paymentForm.value;

      // Process payment
      const paymentResponse = await this.stripeService.processPayment({
        amount: formValue.amount,
        currency: 'eur',
        email: formValue.email,
        description: formValue.description
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

  /**
   * Handle successful payment
   */
  handlePaymentSuccess(): void {
    this.paymentSuccess = true;
  
    console.log('userId:', this.userId);
    console.log('idEvent:', this.idEvent);
  
    // Assign the user to the event after successful payment
    if (this.userId && this.idEvent) {
      this.eventService.assignUserToEvent(this.userId, this.idEvent).subscribe(
        response => {
          console.log('User successfully assigned to event after payment:', response);
          // Afficher un message de succès
          this.toastr.success('Paiement effectué avec succès!', 'Succès');
          
          // Rediriger après un court délai pour permettre à l'utilisateur de voir le message
          setTimeout(() => {
            this.router.navigate([`/billet/${this.userId}/${this.idEvent}`]);
          }, 2000);
        },
        (error: any) => {
          console.error('Error assigning user to event after payment:', error);
          this.toastr.error('Une erreur est survenue lors du paiement', 'Erreur');
        }
      );
    } else {
      console.error('User ID or Event ID is missing. Cannot assign user to event.');
      this.toastr.error('Informations manquantes pour compléter le paiement', 'Erreur');
    }
  }
  /**
   * Reset the payment form
   */
  async resetPayment(): Promise<void> {
    this.paymentSuccess = false;
    this.currentEmail = '';
    this.paymentForm.reset({
      amount: '',
      email: '',
      name: '',
      description: ''
    });

    this.stripeService.cleanup();
    await this.initializeStripeElement();
  }

  /**
   * Get error message from Stripe or backend
   */
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



  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
