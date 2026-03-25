import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing-module';
import { Dashboard } from './pages/dashboard/dashboard';
import { Candidates } from './pages/candidates/candidates';
import { Applications } from './pages/applications/applications';
import { Interviews } from './pages/interviews/interviews';
import { JobOffers } from './pages/job-offers/job-offers';
import { ApplicationRow } from './components/application-row/application-row';
import { CandidateCard } from './components/candidate-card/candidate-card';
import { InterviewModal } from './components/interview-modal/interview-modal';
import { JobForm } from './components/job-form/job-form';
import { SharedModule } from '../../shared/shared-module';
import { Departments } from './pages/departments/departments';
import { Jobs } from './pages/jobs/jobs';
import { LeaveValidation } from './pages/leave-validation/leave-validation';
import { Employees } from './pages/employees/employees';
import { PresenceList } from './pages/presence-list/presence-list';


@NgModule({
  declarations: [
    Dashboard,
    Candidates,
    Applications,
    Interviews,
    JobOffers,
    ApplicationRow,
    CandidateCard,
    InterviewModal,
    JobForm,
    Departments,
    Jobs,
    LeaveValidation,
    Employees,
    PresenceList,


  ],
  imports: [
    SharedModule,
    CommonModule,
    HrRoutingModule
  ]
})
export class HrModule { }
