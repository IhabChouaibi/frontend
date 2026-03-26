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
    { label: 'Leave Types', route: '/hr/leave-types' },
    { label: 'Leave Validations', route: '/hr/leaves' },
    { label: 'Presence', route: '/hr/presence' },
    { label: 'Departments', route: '/hr/departments' },
    { label: 'Jobs', route: '/hr/jobs' },
    { label: 'Job Offers', route: '/hr/job-offers' },
    { label: 'Candidates', route: '/hr/candidates' },
    { label: 'Applications', route: '/hr/applications' },
    { label: 'Interviews', route: '/hr/interviews' },
  ];
}
