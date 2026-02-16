import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TokenStorageService } from './token-storage.service';

const USER_EMAIL_KEY = 'aomvp.auth.userEmail';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly userEmailSubject = new BehaviorSubject<string | null>(null);
  readonly userEmail$ = this.userEmailSubject.asObservable();

  constructor(private readonly tokenStorage: TokenStorageService) {
    this.isAuthenticatedSubject.next(Boolean(this.tokenStorage.getToken()));
    this.userEmailSubject.next(localStorage.getItem(USER_EMAIL_KEY));
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  startSession(token: string, userEmail: string): void {
    this.tokenStorage.setToken(token);
    localStorage.setItem(USER_EMAIL_KEY, userEmail);
    this.userEmailSubject.next(userEmail);
    this.isAuthenticatedSubject.next(true);
  }

  endSession(): void {
    this.tokenStorage.clearToken();
    localStorage.removeItem(USER_EMAIL_KEY);
    this.userEmailSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
