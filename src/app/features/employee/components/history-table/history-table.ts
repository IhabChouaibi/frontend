import { Component, Input } from '@angular/core';

import { Leave } from '../../../../models/leave-service/leave';

@Component({
  selector: 'app-history-table',
  standalone: false,
  templateUrl: './history-table.html',
  styleUrl: './history-table.scss',
})
export class HistoryTable {
  @Input() leaves: Leave[] = [];
}
