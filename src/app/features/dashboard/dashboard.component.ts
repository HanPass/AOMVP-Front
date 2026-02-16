import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';

import { AO } from '../../core/models/ao.model';
import { AoService } from '../../core/services/ao.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  items: AO[] = [];
  readonly funnelSteps = [
    { label: 'Ouverts', value: 24 },
    { label: 'Préqualifiés', value: 15 },
    { label: 'Soumis', value: 8 },
    { label: 'Attribués', value: 3 }
  ];

  constructor(private readonly aoService: AoService) {}

  ngOnInit(): void {
    this.aoService.getAO().subscribe((items) => {
      this.items = items;
    });
  }
}
