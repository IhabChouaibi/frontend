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
    { label: 'Profile', route: '/employee/profile' },
    { label: 'Leave Request', route: '/employee/leave-request' },
    { label: 'Leave History', route: '/employee/history' },
    { label: 'Presence', route: '/employee/presence' },
    { label: 'Organization', route: '/employee/organization' },
  ];
}
