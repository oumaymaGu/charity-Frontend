import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';

@Component({
  selector: 'app-donor-contact',
  templateUrl: './donor-contact.component.html',
  styleUrls: ['./donor-contact.component.css']
})
export class DonorContactComponent implements OnInit {
  contactForm: FormGroup;
  donorEmail: string = 'Chargement...';
  donorName: string = '';
  donationId: string | null = null;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private donationRequestService: DonationRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required],
      deliveryMethod: ['pickup', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id');
    if (this.donationId) {
      this.loadDonorInfo();
    } else {
      this.snackBar.open('Invalid donation ID.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/material-donation-list']);
    }
  }

  loadDonorInfo(): void {
    const donorInfo = this.donationRequestService.getDonorInfo();
    if (donorInfo) {
      this.donorEmail = donorInfo.email;
      this.donorName = donorInfo.name;
    } else {
      this.snackBar.open('Unable to load donor information.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/material-donation-list']);
    }
  }

  submitRequest(): void {
    if (this.contactForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: any = {
      donationId: this.donationId,
      fullName: this.contactForm.value.fullName,
      userEmail: this.contactForm.value.userEmail,
      phone: this.contactForm.value.phone,
      message: this.contactForm.value.message,
      deliveryMethod: this.contactForm.value.deliveryMethod,
      termsAccepted: this.contactForm.value.termsAccepted,
      donorEmail: this.donorEmail,
      donorName: this.donorName,
      status: 'pending'
    };

    // Simulate API call
    setTimeout(() => {
      this.donationRequestService.addRequest(request);
      this.isSubmitting = false;
      this.showSuccess = true;

      // Redirect after 5 seconds
      setTimeout(() => {
        this.contactForm.reset({
          deliveryMethod: 'pickup',
          termsAccepted: false
        });
        this.showSuccess = false;
        this.router.navigate(['/material-donation-list']);
      }, 5000);
    }, 1500);
  }

  private markAllAsTouched(): void {
    Object.values(this.contactForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() { return this.contactForm.controls; }
}