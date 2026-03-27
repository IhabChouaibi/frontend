import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButton } from './components/app-button/app-button';
import { FormInput } from './components/form-input/form-input';
import { AppTable } from './components/app-table/app-table';
import { AppModal } from './components/app-modal/app-modal';
import { Loader } from './components/loader/loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from './utils/pipes/truncate-pipe';
import { DateFormatPipe } from './utils/pipes/date-format-pipe';
import { FilterPipe } from './utils/pipes/filter-pipe';
import { HasRole } from './utils/directives/has-role';
import { Loading } from './utils/directives/loading';
import { Navbar } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppButton,
    FormInput,
    AppTable,
    AppModal,
    Loader,
    TruncatePipe,
    DateFormatPipe,
    FilterPipe,
    HasRole,
    Loading,
    Navbar,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],

  exports: [
    AppButton,
    FormInput,
    AppTable,
    AppModal,
    Loader,
    TruncatePipe,
    DateFormatPipe,
    FilterPipe,
    HasRole,
    Loading,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Navbar,
    SidebarComponent
  ]
})
export class SharedModule { }
