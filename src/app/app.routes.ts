import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AoListComponent } from './features/ao/ao-list.component';
import { PreferencesComponent } from './features/preferences/preferences.component';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'ao', component: AoListComponent, canActivate: [authGuard] },
  { path: 'preferences', component: PreferencesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
