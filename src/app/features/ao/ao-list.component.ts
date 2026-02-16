import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AO } from '../../core/models/ao.model';
import { AoService } from '../../core/services/ao.service';

@Component({
  selector: 'app-ao-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './ao-list.component.html',
  styleUrl: './ao-list.component.css'
})
export class AoListComponent implements OnInit {
  readonly filtersForm = this.fb.nonNullable.group({
    query: [''],
    sector: [''],
    status: ['']
  });

  aoList: AO[] = [];
  readonly sectors = ['IT', 'BTP', 'Services'];
  readonly statuses = [
    { value: 'open', label: 'Ouvert' },
    { value: 'submitted', label: 'Soumis' },
    { value: 'awarded', label: 'Attribué' },
    { value: 'closed', label: 'Clôturé' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly aoService: AoService
  ) {}

  ngOnInit(): void {
    this.loadAO();
  }

  loadAO(): void {
    this.aoService.getAO(this.filtersForm.getRawValue()).subscribe((items) => {
      this.aoList = items;
    });
  }

  clearFilters(): void {
    this.filtersForm.reset({ query: '', sector: '', status: '' });
    this.loadAO();
  }
}
