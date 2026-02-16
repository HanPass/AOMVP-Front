import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './auth.component.css'
})
export class RegisterComponent {
  readonly form = this.fb.group({
    companyName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    acceptTerms: [false, [Validators.requiredTrue]]
  });

  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { companyName, email, password } = this.form.getRawValue();
    this.errorMessage = '';

    this.authService
      .register({
        companyName: companyName ?? '',
        email: email ?? '',
        password: password ?? ''
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Compte créé. Vous pouvez maintenant vous connecter.';
          setTimeout(() => this.router.navigateByUrl('/login'), 800);
        },
        error: () => {
          this.errorMessage = 'Échec de création du compte.';
        }
      });
  }
}
