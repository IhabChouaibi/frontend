import { NgModule } from '@angular/core';

import { EmployeeRoutingModule } from './employee-routing-module';
import { Profile } from './pages/profile/profile';
import { LeaveRequest } from './pages/leave-request/leave-request';
import { History } from './pages/history/history';
import { ProfileCard } from './components/profile-card/profile-card';
import { LeaveForm } from './components/leave-form/leave-form';
import { HistoryTable } from './components/history-table/history-table';
import { SharedModule } from '../../shared/shared-module';
import { PresenceComponent} from './pages/presence/presence';
import { StatusBadgeComponent } from './components/status-badge/status-badge';
import { PresenceCardComponent } from './components/presence-card/presence-card';
import { OrganizationInfoComponent } from './pages/organization-info/organization-info';


@NgModule({
  declarations: [
    Profile,
    LeaveRequest,
    History,
    ProfileCard,
    LeaveForm,
    HistoryTable,
    PresenceComponent,
    StatusBadgeComponent,
    PresenceCardComponent,
    OrganizationInfoComponent,
  ],
  imports: [
    SharedModule,
    EmployeeRoutingModule,
  ]
})
export class EmployeeModule { }
