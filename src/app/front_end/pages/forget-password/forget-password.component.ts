import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitted = false;
  isSuccessful = false;
  errorMessage = '';

  private forgotPasswordUrl = 'http://localhost:8089/api/auth/forgot-password';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.http.post(this.forgotPasswordUrl, { email }, httpOptions).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.errorMessage = '';
      },
      error: (err) => {
        this.isSuccessful = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}
