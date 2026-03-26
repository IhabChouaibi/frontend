import { Component } from '@angular/core';

import { PresenceService } from '../../../../core/services/presence-service/presence.service';
import { Presence } from '../../../../models/presence-service/presence';

@Component({
  selector: 'app-presence-list',
  standalone: false,
  templateUrl: './presence-list.html',
  styleUrl: './presence-list.scss',
})
export class PresenceList {
  presences: Presence[] = [];
  loading = false;
  error = '';
  page = 0;
  totalPages = 0;

  constructor(private readonly presenceService: PresenceService) {}

  ngOnInit(): void {
    this.load();
  }

  validate(item: Presence, validated: boolean): void {
    if (!item.id) {
      return;
    }

    this.presenceService.validatePresence(item.id, { validated }).subscribe({
      next: () => this.load(),
      error: (error: Error) => this.error = error.message
    });
  }

  changePage(step: number): void {
    const nextPage = this.page + step;

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.page = nextPage;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = '';

    this.presenceService.getPendingValidation(this.page, 10).subscribe({
      next: (response) => {
        this.presences = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
