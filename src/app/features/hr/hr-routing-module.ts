import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Candidates } from './pages/candidates/candidates';
import { Applications } from './pages/applications/applications';
import { Interviews } from './pages/interviews/interviews';
import {Jobs} from './pages/jobs/jobs';
import {Departments} from './pages/departments/departments';
import {JobOffers} from './pages/job-offers/job-offers';
import { Employees } from './pages/employees/employees';
import { LeaveValidation } from './pages/leave-validation/leave-validation';
import { PresenceList } from './pages/presence-list/presence-list';

const routes: Routes = [
  {
    path: '',
    data: { roles: ['HR'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'employees', component: Employees },
      { path: 'leaves', component: LeaveValidation },
      { path: 'presence', component: PresenceList },
      { path: 'candidates', component: Candidates },
      { path: 'applications', component: Applications },
      { path: 'interviews', component: Interviews },

      { path: 'departments', component: Departments },
      { path: 'jobs', component: Jobs },

      { path: 'job-offers', component: JobOffers },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
