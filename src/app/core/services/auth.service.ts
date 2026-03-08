import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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

    const endpoints = ['/auth/register', '/auth/signup', '/users/register', '/users/signup'];
    const payloadVariants = this.buildRegisterPayloadVariants(payload);

    return this.tryRegister(endpoints, payloadVariants);
  }

  private buildRegisterPayloadVariants(payload: RegisterPayload): Array<Record<string, string>> {
    const withConfirmation = {
      passwordConfirmation: payload.password,
      confirmPassword: payload.password
    };

    return [
      { ...payload, ...withConfirmation },
      { email: payload.email, password: payload.password, company: payload.companyName, ...withConfirmation },
      { email: payload.email, password: payload.password, name: payload.companyName, ...withConfirmation },
      {
        email: payload.email,
        password: payload.password,
        username: payload.email,
        fullName: payload.companyName,
        ...withConfirmation
      }
    ];
  }

  private tryRegister(endpoints: string[], payloadVariants: Array<Record<string, string>>, attempt = 0): Observable<void> {
    if (attempt >= endpoints.length * payloadVariants.length) {
      return throwError(() => new Error("Aucune route d'inscription compatible n'a été trouvée côté backend."));
    }

    const endpoint = endpoints[attempt % endpoints.length];
    const payload = payloadVariants[Math.floor(attempt / endpoints.length) % payloadVariants.length];

    return this.postRegister(`${environment.apiUrl}${endpoint}`, payload).pipe(
      catchError((error) => this.tryRegister(endpoints, payloadVariants, attempt + 1).pipe(catchError(() => throwError(() => error))))
    );
  }

  private postRegister(url: string, payload: Record<string, string>): Observable<void> {
    return this.http.post(url, payload, { responseType: 'text' }).pipe(timeout(10000), map(() => void 0));
  }
}
