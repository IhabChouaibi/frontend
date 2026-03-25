import { Component } from '@angular/core';
import { SidebarItem } from '../../shared/components/sidebar/sidebar-item';

@Component({
  selector: 'app-hr-layout',
  standalone: false,
  templateUrl: './hr-layout.html',
  styleUrl: './hr-layout.scss',
})
export class HrLayout {
  readonly sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/hr/dashboard' },
    { label: 'Employees', route: '/hr/employees' },
    { label: 'Leaves', route: '/hr/leaves' },
    { label: 'Presence', route: '/hr/presence' },
  ];
}
