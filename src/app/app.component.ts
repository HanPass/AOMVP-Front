import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly isAuthenticated$ = this.sessionService.isAuthenticated$;
  readonly userEmail$ = this.sessionService.userEmail$;

  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.sessionService.endSession();
    this.router.navigateByUrl('/login');
  }
}
