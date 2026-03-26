import { Component, Input } from '@angular/core';

import { Employee } from '../../../../models/employee-service/employee';

@Component({
  selector: 'app-profile-card',
  standalone: false,
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  @Input() employee: Employee | null = null;
  @Input() username: string | null = '';
}
