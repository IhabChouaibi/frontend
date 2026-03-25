import { Component } from '@angular/core';
import { SidebarItem } from '../../shared/components/sidebar/sidebar-item';

@Component({
  selector: 'app-employee-layout',
  standalone: false,
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.scss',
})
export class EmployeeLayout {
  readonly sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/employee/dashboard' },
    { label: 'Leaves', route: '/employee/leave-request' },
    { label: 'Presence', route: '/employee/presence' },
  ];
}
