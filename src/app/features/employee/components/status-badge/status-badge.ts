import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: false,
  templateUrl: './status-badge.html',
})
export class StatusBadgeComponent {
  @Input() status = 'PENDING';

  get statusClass(): string {
    return `status-badge--${this.status.toLowerCase().replace(/\s+/g, '_')}`;
  }
}
