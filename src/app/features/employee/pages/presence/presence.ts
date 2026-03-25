import { Component } from '@angular/core';
import {PresenceService} from '../../../../core/services/presence-service/presence-service';
import {Presence} from '../../../../models/presence-service/presence';

@Component({
  selector: 'app-presence',
  standalone: false,
  templateUrl: './presence.html',
  styleUrl: './presence.scss',
})
export class PresenceComponent {
  loading = false;
  message = '';
  error = '';

  presences: Presence[] = [];

  page = 0;
  totalPages = 0;

  employeeId = 1; // 🔥 à remplacer par AuthService

  constructor(private presenceService: PresenceService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  checkIn() {
    this.loading = true;

    const request = {
      employeeId: this.employeeId
    };

    this.presenceService.checkIn(request)
      .subscribe({
        next: () => {
          this.message = 'Check-in successful';
          this.loadHistory();
          this.loading = false;
        },
        error: () => {
          this.error = 'Check-in failed';
          this.loading = false;
        }
      });
  }

  checkOut() {
    this.loading = true;

    const request = {
      employeeId: this.employeeId
    };

    this.presenceService.checkOut(request)
      .subscribe({
        next: () => {
          this.message = 'Check-out successful';
          this.loadHistory();
          this.loading = false;
        },
        error: () => {
          this.error = 'Check-out failed';
          this.loading = false;
        }
      });
  }

  loadHistory() {
    this.presenceService.getEmployeeHistoryPaged(this.employeeId, this.page, 10)
      .subscribe(res => {
        this.presences = res.content;
        this.totalPages = res.totalPages;
      });
  }

  changePage(p: number) {
    this.page = p;
    this.loadHistory();
  }

}
