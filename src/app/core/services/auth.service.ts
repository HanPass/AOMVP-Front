import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

interface RegisterPayload {
  companyName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    if (!environment.useBackend) {
      return of({ token: `${email}-mock-token` });
    }

    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  register(payload: RegisterPayload): Observable<void> {
    if (!environment.useBackend) {
      return of(void 0);
    }

    const normalizedPayload = {
      ...payload,
      company: payload.companyName,
      name: payload.companyName
    };

    return this.postRegister(`${environment.apiUrl}/auth/register`, normalizedPayload).pipe(
      catchError(() => this.postRegister(`${environment.apiUrl}/auth/signup`, normalizedPayload))
    );
  }

  private postRegister(url: string, payload: Record<string, string>): Observable<void> {
    return this.http.post(url, payload, { responseType: 'text' }).pipe(timeout(10000), map(() => void 0));
  }
}
