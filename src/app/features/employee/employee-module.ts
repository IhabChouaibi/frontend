import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing-module';
import { Profile } from './pages/profile/profile';
import { LeaveRequest } from './pages/leave-request/leave-request';
import { History } from './pages/history/history';
import { ProfileCard } from './components/profile-card/profile-card';
import { LeaveForm } from './components/leave-form/leave-form';
import { HistoryTable } from './components/history-table/history-table';
import { SharedModule } from '../../shared/shared-module';
import {FormsModule} from '@angular/forms';
import { PresenceComponent} from './pages/presence/presence';


@NgModule({
  declarations: [
    Profile,
    LeaveRequest,
    History,
    ProfileCard,
    LeaveForm,
    HistoryTable,
    PresenceComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class EmployeeModule { }
