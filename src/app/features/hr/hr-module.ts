import { NgModule } from '@angular/core';

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
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { LeaveTypeFormComponent } from './components/leave-type-form/leave-type-form';
import { LeaveTypes } from './pages/leave-types/leave-types';


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
    EmployeeFormComponent,
    LeaveTypeFormComponent,
    LeaveTypes,


  ],
  imports: [
    SharedModule,
    HrRoutingModule
  ]
})
export class HrModule { }
