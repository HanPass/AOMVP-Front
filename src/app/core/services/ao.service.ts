import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AO } from '../models/ao.model';
import { environment } from '../../../environments/environment';

const MOCK_AO: AO[] = [
  {
    id: 1,
    reference: 'AO-2026-001',
    title: 'Fourniture équipements IT pour administration centrale',
    sector: 'IT',
    region: 'Rabat',
    budget: 1500000,
    publicationDate: '2026-01-05',
    deadlineDate: '2026-03-01',
    status: 'open'
  },
  {
    id: 2,
    reference: 'AO-2026-009',
    title: 'Travaux de réhabilitation voirie urbaine',
    sector: 'BTP',
    region: 'Casablanca',
    budget: 9000000,
    publicationDate: '2026-01-12',
    deadlineDate: '2026-02-22',
    status: 'submitted'
  },
  {
    id: 3,
    reference: 'AO-2026-021',
    title: 'Prestations de maintenance applicative',
    sector: 'Services',
    region: 'Marrakech',
    budget: 700000,
    publicationDate: '2026-01-28',
    deadlineDate: '2026-03-11',
    status: 'open'
  }
];

@Injectable({ providedIn: 'root' })
export class AoService {
  constructor(private readonly http: HttpClient) {}

  getAO(filters?: { query?: string; sector?: string; status?: string }): Observable<AO[]> {
    if (!environment.useBackend) {
      const normalizedQuery = filters?.query?.toLowerCase().trim() ?? '';
      return of(
        MOCK_AO.filter((item) => {
          const byQuery =
            !normalizedQuery ||
            item.reference.toLowerCase().includes(normalizedQuery) ||
            item.title.toLowerCase().includes(normalizedQuery);
          const bySector = !filters?.sector || item.sector === filters.sector;
          const byStatus = !filters?.status || item.status === filters.status;
          return byQuery && bySector && byStatus;
        })
      );
    }

    let params = new HttpParams();
    Object.entries(filters ?? {}).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<BackendAO[]>(`${environment.apiUrl}/ao`, { params }).pipe(
      map((items) => items.map((item, index) => this.toAO(item, index)))
    );
  }

  private toAO(item: BackendAO, index: number): AO {
    return {
      id: item.id ?? index + 1,
      reference: item.reference ?? '',
      title: item.title ?? item.objet ?? '',
      sector: item.sector ?? item.domaine ?? 'Non classe',
      region: item.region ?? item.lieuExec ?? '',
      budget: Number(item.budget ?? item.budgetEstime ?? 0),
      publicationDate: item.publicationDate ?? item.datePublication ?? '',
      deadlineDate: item.deadlineDate ?? item.dateLimite ?? '',
      status: item.status ?? this.statusFromDeadline(item.deadlineDate ?? item.dateLimite)
    };
  }

  private statusFromDeadline(deadline?: string): AO['status'] {
    if (!deadline) {
      return 'open';
    }

    return new Date(deadline).getTime() >= Date.now() ? 'open' : 'closed';
  }
}

interface BackendAO {
  id?: number;
  reference?: string;
  title?: string;
  objet?: string;
  sector?: string;
  domaine?: string;
  region?: string;
  lieuExec?: string;
  budget?: number;
  budgetEstime?: number | string;
  publicationDate?: string;
  datePublication?: string;
  deadlineDate?: string;
  dateLimite?: string;
  status?: AO['status'];
}
