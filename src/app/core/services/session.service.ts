import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly tokenStorage: TokenStorageService) {
    this.isAuthenticatedSubject.next(Boolean(this.tokenStorage.getToken()));
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  startSession(token: string): void {
    this.tokenStorage.setToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  endSession(): void {
    this.tokenStorage.clearToken();
    this.isAuthenticatedSubject.next(false);
  }
}
