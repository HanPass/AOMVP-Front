import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

    return this.http.get<AO[]>(`${environment.apiUrl}/ao`, { params });
  }
}
