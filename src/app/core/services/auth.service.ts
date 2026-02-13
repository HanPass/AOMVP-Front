import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    if (!environment.useBackend) {
      return of({ token: `${email}-mock-token` });
    }

    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  register(payload: { companyName: string; email: string; password: string }): Observable<void> {
    if (!environment.useBackend) {
      return of(void 0);
    }

    return this.http.post<void>(`${environment.apiUrl}/auth/register`, payload);
  }
}
