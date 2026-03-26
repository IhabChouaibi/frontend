import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { LeaveRequest } from './pages/leave-request/leave-request';
import { History } from './pages/history/history';
import { PresenceComponent } from './pages/presence/presence';
import { OrganizationInfoComponent } from './pages/organization-info/organization-info';

const routes: Routes = [
  {
    path: '',
    data: { roles: ['EMPLOYEE'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Profile },
      { path: 'profile', component: Profile },
      { path: 'leave-request', component: LeaveRequest },
      { path: 'history', component: History },
      { path: 'presence', component: PresenceComponent },
      { path: 'organization', component: OrganizationInfoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
