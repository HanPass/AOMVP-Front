import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PreferencesService } from '../../core/services/preferences.service';
import { UserPreferences } from '../../core/models/user-preferences.model';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  readonly preferencesForm = this.fb.group({
    language: this.fb.control<'fr' | 'en'>('fr', { validators: [Validators.required], nonNullable: true }),
    theme: this.fb.control<'light' | 'dark'>('light', { validators: [Validators.required], nonNullable: true }),
    emailNotifications: this.fb.control(true, { nonNullable: true }),
    dashboardDefaultView: this.fb.control<'funnel' | 'list'>('funnel', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly preferencesService: PreferencesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.preferencesService.getPreferences().subscribe({
      next: (preferences) => {
        this.preferencesForm.patchValue(preferences);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger vos préférences.';
      }
    });
  }

  submit(): void {
    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.preferencesService.savePreferences(this.preferencesForm.getRawValue() as UserPreferences).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Vos préférences ont été enregistrées.';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Échec de sauvegarde des préférences.";
      }
    });
  }
}
