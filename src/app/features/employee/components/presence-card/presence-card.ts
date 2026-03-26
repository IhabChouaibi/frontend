import { Component, Input } from '@angular/core';

import { Presence } from '../../../../models/presence-service/presence';

@Component({
  selector: 'app-presence-card',
  standalone: false,
  templateUrl: './presence-card.html',
  styleUrl: './presence-card.scss',
})
export class PresenceCardComponent {
  @Input() presence: Presence | null = null;
}
