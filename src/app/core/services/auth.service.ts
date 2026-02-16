import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  login(email: string, password: string): Observable<{ token: string }> {
    if (!environment.useBackend) {
      return of({ token: `${email}-mock-token` }).pipe(
        tap((result) => {
          this.sessionService.startSession(result.token);
        })
      );
    }

    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((result) => {
        this.sessionService.startSession(result.token);
      })
    );
  }

  register(payload: { companyName: string; email: string; password: string }): Observable<void> {
    if (!environment.useBackend) {
      return of(void 0);
    }

    return this.http.post<void>(`${environment.apiUrl}/auth/register`, payload);
  }

  logout(): void {
    this.sessionService.endSession();
  }
}
