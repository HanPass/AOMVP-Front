import { Component } from '@angular/core';
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
        error: () => {
          this.errorMessage =
            "Échec de création du compte (API indisponible ou données invalides). Vérifiez que le backend AOMVP est démarré.";
        }
      });
  }

  showError(controlName: 'companyName' | 'email' | 'password' | 'acceptTerms'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }
}
