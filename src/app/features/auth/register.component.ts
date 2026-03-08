import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly form = this.fb.nonNullable.group({
    companyName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    acceptTerms: [false, [Validators.requiredTrue]]
  });

  successMessage = '';
  errorMessage = '';
  loading = false;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.loading) {
      return;
    }

    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Merci de corriger les champs obligatoires avant de continuer.';
      this.successMessage = '';
      return;
    }

    const { companyName, email, password } = this.form.getRawValue();
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.authService
      .register({
        companyName,
        email,
        password
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Compte créé. Vous pouvez maintenant vous connecter.';
          setTimeout(() => this.router.navigateByUrl('/login'), 800);
        },
        error: (error) => {
          this.errorMessage = this.extractErrorMessage(error);
        }
      });
  }

  showError(controlName: 'companyName' | 'email' | 'password' | 'acceptTerms'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message || error.error?.error || error.error?.detail || '';

      if (apiMessage) {
        return `Échec de création du compte: ${apiMessage}`;
      }
    }

    if (error instanceof Error && error.message) {
      return `Échec de création du compte: ${error.message}`;
    }

    return "Échec de création du compte. Vérifiez le contrat d'API backend (route/payload) et réessayez.";
  }
}
