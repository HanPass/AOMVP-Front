import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DEFAULT_USER_PREFERENCES, UserPreferences } from '../models/user-preferences.model';

const PREFERENCES_STORAGE_KEY = 'aomvp.user.preferences';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  constructor(private readonly http: HttpClient) {}

  getPreferences(): Observable<UserPreferences> {
    if (!environment.useBackend) {
      const rawValue = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!rawValue) {
        return of(DEFAULT_USER_PREFERENCES);
      }

      try {
        const savedPreferences = JSON.parse(rawValue) as Partial<UserPreferences>;
        return of({ ...DEFAULT_USER_PREFERENCES, ...savedPreferences });
      } catch {
        return of(DEFAULT_USER_PREFERENCES);
      }
    }

    return this.http.get<UserPreferences>(`${environment.apiUrl}/users/me/preferences`);
  }

  savePreferences(preferences: UserPreferences): Observable<UserPreferences> {
    if (!environment.useBackend) {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      return of(preferences);
    }

    return this.http.put<UserPreferences>(`${environment.apiUrl}/users/me/preferences`, preferences);
  }
}
