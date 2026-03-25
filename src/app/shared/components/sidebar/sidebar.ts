import { Component, Input } from '@angular/core';

import { SidebarItem } from './sidebar-item';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() title = 'HRMS';
  @Input() items: SidebarItem[] = [];
}
