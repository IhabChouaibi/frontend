import { Component, OnInit } from '@angular/core';

import { PresenceService } from '../../../../core/services/presence-service/presence-service';
import { Presence } from '../../../../models/presence-service/presence';

@Component({
  selector: 'app-presence-list',
  standalone: false,
  templateUrl: './presence-list.html',
  styleUrl: './presence-list.scss',
})
export class PresenceList implements OnInit {
  presences: Presence[] = [];
  loading = false;
  error = '';
  page = 0;
  totalPages = 0;

  constructor(private readonly presenceService: PresenceService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.presenceService.getAll({ page: this.page, size: 10 }).subscribe({
      next: (response) => {
        this.presences = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.load();
  }
}
