import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string = '';
  isSubmitted = false;
  isSuccessful = false;
  isTokenInvalid = false;
  errorMessage = '';

  private resetPasswordUrl = 'http://localhost:8089/api/auth/reset-password';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.isTokenInvalid = true;
      return;
    }

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.http.post(this.resetPasswordUrl, {
      token: this.token,
      password: this.f['password'].value
    }, httpOptions).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/log']);
        }, 3000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.isSuccessful = false;
      }
    });
  }
}
